
import { Router } from 'express';
import { getAIItinerary, getAIDescription } from '../controllers/ai.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyJWT);

router.route("/generate-itinerary").post(getAIItinerary);
router.route("/generate-description").post(getAIDescription);

export default router;