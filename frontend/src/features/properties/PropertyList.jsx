import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProperties } from "./propertySlice";
import PropertyCard from "./PropertyCard";
import PropertyCardSkeleton from "../../components/skeleton/PropertyCardSkeleton";

const PropertyList = ({ category }) => {
  const dispatch = useDispatch();
  const { properties, loading, error } = useSelector(
    (state) => state.properties
  );

  useEffect(() => {
    dispatch(fetchProperties(category));
  }, [dispatch, category]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-3">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
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
