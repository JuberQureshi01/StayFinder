import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviewsByPropertyId } from "./reviewSlice";
import ReviewCard from "./ReviewCard";
import { Star } from "lucide-react";

const ReviewList = ({ propertyId, averageRating, totalReviews }) => {
  const dispatch = useDispatch();
  const { reviews, loading } = useSelector((state) => state.reviews);

  useEffect(() => {
    if (propertyId) {
      dispatch(fetchReviewsByPropertyId(propertyId));
    }
  }, [propertyId, dispatch]);

  return (
    <div id="reviews" className="py-8 border-t">
      <h3 className="text-2xl font-semibold mb-4 flex items-center">
        <Star size={20} className="mr-2" />
        {averageRating} · {totalReviews} reviews
      </h3>
      {loading ? (
        <p>Loading reviews...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
