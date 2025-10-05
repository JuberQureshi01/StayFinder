import { asyncHandler } from '../middlewares/asyncHandler.js';
import { Booking } from '../model/booking.model.js';
import { Property } from '../model/property.model.js';


const createBooking = asyncHandler(async (req, res) => {
    const { propertyId, checkInDate, checkOutDate } = req.body;
    const guestId = req.user._id;

    const property = await Property.findById(propertyId);
    if (!property) {
        return res.status(404).json({ success: false, message: "Property not found." });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = (checkOut - checkIn) / (1000 * 60 * 60 * 24);

    if (nights <= 0) {
        return res.status(400).json({ success: false, message: "Check-out date must be after check-in date." });
    }

    const totalPrice = nights * property.basePricePerNight;


    const newBooking = await Booking.create({
        property: propertyId,
        guest: guestId,
        host: property.host,
        checkInDate,
        checkOutDate,
        totalPrice,
        status: 'CONFIRMED',
    });

    return res.status(201).json({
        success: true,
        message: "Booking created successfully.",
        data: newBooking,
    });
});


const getMyBookings = asyncHandler(async (req, res) => {
    const guestId = req.user._id;

    const bookings = await Booking.find({ guest: guestId })
        .populate({
            path: 'property',
            select: 'title location imageUrls basePricePerNight'
        })
        .sort({ checkInDate: -1 });

    if (!bookings || bookings.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No bookings found for this user.",
            data: [],
        });
    }

    return res.status(200).json({
        success: true,
        message: "User bookings retrieved successfully.",
        data: bookings,
    });
});

export { createBooking, getMyBookings };
