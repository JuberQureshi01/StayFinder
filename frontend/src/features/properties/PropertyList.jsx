import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropertyCard from "./PropertyCard";
import axiosInstance from "../../api/axios";
import PropertyCardSkeleton from "../../components/skeleton/PropertyCardSkeleton";

const PropertyList = ({ category }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(
          `/properties?category=${category}`
        );
        setProperties(response.data.data);
      } catch (err) {
        setError("Failed to fetch properties. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [category]);

  if (loading) {
      return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-3">
        {Array.from({ length: 8 }).map((_, index) => (
          <PropertyCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {properties.map((property) => (
        <Link to={`/property/${property._id}`} key={property._id}>
          <PropertyCard property={property} />
        </Link>
      ))}
    </div>
  );
};

export default PropertyList;
