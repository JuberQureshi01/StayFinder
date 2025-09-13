
import React from 'react';
import { Flame, Mountain, Waves, Sun, Droplet, Building } from 'lucide-react';

const categoryItems = [
  { name: 'Trending', icon: <Flame size={24} /> },
  { name: 'Mountains', icon: <Mountain size={24} /> },
  { name: 'Beachfront', icon: <Waves size={24} /> },
  { name: 'Swimming Pools', icon: <Droplet size={24} /> }, 
  { name: 'Countryside', icon: <Sun size={24} /> },
  { name: 'City Center', icon: <Building size={24} /> },
];



const Categories = ({ selectedCategory, setSelectedCategory }) => {
  return (
    <div className="container mx-auto px-4 mt-3 sm:px-6 lg:px-8">
      <div className="flex space-x-8 overflow-x-auto pb-2 -mx-4 px-4">
        {categoryItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setSelectedCategory(item.name)}
            className={`flex flex-col items-center space-y-2 flex-shrink-0 group focus:outline-none ${
              selectedCategory === item.name
                ? 'text-[#FF385C]'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {item.icon}
            <span className="text-xs font-semibold">{item.name}</span>
            <div className={`w-full h-0.5 mt-2 ${selectedCategory === item.name ? 'bg-[#FF385C]' : 'bg-transparent group-hover:bg-gray-300'}`}></div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Categories;