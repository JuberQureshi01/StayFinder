
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MainLayout from '../components/layout/MainLayout';
import MobileSearchBar from '../features/properties/MobileSearchBar';
import MobileSearch from '../features/properties/MobileSearch';
import Categories from '../features/properties/Categories';
import PropertyList from '../features/properties/PropertyList';
import { clearSearch } from '../features/properties/propertySlice';
import { Link } from 'react-router-dom';
import PropertyCard from '../features/properties/PropertyCard';

const HomePage = () => {
    const dispatch = useDispatch();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Trending');
    const { searchResults, isSearchActive } = useSelector((state) => state.properties);

    return (
        <MainLayout>
            <div className="md:hidden sticky top-20 bg-white z-30 shadow-sm">
                <MobileSearchBar onClick={() => setIsSearchOpen(true)} />
            </div>
            {isSearchOpen && <MobileSearch onClose={() => setIsSearchOpen(false)} />}
            
            <div className="sticky top-20 bg-white z-30 shadow-sm py-2">
                <Categories 
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                {isSearchActive ? (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Search Results</h2>
                            <button onClick={() => dispatch(clearSearch())} className="font-semibold text-[#FF385C] hover:underline">
                                Clear Search
                            </button>
                        </div>
                        {Array.isArray(searchResults) && searchResults.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {searchResults.map((property) => (
                                    <Link to={`/property/${property._id}`} key={property._id}>
                                        <PropertyCard property={property} />
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p>No properties found for your search.</p>
                        )}
                    </div>
                ) : (
                    <PropertyList category={selectedCategory} />
                )}
            </div>
        </MainLayout>
    );
};

export default HomePage;
