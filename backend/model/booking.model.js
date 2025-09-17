import mongoose, { Schema } from 'mongoose';

const bookingSchema = new Schema({
    property: {
        type: Schema.Types.ObjectId,
        ref: "Property",
        required: true,
    },
    guest: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    host: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    checkInDate: {
        type: Date,
        required: true,
    },
    checkOutDate: {
        type: Date,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['PENDING_APPROVAL', 'CONFIRMED', 'CANCELLED', 'COMPLETED'],
        default: 'PENDING_APPROVAL',
    },
}, { timestamps: true });

export const Booking = mongoose.model("Booking", bookingSchema);