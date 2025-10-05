import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteReview } from "./reviewSlice";
import { Star, Trash2 } from "lucide-react";
import { format } from "date-fns";

const ReviewCard = ({ review, propertyId }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const canDelete = user && user._id === review.guest._id;

  const handleDelete = () => {
    dispatch(deleteReview({ propertyId, reviewId: review._id }));
  };

  return (
    <div className="py-4 relative">
      <div className="flex items-center mb-2">
        <img
          src={
            review.guest.profile?.profilePictureUrl ||
            `https://ui-avatars.com/api/?name=${review.guest.profile.fullName}&background=random`
          }
          alt={review.guest.profile.fullName}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="ml-4">
          <p className="font-semibold">{review.guest.profile.fullName}</p>
          <p className="text-sm text-gray-500">
            {format(new Date(review.createdAt), "MMMM yyyy")}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-1 mb-2">
        {[0, 1, 2, 3, 4].map((index) => (
          <Star
            key={index}
            size={16}
            className={
              index < review.rating ? "text-yellow-500" : "text-gray-300"
            }
            fill="currentColor"
          />
        ))}
      </div>
      <p className="text-gray-700">{review.comment}</p>

      {canDelete && (
        <button
          onClick={handleDelete}
          className="absolute cursor-pointer hover:scale-150 hover:rotate-z-12 top-4 right-0 text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
};

export default ReviewCard;
