import { asyncHandler } from '../middlewares/asyncHandler.js';
import { Review } from '../model/review.model.js';
import { Property } from '../model/property.model.js';
import { redisClient } from '../config/redis.js';

const REVIEW_CACHE_EXPIRY = 60 * 5;


const createReview = asyncHandler(async (req, res) => {
    const { propertyId } = req.params;
    const { rating, comment } = req.body;
    const guestId = req.user._id;

    if (!rating || !comment) {
        return res.status(400).json({ success: false, message: "Rating and comment are required." });
    }


    const property = await Property.findById(propertyId);
    if (!property) {
        return res.status(404).json({ success: false, message: "Property not found." });
    }

    const existingReview = await Review.findOne({ property: propertyId, guest: guestId });
    if (existingReview) {
        return res.status(400).json({ success: false, message: "You have already submitted a review for this property." });
    }

    const review = await Review.create({
        property: propertyId,
        guest: guestId,
        rating,
        comment,
    });

    property.reviews.push(review._id);
    await property.save();

    await redisClient.del(`property:${propertyId}:reviews`);

    return res.status(201).json({
        success: true,
        message: "Review submitted successfully.",
        data: review,
    });
});


const getPropertyReviews = asyncHandler(async (req, res) => {
    const { propertyId } = req.params;
    const cacheKey = `property:${propertyId}:reviews`;

    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
        return res.status(200).json({
            success: true,
            message: "Reviews retrieved from cache.",
            data: JSON.parse(cachedData),
        });
    }


    const reviews = await Review.find({ property: propertyId })
        .populate('guest', 'profile.fullName profile.profilePictureUrl');

    if (!reviews || reviews.length === 0) {
        return res.status(200).json({
            success: true,
            message: "No reviews found for this property.",
            data: [],
        });
    }

    await redisClient.set(cacheKey, JSON.stringify(reviews), 'EX', REVIEW_CACHE_EXPIRY);

    return res.status(200).json({
        success: true,
        message: "Reviews retrieved successfully.",
        data: reviews,
    });
});


const deleteReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const guestId = req.user._id;


    const review = await Review.findById(reviewId);
    if (!review) {
        return res.status(404).json({ success: false, message: "Review not found." });
    }

    if (review.guest.toString() !== guestId.toString()) {
        return res.status(403).json({ success: false, message: "You are not authorized to delete this review." });
    }

    await Property.findByIdAndUpdate(review.property, { $pull: { reviews: review._id } });


    await review.deleteOne();

 
    await redisClient.del(`property:${review.property}:reviews`);

    return res.status(200).json({
        success: true,
        message: "Review deleted successfully.",
        deletedReviewId: reviewId,
    });
});

export { createReview, getPropertyReviews, deleteReview };
