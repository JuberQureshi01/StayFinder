
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { searchProperties } from './propertySlice';
import { Search, Send, X } from 'lucide-react';

const MobileSearch = ({ onClose }) => {
    const [location, setLocation] = useState('');
    const dispatch = useDispatch();

    const handleSearch = () => {
        if (location.trim()) {
            dispatch(searchProperties(location.trim()));
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-white z-50 flex flex-col md:hidden">
            <div className="p-2 border-b">
                <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X size={24} /></button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-4">
                <div className="bg-white rounded-2xl shadow-lg p-5">
                    <h2 className="text-3xl font-bold mb-4">Where?</h2>
                    <div className="relative mb-4">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            type="text"
                            placeholder="Search destinations"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#FF385C]"
                        />
                    </div>
                
                </div>
            </div>
            <div className="p-4 border-t bg-white flex justify-between items-center">
                <button className="font-semibold underline">Clear all</button>
                <button onClick={handleSearch} className="flex items-center space-x-2 bg-[#FF385C] text-white font-bold py-3 px-6 rounded-lg">
                    <Search size={20} />
                    <span>Search</span>
                </button>
            </div>
        </div>
    );
};

export default MobileSearch;