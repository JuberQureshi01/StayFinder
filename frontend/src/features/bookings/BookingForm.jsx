import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { differenceInDays } from "date-fns";
import { createBooking } from "./bookingSlice";
import toast from "react-hot-toast";

const BookingForm = ({ property }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.bookings);

  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);

  const numberOfNights =
    checkInDate && checkOutDate
      ? differenceInDays(new Date(checkOutDate), new Date(checkInDate))
      : 0;
  const totalPrice =
    numberOfNights > 0 ? numberOfNights * property.basePricePerNight : 0;

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please log in to make a booking.");
      navigate("/login");
      return;
    }

    if (numberOfNights <= 0) {
      toast.error("Check-out date must be after the check-in date.");
      return;
    }

    const bookingData = {
      propertyId: property._id,
      checkInDate,
      checkOutDate,
      guests,
    };

    const result = await dispatch(createBooking(bookingData));
    if (createBooking.fulfilled.match(result)) {
      navigate("/my-bookings"); 
    }
  };

  return (
    <form
      onSubmit={handleBookingSubmit}
      className="sticky top-24 p-6 border rounded-xl shadow-lg bg-white"
    >
      <div className="flex items-baseline mb-4">
        <span className="text-2xl font-bold">
          ₹{property.basePricePerNight}
        </span>
        <span className="text-gray-600 ml-1">night</span>
      </div>

      <div className="grid grid-cols-2 gap-px border rounded-lg mb-4">
        <div className="p-3">
          <label className="block text-xs font-semibold">CHECK-IN</label>
          <input
            type="date"
            className="w-full"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            required
          />
        </div>
        <div className="p-3 border-l">
          <label className="block text-xs font-semibold">CHECKOUT</label>
          <input
            type="date"
            className="w-full"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="p-3 border rounded-lg mb-4">
        <label className="block text-xs font-semibold">GUESTS</label>
        <input
          type="number"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          min="1"
          className="w-full"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#FF385C] text-white font-bold py-3 rounded-lg hover:bg-red-600 transition disabled:bg-red-300"
      >
        {loading ? "Processing..." : "Book"}
      </button>
{numberOfNights > 0 && (
  <div className="mt-4 space-y-2 text-sm">
    {/* Base price calculation */}
    <div className="flex justify-between">
      <span>
        ₹{property.basePricePerNight} x {numberOfNights} nights
      </span>
      <span>₹{totalPrice}</span>
    </div>

    {/* GST Calculation */}
    <div className="flex justify-between text-gray-600">
      <span>GST (18%)</span>
      <span>₹{(totalPrice * 0.18).toFixed(2)}</span>
    </div>

    {/* Final Total */}
    <div className="flex justify-between font-bold border-t pt-2 mt-2">
      <span>Total</span>
      <span>₹{(totalPrice + totalPrice * 0.18).toFixed(2)}</span>
    </div>
  </div>
)}

    </form>
  );
};

export default BookingForm;
