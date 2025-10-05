import React, { useState } from "react";
import { Star, Heart, ChevronLeft, ChevronRight } from "lucide-react";

const PropertyCard = ({ property }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleNextImage = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImageIndex(
      (prevIndex) => (prevIndex + 1) % property.imageUrls.length
    );
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + property.imageUrls.length) % property.imageUrls.length
    );
  };

  const toggleWishlist = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="group cursor-pointer mb-4 ">
      <div className="relative w-full aspect-square rounded-xl overflow-hidden">
        <div className="w-full h-full">
          <img
            src={
              property.imageUrls[currentImageIndex] ||
              "[https://placehold.co/600x600/E2E8F0/AAAAAA?text=No+Image](https://placehold.co/600x600/E2E8F0/AAAAAA?text=No+Image)"
            }
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handlePrevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full shadow-md"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleNextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full shadow-md"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <button onClick={toggleWishlist} className="absolute top-3 right-3">
          <Heart
            size={24}
            className={`text-white transition-colors ${
              isWishlisted
                ? "fill-red-500 stroke-red-500"
                : "fill-black/50 stroke-white"
            }`}
          />
        </button>
      </div>
      <div className="mt-2">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-gray-800 truncate pr-2">
            {property.title}
          </h3>
          <div className="flex items-center space-x-1 flex-shrink-0">
            <Star size={16} className="text-black" fill="currentColor" />
            <span className="text-sm">4.87</span>
          </div>
        </div>
        <p className="text-gray-500 text-sm">{property.location}</p>
        <p className="mt-1">
          <span className="font-bold">
            ₹{property.basePricePerNight.toLocaleString("en-IN")}
          </span>
          <span className="text-gray-600"> night</span>
        </p>
      </div>
    </div>
  );
};

export default PropertyCard;
