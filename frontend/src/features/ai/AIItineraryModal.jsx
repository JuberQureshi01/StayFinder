
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateItinerary, clearItinerary } from './aiSlice';
import { X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const AIItineraryModal = ({ location, onClose }) => {
    const dispatch = useDispatch();
    const { itinerary, loading } = useSelector((state) => state.ai);

    const [tripType, setTripType] = useState('Family');
    const [budget, setBudget] = useState('Mid-range');
    const [durationInDays, setDurationInDays] = useState(3);
    
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        if (itinerary) {
            let index = 0;
            setDisplayedText('');
            const intervalId = setInterval(() => {
                if (index < itinerary.length) {
                    setDisplayedText((prev) => prev + itinerary.charAt(index));
                    index++;
                } else {
                    clearInterval(intervalId);
                }
            }, 10); 

            return () => clearInterval(intervalId); 
        }
    }, [itinerary]);


    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(generateItinerary({ location, tripType, budget, durationInDays }));
    };

    const handleClose = () => {
        dispatch(clearItinerary());
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-[black]/50  z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold">AI Itinerary Generator</h2>
                    <button onClick={handleClose} className="p-2 rounded-full hover:bg-gray-100">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    {!itinerary && !loading && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Location</label>
                                <input type="text" value={location} disabled className="w-full mt-1 p-2 bg-gray-100 border rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Trip Type</label>
                                <select value={tripType} onChange={(e) => setTripType(e.target.value)} className="w-full mt-1 p-2 border rounded-md">
                                    <option>Family</option>
                                    <option>Solo</option>
                                    <option>Romantic</option>
                                    <option>Adventure</option>
                                </select>
                            </div>
                             <div>
                                <label className="block text-sm font-medium">Budget</label>
                                <select value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full mt-1 p-2 border rounded-md">
                                    <option>Budget-friendly</option>
                                    <option>Mid-range</option>
                                    <option>Luxury</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Duration (in days)</label>
                                <input type="number" min="1" max="10" value={durationInDays} onChange={(e) => setDurationInDays(e.target.value)} className="w-full mt-1 p-2 border rounded-md" />
                            </div>
                            <button type="submit" className="w-full bg-[#FF385C] text-white font-bold py-3 rounded-lg hover:bg-red-600 transition">
                                Generate Plan
                            </button>
                        </form>
                    )}

                    {loading && (
                        <div className="text-center py-10">
                            <p>Generating your personalized itinerary...</p>
                        </div>
                    )}

                    {itinerary && (
                         <div className="prose max-w-none">
                            <ReactMarkdown>{displayedText}</ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AIItineraryModal;
