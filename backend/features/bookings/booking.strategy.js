
import { Booking } from './booking.model.js';

class BookingFlowStrategy {
    async book(property, bookingDetails) {
        throw new Error("book() method must be implemented");
    }
}

export class InstantBookFlow extends BookingFlowStrategy {
    async book(property, bookingDetails) {
        const booking = new Booking({
            ...bookingDetails,
            status: 'CONFIRMED', 
        });
        await booking.save();
        return booking;
    }
}

export class RequestBookFlow extends BookingFlowStrategy {
    async book(property, bookingDetails) {
        const booking = new Booking({
            ...bookingDetails,
            status: 'PENDING_APPROVAL', 
        });
        await booking.save();
        return booking;
    }
}