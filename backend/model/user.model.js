import mongoose, { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const profileSchema = new Schema({
    fullName: { type: String, trim: true },
    bio: { type: String, trim: true },
    profilePictureUrl: { type: String },
});


const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true, // Good for search performance
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    profile: profileSchema,
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        { _id: this._id, email: this.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn:'7d' } // Set this to '7d' in your .env
    );
};

export const User = mongoose.model("User", userSchema);