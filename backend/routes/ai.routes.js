
import { Router } from 'express';
import { getAIItinerary, getAIDescription } from '../controllers/ai.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();
router.use(verifyJWT);

router.post("/generate-itinerary", getAIItinerary);
router.post("/generate-description", getAIDescription);


export default router;