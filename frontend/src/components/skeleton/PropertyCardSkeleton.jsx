import React from "react";

function PropertyCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="w-full aspect-square bg-gray-200 rounded-xl"></div>

      <div className="mt-2 space-y-2">
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded w-8"></div>
        </div>

        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
  );
}

export default PropertyCardSkeleton;
