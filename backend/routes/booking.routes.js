
import { Router } from 'express';
import { createBooking, getMyBookings } from '../controllers/booking.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyJWT);

router.post("/", createBooking);
router.get("/my-bookings", getMyBookings);

export default router;
