import mongoose, { Schema } from 'mongoose';
import { Review } from './review.model.js';

const propertySchema = new Schema({
    host: {
        type: Schema.Types.ObjectId, ref: "User",
         required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    propertyType: {
        type: String,
        enum: ['APARTMENT', 'HOUSE', 'HOTEL', 'UNIQUE_STAY'],
         required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Trending', 'Mountains', 'Beachfront', 'Swimming Pools', 'Countryside', 'City Center']
    },
    location: {
        type: String,
        required: true,
        index: true 
    },
    amenities: [String],
    basePricePerNight: {
        type: Number,
         required: true
    },
    imageUrls: {
        type: [String],
         default: []
    },
    reviews: [{
        type: Schema.Types.ObjectId, ref: "Review"
    }]
}, { timestamps: true });


propertySchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    try {
        const propertyId = this._id;
        await Review.deleteMany({ property: propertyId });
        next();
    } catch (error) {
        next(error);
    }
});

export const Property = mongoose.model("Property", propertySchema);