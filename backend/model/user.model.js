import mongoose, { Schema } from 'mongoose';

const profileSchema = new Schema(
    {
        fullName: {
            type: String,
            trim: true
        },
        bio: {
            type: String,
            trim: true
        },
        profilePictureUrl: {
            type: String
        },
    });


const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    profile: profileSchema,
}, {
    timestamps: true
}
);


export const User = mongoose.model("User", userSchema);