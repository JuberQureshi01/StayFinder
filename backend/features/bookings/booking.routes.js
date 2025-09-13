
import { Router } from 'express';
import { createBooking, getMyBookings } from './booking.controller.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyJWT);
router.route("/my-bookings").get(getMyBookings);
router.route("/").post(createBooking);

export default router;
