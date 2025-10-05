import React from "react";
import { Search } from "lucide-react";

const MobileSearchBar = ({ onClick }) => {
  return (
    <div className="p-4">
      <button
        onClick={onClick}
        className="w-full flex items-center text-left bg-white shadow-md rounded-full p-2 hover:shadow-lg transition"
      >
        <div className="p-2">
          <Search className="text-gray-800" />
        </div>
        <div className="ml-2 flex-grow">
          <p className="font-semibold">Where to?</p>
          <p className="text-sm text-gray-500">
            Anywhere · Any week · Add guests
          </p>
        </div>
      </button>
    </div>
  );
};

export default MobileSearchBar;
