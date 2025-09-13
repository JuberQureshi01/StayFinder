
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import { BookingService } from './booking.service.js';
import { Booking } from './booking.model.js';
import { ApiError } from '../../utils/apiError.js'; 

const bookingService = new BookingService();

const createBooking = asyncHandler(async (req, res) => {
    const { propertyId, checkInDate, checkOutDate } = req.body;
    const guestId = req.user._id;

    const newBooking = await bookingService.createBooking(
        propertyId,
        guestId,
        checkInDate,
        checkOutDate
    );

    return res.status(201).json(
        new ApiResponse(201, newBooking, "Booking created successfully.")
    );
});

const getMyBookings = asyncHandler(async (req, res) => {
    const guestId = req.user._id;

    const bookings = await Booking.find({ guest: guestId })
        .populate({
            path: 'property',
            select: 'title location imageUrls basePricePerNight' 
        })
        .sort({ checkInDate: -1 }); 

    if (!bookings) {
       
         return res.status(200).json(
        new ApiResponse(404, "Could not find any bookings for this user."));
    }

    return res.status(200).json(
        new ApiResponse(200, bookings, "User bookings retrieved successfully.")
    );
});


export { createBooking, getMyBookings };