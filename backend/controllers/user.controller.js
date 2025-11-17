import { User } from '../models/user.model.js';
import { uploadCloudinary } from '../config/cloudinary.js';
import bcrypt from 'bcryptjs';
import { getToken } from '../middleware/authMiddleware.js';
import { ExpressError } from '../utils/ExpressError.js';
import { wrapAsync } from '../utils/wrapAsync.js';

const registerUser = wrapAsync(async (req, res) => {
    const { email, password, fullName } = req.body;

    if (!email || !password || !fullName) {
        throw new ExpressError(400, "Email, password, and full name are required")
    }

    const existedUser = await User.findOne({ email });
    if (existedUser) {
        throw new ExpressError(409, "User already exists")
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        email,
        password: hashedPassword,
        profile: { fullName, }
    });

    const safeuser = user.toObject();
    delete safeuser.password;

    res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: safeuser
    });
    
});


const loginUser = wrapAsync(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        throw new ExpressError(400, "User not found")
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        throw new ExpressError(401, "Invalid password");
    }

    const token = getToken(res, user._id, user.email);

    const loggedInUser = await User.findById(user._id).select("-password");
    res.status(200).json({ success: true, message: "Login successful", data: { user: loggedInUser } });
});

const getCurrentUser = wrapAsync(async (req, res) => {
    res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: req.user
    });
});

const updateUserProfile = wrapAsync(async (req, res) => {
    const { fullName } = req.body;

    if (!fullName) {
        throw new ExpressError(400, "Provide the fullName");
    }
    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ExpressError(401, "User Not Found ")
    }

    if (fullName) user.profile.fullName = fullName.trim();
    await user.save();
    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: user.profile
    });
});



const updateUserAvatar = wrapAsync(async (req, res) => {
    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) {
        throw new ExpressError(400, "Image is not provided");
    }

    const avatar = await uploadCloudinary(avatarLocalPath);
    if (!avatar.url) {
        throw new ExpressError(500, "Error Occured while uploading try again later");
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


const logoutUser = wrapAsync(async (req, res) => {
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
