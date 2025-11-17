import { wrapAsync } from "../utils/wrapAsync.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ExpressError } from "../utils/ExpressError.js";

export const verifyJWT = wrapAsync(async (req, res, next) => {

    const token = req.cookies?.accessToken;

    if (!token) {
        throw new ExpressError(401, "Unauthorized request. Please login first");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
        throw new ExpressError(401, "Invalid access token.");
    }

    req.user = user;
    next();
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
            secure: process.env.NODE_ENV === 'production',
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        };

        res.cookie("accessToken", token, cookieOptions);
        return token;
    } catch (error) {
        throw new Error("Error generating token");
    }
};
