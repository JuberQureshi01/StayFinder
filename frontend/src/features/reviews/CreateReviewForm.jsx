import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createReview } from "./reviewSlice";
import Rating from "react-rating";
import { Star } from "lucide-react";
import toast from "react-hot-toast";

const CreateReviewForm = ({ propertyId }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.reviews);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0 || !comment) {
      toast.error("Please provide a rating and a comment.");
      return;
    }
    dispatch(createReview({ propertyId, rating, comment }));

    setRating(0);
    setComment("");
  };

  return (
    <div className="py-8 border-t">
      <h3 className="text-2xl font-semibold mb-4">Leave a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-2">Your Rating</label>

          <Rating
            initialRating={rating}
            onChange={(rate) => setRating(rate)}
            emptySymbol={<Star size={28} className="text-gray-300" />}
            fullSymbol={
              <Star size={28} className="text-yellow-500" fill="currentColor" />
            }
            fractions={2}
          />
        </div>
        <div>
          <label htmlFor="comment" className="block font-medium mb-2">
            Your Comment
          </label>
          <textarea
            id="comment"
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Share your experience..."
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-[#FF385C] text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600 transition disabled:bg-red-300"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

export default CreateReviewForm;
