
import { Router } from 'express';
import { createBooking, getMyBookings } from '../controllers/booking.controller.js';
import { verifyJWT } from '../middleware/authMiddleware.js';
import { validateSchema } from '../middleware/middleware.js';
import { bookingSchema } from '../utils/SchemaValidation.js';

const router = Router();

router.use(verifyJWT);

router.post("/", createBooking);
router.get("/my-bookings", getMyBookings);

export default router;
