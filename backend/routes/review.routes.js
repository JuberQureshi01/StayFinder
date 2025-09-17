
import { Router } from 'express';
import { createReview, getPropertyReviews, deleteReview } from '../controllers/review.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router({ mergeParams: true });

router.route("/").get(getPropertyReviews);
router.route("/").post(verifyJWT, createReview);
router.route("/:reviewId").delete(verifyJWT, deleteReview)


export default router;