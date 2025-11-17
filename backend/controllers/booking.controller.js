import { Booking } from '../models/booking.model.js';
import { Property } from '../models/property.model.js';
import { ExpressError } from '../utils/ExpressError.js';
import { wrapAsync } from '../utils/wrapAsync.js';


export const createBooking = wrapAsync(async (req, res) => {
    const { propertyId, checkInDate, checkOutDate } = req.body;
    const guestId = req.user._id;

    if (!propertyId || !checkInDate || !checkOutDate) {
        throw new ExpressError(400, "Property ID, check-in date and check-out date are required.");
    }

    const property = await Property.findById(propertyId);
    if (!property) {
        throw new ExpressError(404, "Property not found.");
    }

    if (property.host.toString() === guestId.toString()) {
        throw new ExpressError(400, "You cannot book your own property.");
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    if (checkOut <= checkIn) {
        throw new ExpressError(400, "Check-out date must be after check-in date.");
    }

    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * property.basePricePerNight;

    const overlappingBooking = await Booking.findOne({
        property: propertyId,
        checkInDate: { $lt: checkOut },
        checkOutDate: { $gt: checkIn }
    });

    if (overlappingBooking) {
        throw new ExpressError(400, "This property is already booked for the selected dates.");
    }

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


export const getMyBookings = wrapAsync(async (req, res) => {
    const guestId = req.user._id;

    const bookings = await Booking.find({ guest: guestId })
        .populate({
            path: 'property',
            select: 'title location imageUrls basePricePerNight'
        })
        .sort({ checkInDate: -1 });

    if (!bookings || bookings.length === 0) {
        throw new ExpressError(404, "No bookings found for this user.");
    }

    return res.status(200).json({
        success: true,
        message: "User bookings retrieved successfully.",
        data: bookings,
    });
});
