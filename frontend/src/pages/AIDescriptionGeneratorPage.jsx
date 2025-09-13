import React, { useState,useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateDescription, clearDescription } from '../features/ai/aiSlice';
import MainLayout from '../components/layout/MainLayout';
import { Bot, Clipboard } from 'lucide-react';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown'; 

const AIDescriptionGeneratorPage = () => {
    const dispatch = useDispatch();
    const { description, loading } = useSelector((state) => state.ai);

    const [propertyType, setPropertyType] = useState('Apartment');
    const [location, setLocation] = useState('');
    const [amenities, setAmenities] = useState('');
    
    const [displayText, setDisplayText] = useState('');

    useEffect(() => {
        if (description) {
            let index = 0;
            setDisplayText(''); 
            const intervalId = setInterval(() => {
                if (index < description.length) {
                    setDisplayText((prev) => prev + description.charAt(index));
                    index++;
                } else {
                    clearInterval(intervalId);
                }
            }, 15); 

            return () => clearInterval(intervalId);
        }
    }, [description]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const amenitiesList = amenities.split(',').map(item => item.trim());
        dispatch(generateDescription({ propertyType, location, amenities: amenitiesList }));
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(description);
        toast.success("Description copied to clipboard!");
    };
    
    useEffect(() => {
        return () => {
            dispatch(clearDescription());
        }
    }, [dispatch]);

    return (
        <MainLayout>
            <div className="container mx-auto max-w-3xl px-4 py-8">
                <div className="text-center mb-8">
                    <Bot className="mx-auto h-12 w-12 text-[#FF385C]" />
                    <h1 className="text-3xl font-bold mt-2">AI Property Description Generator</h1>
                    <p className="text-gray-600 mt-2">Effortlessly create compelling descriptions for your listing.</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Property Type</label>
                            <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className="w-full mt-1 p-2 border rounded-md">
                                <option>Apartment</option>
                                <option>House</option>
                                <option>Hotel</option>
                                <option>Unique Stay</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Location (e.g., Jaipur, Rajasthan)</label>
                            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required className="w-full mt-1 p-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Key Amenities (comma-separated)</label>
                            <input type="text" value={amenities} onChange={(e) => setAmenities(e.target.value)} placeholder="e.g., WiFi, Pool, Air Conditioning" required className="w-full mt-1 p-2 border rounded-md" />
                        </div>
                        <button type="submit" disabled={loading} className="w-full bg-[#FF385C] text-white font-bold py-3 rounded-lg hover:bg-red-600 transition disabled:bg-red-300">
                            {loading ? 'Generating...' : 'Generate Description'}
                        </button>
                    </form>
                </div>

                {(loading || description) && (
                    <div className="mt-8 relative bg-white p-6 rounded-lg shadow-md">
                        
                        <h2 className="text-xl font-semibold mb-4">Generated Description:</h2>
                         <button onClick={handleCopy} className="absolute top-0 right-0 p-2 text-gray-500 hover:text-black">
                                    <Clipboard size={18} />
                                </button>
                        {loading && <p className="text-gray-500">Generating...</p>}
                        {description && (
                            <div className="relative">
                                <div className="prose max-w-none text-gray-700">
                                    <ReactMarkdown>{displayText}</ReactMarkdown>
                                </div>
                               
                            </div>
                        )}
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default AIDescriptionGeneratorPage;