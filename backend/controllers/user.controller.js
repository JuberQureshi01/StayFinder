import { asyncHandler } from '../middlewares/asyncHandler.js';
import { User } from '../model/user.model.js';
import { uploadOnCloudinary } from '../config/cloudinary.js';
import bcrypt from 'bcryptjs';
import { getToken } from '../middlewares/auth.middleware.js';

const registerUser = asyncHandler(async (req, res) => {
    const { email, password, fullName } = req.body;

    if (!email || !password || !fullName) {
        return res.status(400).json({
            success: false,
            message: "Email, password, and full name are required"
        });
    }

    const existedUser = await User.findOne({ email });
    if (existedUser) {
        return res.status(409).json({
            success: false,
            message: "User already exists"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        email,
        password: hashedPassword,
        profile: { fullName, }
    }).select("-password");

    res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: user
    });
});


const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        return res.status(401).json({
            success: false,
            message: "Invalid credentials"
        });
    }

    const token = getToken(res,user._id,user.email);

    const loggedInUser = await User.findById(user._id).select("-password");
    res.status(200).json({ success: true, message: "Login successful", data: { user: loggedInUser } });
});

const getCurrentUser = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: req.user
    });
});



const updateUserProfile = asyncHandler(async (req, res) => {
    const { fullName, bio } = req.body;

    if (!fullName && !bio) {
        return res.status(400).json({
            success: false,
            message: "At least one field is required to update"
        });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    if (fullName) user.profile.fullName = fullName.trim();
    if (bio) user.profile.bio = bio.trim();

    await user.save();

    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: user.profile
    });
});



const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        return res.status(400).json({
            success: false,
            message: "Avatar file is missing"
        });
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar.url) {
        return res.status(500).json({
            success: false,
            message: "Error while uploading avatar"
        });
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: { "profile.profilePictureUrl": avatar.url } },
        { new: true }
    ).select("-password");

    res.status(200).json({
        success: true,
        message: "Avatar updated successfully",
        data: user
    });
});


const logoutUser = asyncHandler(async (req, res) => {
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none'
    };

    res.clearCookie("accessToken", options);

    res.status(200).json({
        success: true,
        message: "User logged out successfully"
    });
});

export {
    registerUser,
    loginUser,
    getCurrentUser,
    updateUserProfile,
    updateUserAvatar,
    logoutUser
};
