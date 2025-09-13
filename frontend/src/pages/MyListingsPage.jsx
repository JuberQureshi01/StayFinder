import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  deleteProperty,
  fetchMyProperties,
} from "../features/properties/propertySlice";
import MainLayout from "../components/layout/MainLayout";
import { PlusCircle, Trash2 } from "lucide-react";

const MyListingsPage = () => {
  const dispatch = useDispatch();
  const { myProperties, loading } = useSelector((state) => state.properties);

  useEffect(() => {
    dispatch(fetchMyProperties());
  }, [dispatch]);
  const handleDelete = (propertyId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this listing? This action cannot be undone."
      )
    ) {
      dispatch(deleteProperty(propertyId));
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Your Listings</h1>
          <Link
            to="/create-listing"
            className="flex items-center space-x-2 bg-[#FF385C] text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition"
          >
            <PlusCircle size={20} />
            <span>Create New Listing</span>
          </Link>
        </div>

        {loading ? (
          <p>Loading your listings...</p>
        ) : myProperties.length === 0 ? (
          <p>You haven't created any listings yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myProperties.map((prop) => (
              <div
                key={prop._id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <img
                  src={prop.imageUrls[0]}
                  alt={prop.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg truncate">{prop.title}</h3>
                  <p className="text-sm text-gray-600 ">{prop.location}</p>
                  <p className="mt-2 font-semibold">
                    ₹{prop.basePricePerNight} / night
                  </p>
                  <div className="mt-4 flex justify-between">
                    <Link
                      to={`/edit-listing/${prop._id}`}
                      className="text-sm font-semibold  text-[#FF385C] hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(prop._id)}
                      className="flex items-center space-x-1 hover:scale-150 hover:rotate-12 text-sm font-semibold text-red-600 hover:underline"
                    >
                      <Trash2 size={16} />
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
