import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { searchProperties } from '../../features/properties/propertySlice';
import { Search as SearchIcon } from 'lucide-react';

const SearchComponent = () => {
    const [location, setLocation] = useState('');
    const dispatch = useDispatch();

    const handleSearch = () => {
        if (location.trim()) {
            dispatch(searchProperties(location.trim()));
        }
    };

    return (
        <div className="hidden md:flex items-center border rounded-full shadow-sm hover:shadow-md transition cursor-pointer">
            <input 
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Search destinations"
                className="font-semibold pr-8 pl-4 py-2 rounded-full focus:outline-none"
            />
            <button onClick={handleSearch} className="bg-[#FF385C] text-white rounded-full py-2 px-4 mr-2">
                <SearchIcon size={16} />
            </button>
        </div>
    );
};

export default SearchComponent;