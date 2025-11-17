
import { Router } from 'express';
import { createReview, getPropertyReviews, deleteReview } from '../controllers/review.controller.js';
import { verifyJWT } from '../middleware/authMiddleware.js';
import { validateSchema } from '../middleware/middleware.js';
import { reviewSchema } from '../utils/SchemaValidation.js';

const router = Router({ mergeParams: true });

router.get("/", getPropertyReviews);
router.post("/", verifyJWT,validateSchema(reviewSchema), createReview);
router.delete("/:reviewId", verifyJWT, deleteReview);

export default router;