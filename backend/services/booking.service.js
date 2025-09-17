import { Property } from '../model/property.model.js';
import { ApiError } from '../utils/apiError.js';
import { InstantBookFlow, RequestBookFlow } from './booking.strategy.js';

export class BookingService {
    async createBooking(propertyId, userId, checkInDate, checkOutDate) {
        const property = await Property.findById(propertyId);
        if (!property) {
            throw new ApiError(404, "Property not found.");
        }

        // Decide booking flow
        const bookingFlowType = property.bookingFlowType || 'InstantBook';
        let strategy;
        if (bookingFlowType === 'InstantBook') {
            strategy = new InstantBookFlow();
        } else {
            strategy = new RequestBookFlow();
        }

        // Calculate price
        const nights = (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24);
        if (nights <= 0) {
            return resizeBy.status(400).json( {message:"Check-out date must be after check-in date.",succes:false});
        }

        const totalPrice = nights * property.basePricePerNight;

        const bookingDetails = {
            property: propertyId,
            guest: userId,
            host: property.host,
            checkInDate,
            checkOutDate,
            totalPrice,
        };

        const newBooking = await strategy.book(property, bookingDetails);

        return newBooking;
    }
}
