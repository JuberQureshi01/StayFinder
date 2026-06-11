import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteReview } from "./reviewSlice";
import { Star, Trash2, Loader2 } from "lucide-react";
import { format } from "date-fns";

const ReviewCard = ({ review, propertyId }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [deleting, setDeleting] = useState(false);

  const canDelete = user && user._id === review.guest?._id;

  const handleDelete = async () => {
    if (!window.confirm("Delete this review?")) return;
    setDeleting(true);
    await dispatch(deleteReview({ propertyId, reviewId: review._id }));
    setDeleting(false);
  };

  return (
    <div className="py-4 relative">
      <div className="flex items-center mb-2">
        <img
          src={
            review.guest?.profile?.profilePictureUrl ||
            `https://ui-avatars.com/api/?name=${review.guest?.profile?.fullName || 'User'}&background=random`
          }
          alt={review.guest?.profile?.fullName || 'User'}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="ml-4">
          <p className="font-semibold">{review.guest?.profile?.fullName || 'Anonymous'}</p>
          <p className="text-sm text-gray-500">
            {review.createdAt ? format(new Date(review.createdAt), "MMMM yyyy") : ''}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-1 mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} size={16}
            className={star <= review.rating ? "text-yellow-500" : "text-gray-300"}
            fill={star <= review.rating ? "currentColor" : "none"} />
        ))}
      </div>
      <p className="text-gray-700">{review.comment}</p>

      {canDelete && (
        <button onClick={handleDelete} disabled={deleting}
          className="absolute top-4 right-0 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50">
          {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
        </button>
      )}
    </div>
  );
};

export default ReviewCard;
