import { asyncHandler } from "./asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized request. Please login first.",
            });
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid access token.",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error?.message || "Invalid access token.",
        });
    }
});

export const getToken = (res, userId, userEmail) => {
    try {
        const payload = {
            _id: userId,
            email: userEmail,
        };

        const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "7d", 
        });

        const cookieOptions = {
            httpOnly: true, 
            secure: true,
            sameSite: "none", 
            maxAge: 7 * 24 * 60 * 60 * 1000,
        };

        res.cookie("accessToken", token, cookieOptions);
        return token;
    } catch (error) {
        throw new Error("Error generating token");
    }
};
