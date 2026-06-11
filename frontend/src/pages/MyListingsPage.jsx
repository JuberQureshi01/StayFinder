import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  deleteProperty,
  fetchMyProperties,
} from "../features/properties/propertySlice";
import MainLayout from "../components/layout/MainLayout";
import { PlusCircle, Trash2, Home, Edit3 } from "lucide-react";

const ListingCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
    <div className="w-full h-48 bg-gray-200" />
    <div className="p-4 space-y-3">
      <div className="h-5 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="h-4 bg-gray-200 rounded w-1/3" />
    </div>
  </div>
);

const MyListingsPage = () => {
  const dispatch = useDispatch();
  const { myProperties, loading } = useSelector((state) => state.properties);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    dispatch(fetchMyProperties());
  }, [dispatch]);

  const handleDelete = async (propertyId) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    setDeletingId(propertyId);
    await dispatch(deleteProperty(propertyId));
    setDeletingId(null);
  };

  return (
    <MainLayout>
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Your Listings</h1>
          <Link to="/create-listing"
            className="flex items-center space-x-2 bg-[#FF385C] text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition">
            <PlusCircle size={20} />
            <span>Create New Listing</span>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => <ListingCardSkeleton key={i} />)}
          </div>
        ) : myProperties.length === 0 ? (
          <div className="text-center py-20">
            <Home size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg mb-4">You haven't created any listings yet.</p>
            <Link to="/create-listing"
              className="inline-flex items-center space-x-2 bg-[#FF385C] text-white font-bold py-3 px-6 rounded-lg hover:bg-red-600 transition">
              <PlusCircle size={20} />
              <span>Create Your First Listing</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myProperties.map((prop) => (
              <div key={prop._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="relative">
                  <img src={prop.imageUrls?.[0] || ''} alt={prop.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg truncate">{prop.title}</h3>
                  <p className="text-sm text-gray-600">{prop.location}</p>
                  <p className="mt-2 font-semibold text-[#FF385C]">₹{prop.basePricePerNight?.toLocaleString('en-IN')} <span className="text-gray-500 font-normal">/ night</span></p>
                  <div className="mt-4 flex justify-between items-center border-t pt-3">
                    <Link to={`/edit-listing/${prop._id}`}
                      className="flex items-center gap-1 text-sm font-semibold text-[#FF385C] hover:underline">
                      <Edit3 size={14} /> Edit
                    </Link>
                    <button onClick={() => handleDelete(prop._id)}
                      disabled={deletingId === prop._id}
                      className="flex items-center gap-1 text-sm font-semibold text-red-500 hover:text-red-700 disabled:opacity-50">
                      <Trash2 size={14} /> {deletingId === prop._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MyListingsPage;
