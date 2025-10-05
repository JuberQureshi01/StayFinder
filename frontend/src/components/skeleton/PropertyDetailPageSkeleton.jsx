import React from "react";
import MainLayout from "../layout/MainLayout";

const PropertyDetailPageSkeleton = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 xl:px-60 py-8 animate-pulse">
        <div className="mb-4">
          <div className="h-8 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div className="flex space-x-2">
            <div className="h-4 bg-gray-200 rounded w-12"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        </div>

        <div className="w-full aspect-video bg-gray-300 rounded-xl mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="pb-6 border-b space-y-2">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>

            <div className="py-6 border-b space-y-2">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="space-y-2">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
                ))}
              </div>
              <div className="h-4 bg-gray-200 rounded w-20 mt-2"></div>
            </div>

            <div className="py-6 border-b">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="grid grid-cols-2 gap-4">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded w-2/3"></div>
                ))}
              </div>
            </div>

            <div className="py-6 border-b">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-4">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
        <div className="py-8 border-t mt-8">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-[400px] w-full bg-gray-200 rounded-lg"></div>
        </div>

        <div className="py-8 border-t mt-8 space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default PropertyDetailPageSkeleton;
