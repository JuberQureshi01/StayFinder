import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPropertyById,
  fetchPropertyCoordinates,
  clearCoordinates,
} from "../features/properties/propertySlice";
import { fetchUserBookings } from "../features/bookings/bookingSlice";
import MainLayout from "../components/layout/MainLayout";
import PropertyMap from "../features/properties/PropertyMap";
import { Star, Bot } from "lucide-react";
import BookingForm from "../features/bookings/BookingForm";
import AIItineraryModal from "../features/ai/AIItineraryModal";
import ReviewList from "../features/reviews/ReviewList";
import CreateReviewForm from "../features/reviews/CreateReviewForm";
import ImageCarousel from "../features/properties/ImageCarousel";
import PropertyDetailPageSkeleton from "../components/skeleton/PropertyDetailPageSkeleton";

const PropertyDetailPage = () => {
  const { propertyId } = useParams();
  const dispatch = useDispatch();

  const { property, coordinates, loading, error } = useSelector(
    (state) => state.properties
  );
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { userBookings } = useSelector((state) => state.bookings);

  const [isItineraryModalOpen, setIsItineraryModalOpen] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isAmenitiesExpanded, setIsAmenitiesExpanded] = useState(false);

  const maxAmenitiesToShow = 6;

    useEffect(() => {
    if (isItineraryModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isItineraryModalOpen]);


  useEffect(() => {
    if (propertyId) {
      dispatch(fetchPropertyById(propertyId));
      dispatch(fetchPropertyCoordinates(propertyId));
      if (isAuthenticated) {
        dispatch(fetchUserBookings());
      }
    }

    return () => {
      dispatch(clearCoordinates());
    };
  }, [propertyId, dispatch, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      setCanReview(true);
    }
  }, [userBookings, property, isAuthenticated]);

  if (loading || !property) {
    return (
        <PropertyDetailPageSkeleton/>
    );
  }
  if (error) {
    return (
      <MainLayout>
        <div className="text-center p-10 text-red-500">
          Error loading property details.
        </div>
      </MainLayout>
    );
  }

  const totalReviews = property.reviews.length;
  const averageRating = totalReviews > 0 ? 4.87 : "New"; 

  const descriptionPreview = property.description.substring(0, 250);
  const needsTruncation = property.description.length > 250;

  const needsAmenitiesTruncation =
    property.amenities.length > maxAmenitiesToShow;
  const amenitiesToShow = isAmenitiesExpanded
    ? property.amenities
    : property.amenities.slice(0, maxAmenitiesToShow);

  return (
    <>
      <MainLayout>
        <div className="container mx-auto px-4 xl:px-60 py-8">
          {/* Header */}
          <div className="mb-4">
            <h1 className="text-3xl font-bold">{property.title}</h1>
            <div className="flex items-center text-sm text-gray-600 mt-2">
              <Star
                size={16}
                className="text-yellow-500 mr-1"
                fill="currentColor"
              />
              <span>{averageRating}</span>
              <span className="mx-2">·</span>
              <a href="#reviews" className="underline">
                {totalReviews} reviews
              </a>
              <span className="mx-2">·</span>
              <span>{property.location}</span>
            </div>
          </div>

          <ImageCarousel images={property.imageUrls} />

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-8">
            <div className="lg:col-span-2">
              {/* Host */}
              <div className="pb-6 border-b">
                <h2 className="text-2xl font-semibold">
                  Hosted by {property.host?.profile?.fullName}
                </h2>
                <p className="text-gray-500">{property.propertyType}</p>
              </div>

              {/* Description */}
              <div className="py-6 border-b">
                <h3 className="text-xl font-semibold mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {isDescriptionExpanded
                    ? property.description
                    : `${descriptionPreview}...`}
                </p>
                {needsTruncation && (
                  <button
                    onClick={() =>
                      setIsDescriptionExpanded(!isDescriptionExpanded)
                    }
                    className="font-semibold text-[#FF385C] hover:underline mt-2"
                  >
                    {isDescriptionExpanded ? "Read less" : "Read more"}
                  </button>
                )}
              </div>

              {/* Amenities */}
              <div className="py-6 border-b">
                <h3 className="text-xl font-semibold mb-4">
                  What this place offers
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {amenitiesToShow.map((amenity) => (
                    <div key={amenity} className="flex items-center">
                      {amenity}
                    </div>
                  ))}
                </div>
                {needsAmenitiesTruncation && (
                  <button
                    onClick={() => setIsAmenitiesExpanded(!isAmenitiesExpanded)}
                    className="font-semibold text-[#FF385C] hover:underline mt-2"
                  >
                    {isAmenitiesExpanded ? "Show less" : "Show more"}
                  </button>
                )}
              </div>

              {/* AI Itinerary */}
              <div className="py-6 border-b">
                <button
                  onClick={() => setIsItineraryModalOpen(true)}
                  className="flex items-center space-x-2 font-semibold text-[#FF385C] hover:underline"
                >
                  <Bot size={20} />
                  <span>Need a travel plan? Generate an AI itinerary!</span>
                </button>
              </div>
            </div>

            {/* Booking Form */}
            <div className="lg:col-span-1">
              <BookingForm property={property} />
            </div>
          </div>

          {/* Map Section */}
          <div className="py-8 border-t mt-8">
            <h3 className="text-2xl font-semibold mb-4">Where you'll be</h3>
            {coordinates ? (
              <PropertyMap
                longitude={coordinates.longitude}
                latitude={coordinates.latitude}
              />
            ) : (
              <div className="h-[400px] w-full bg-gray-200 rounded-lg flex items-center justify-center">
                <p>Loading map...</p>
              </div>
            )}
            <p className="font-semibold mt-4">{property.location}</p>
          </div>

          {/* Review Section */}
          <ReviewList
            propertyId={property._id}
            averageRating={averageRating}
            totalReviews={totalReviews}
          />
          {canReview && <CreateReviewForm propertyId={property._id} />}
        </div>
      </MainLayout>

      {isItineraryModalOpen && (
        <AIItineraryModal
          location={property.location}
          onClose={() => setIsItineraryModalOpen(false)}
        />
      )}
    </>
  );
};

export default PropertyDetailPage;
