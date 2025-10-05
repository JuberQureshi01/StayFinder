
import { Router } from 'express';
import { createReview, getPropertyReviews, deleteReview } from '../controllers/review.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router({ mergeParams: true });

router.get("/", getPropertyReviews);
router.post("/", verifyJWT, createReview);
router.delete("/:reviewId", verifyJWT, deleteReview);

export default router;