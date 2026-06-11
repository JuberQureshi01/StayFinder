import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBookings } from "../features/bookings/bookingSlice";
import MainLayout from "../components/layout/MainLayout";
import { format } from "date-fns";
import { Calendar, MapPin } from "lucide-react";

const BookingSkeleton = () => (
  <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
    <div className="w-full md:w-1/3 h-48 bg-gray-200" />
    <div className="p-6 flex-1 space-y-3">
      <div className="h-6 bg-gray-200 rounded w-2/3" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/3" />
    </div>
  </div>
);

const MyBookingsPage = () => {
  const dispatch = useDispatch();
  const { userBookings, loading } = useSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(fetchUserBookings());
  }, [dispatch]);

  return (
    <MainLayout>
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">My Trips</h1>
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => <BookingSkeleton key={i} />)}
          </div>
        ) : !userBookings || userBookings.length === 0 ? (
          <div className="text-center py-20">
            <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">You haven't booked any trips yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {userBookings.map((booking) => (
              <div key={booking._id}
                className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img src={booking.property?.imageUrls?.[0] || ''}
                  alt={booking.property?.title || 'Property'}
                  className="w-full md:w-1/3 h-48 md:h-auto object-cover" />
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{booking.property?.title}</h2>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <MapPin size={14} /> {booking.property?.location}
                    </p>
                    <p className="mt-2 text-sm">
                      <span className="font-semibold">Dates:</span>{" "}
                      {format(new Date(booking.checkInDate), "MMM dd, yyyy")} -{" "}
                      {format(new Date(booking.checkOutDate), "MMM dd, yyyy")}
                    </p>
                    <p className="text-sm mt-1">
                      <span className="font-semibold">Total:</span> ₹{booking.totalPrice?.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <span className={`mt-4 text-sm font-bold py-1 px-3 rounded-full self-start ${
                    booking.status === "CONFIRMED"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"}`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MyBookingsPage;
