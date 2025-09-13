import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/apiError.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import { Review } from './review.model.js';
import { Property } from '../properties/property.model.js';
import { redisClient } from '../../config/redis.js'; 

const REVIEW_CACHE_EXPIRY = 60 * 5; 
// CREATE REVIEW
const createReview = asyncHandler(async (req, res) => {
    const { propertyId } = req.params;
    const { rating, comment } = req.body;
    const guestId = req.user._id;

    if (!rating || !comment) {
        return new ApiResponse(401,"", "Rating and comment are required.");
    }

    const property = await Property.findById(propertyId);
    if (!property) {
        return res.status(401).json( {message:"Property not found.",success:false})
    }

    const existingReview = await Review.findOne({ property: propertyId, guest: guestId });
    if (existingReview) {
        return res.status(401).json(
            new ApiResponse(201, existingReview, "You have already submitted a review for this property.")
        );
    }

    const review = await Review.create({
        property: propertyId,
        guest: guestId,
        rating,
        comment
    });

    if (!review) {
        return res.status(401).json(
            new ApiResponse(201, existingReview, "Failed to create review.")
        );
    }

    property.reviews.push(review._id);
    await property.save();

    await redisClient.del(`property:${propertyId}:reviews`);

    return res.status(201).json(
        new ApiResponse(201, review, "Review submitted successfully.")
    );
});

// GET PROPERTY 
const getPropertyReviews = asyncHandler(async (req, res) => {
    const { propertyId } = req.params;
    const cacheKey = `property:${propertyId}:reviews`;

    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
        return res.status(200).json(
            new ApiResponse(200, JSON.parse(cachedData), "Reviews retrieved from cache.")
        );
    }

    const reviews = await Review.find({ property: propertyId })
        .populate('guest', 'profile.fullName profile.profilePictureUrl');

    if (!reviews || reviews.length === 0) {
        return res.status(200).json(
            new ApiResponse(200, [], "No reviews found for this property.")
        );
    }

    await redisClient.set(cacheKey, JSON.stringify(reviews), 'EX', REVIEW_CACHE_EXPIRY);

    return res.status(200).json(
        new ApiResponse(200, reviews, "Reviews retrieved successfully.")
    );
});

const deleteReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const guestId = req.user._id;

    const review = await Review.findById(reviewId);
    if (!review) {
        return res.status(401).json(
            new ApiResponse(404, {}, "Reaview not found.")
        );
    }

    if (review.guest.toString() !== guestId.toString()) {
         return res.status(401).json(
            new ApiResponse(201, {}, "You are not authorized to delete this review.")
        );
    }

    await Property.findByIdAndUpdate(review.property, {
        $pull: { reviews: review._id }
    });

    await review.deleteOne();

    await redisClient.del(`property:${review.property}:reviews`);

    return res.status(200).json(
        new ApiResponse(200, { deletedReviewId: reviewId }, "Review deleted successfully.")
    );
});

export { createReview, getPropertyReviews, deleteReview };
