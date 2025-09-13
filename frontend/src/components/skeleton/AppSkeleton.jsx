import React from "react";

const AppSkeleton = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Skeleton Header */}
      <header className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo Placeholder */}
            <div className="h-8 w-32 bg-gray-200 rounded"></div>
            {/* Search Placeholder */}
            <div className="hidden md:block h-12 w-96 bg-gray-200 rounded-full"></div>
            {/* User Menu Placeholder */}
            <div className="h-10 w-20 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </header>

      <main className="flex-grow animate-pulse">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Categories Skeleton */}
          <div className="flex space-x-8 my-4 overflow-hidden">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <div className="h-6 w-6 bg-gray-300 rounded"></div>
                <div className="h-3 w-16 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>

          {/* Property List Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <div className="animate-pulse" key={index}>
                
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
            ))}
          </div>
        </div>
      </main>

      {/* Footer Placeholder */}
      <footer className="bg-gray-100 border-t mt-8">
        <div className="container mx-auto py-6 px-4 text-center">
          <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
        </div>
      </footer>
    </div>
  );
};

export default AppSkeleton;
