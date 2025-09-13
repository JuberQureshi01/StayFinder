
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/apiError.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import { User } from './user.model.js';
import { uploadOnCloudinary } from '../../config/cloudinary.js';

const registerUser = asyncHandler(async (req, res) => {
    const { email, password, fullName } = req.body;
    if (!email || !password || !fullName) {
        return res.status(201).json(
            new ApiResponse(400, "Email, password, and full name are required"));
    }
    const existedUser = await User.findOne({ email });
    if (existedUser) {
        return res.status(401).json(
            { message: "User Already Exist", success: false });
    }
    const user = await User.create({
        email,
        password,
        profile: {
            fullName: fullName,
            completionProgress: 25
        }
    });
    if (!user) {
        return res.status(401).json(
            { message: "Something went wrong while registering the user", success: false });
    }

    return res.status(201).json(
        new ApiResponse(201, { userId: user._id, email: user.email }, "User registered successfully")
    );
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.isPasswordCorrect(password))) {
        return res.status(401).json(
            { message: "Invalid email or password", success: false });
    }

    const accessToken = user.generateAccessToken();
    const loggedInUser = await User.findById(user._id).select("-password");

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    };


    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .json(new ApiResponse(200, { user: loggedInUser, accessToken }, "User logged in successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, req.user, "User fetched successfully"));
});

const updateUserProfile = asyncHandler(async (req, res) => {
    const { fullName } = req.body;
    if (!fullName || typeof fullName !== "string" || fullName.trim() === "") {
        return res.status(401).json(
            { message: "Full name is required", success: false });
    }
    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(404, "User not found.");
    }
    user.profile.fullName = fullName.trim();
    await user.save({ validateBeforeSave: false });
    return res.status(200).json(
        new ApiResponse(200, user.profile, "Profile updated successfully.")
    );
});

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        return res.status(201).json(
            new ApiResponse(400, "Avatar file is missing"))
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar.url) {
        throw new ApiError(500, "Error while uploading avatar");
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: { "profile.profilePictureUrl": avatar.url } },
        { new: true }
    ).select("-password");

    return res.status(200).json(
        new ApiResponse(200, user, "Avatar image updated successfully")
    );
});
const logoutUser = asyncHandler(async (req, res) => {
    const options = {
        httpOnly: true,
        secure: true,       
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .json(new ApiResponse(200, {}, "User logged out"));
});
export { registerUser, loginUser, getCurrentUser, updateUserProfile, updateUserAvatar, logoutUser };

