

import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { Property } from '../model/property.model.js';
import { redisClient } from '../config/redis.js';
import { uploadOnCloudinary } from '../config/cloudinary.js';
import axios from 'axios';

const CACHE_TTL = 3600; // 1 hour

// Create Property
const createProperty = asyncHandler(async (req, res) => {
    const hostId = req.user._id;
    const { title, description, propertyType, category, location, basePricePerNight, amenities } = req.body;

    if (!title || !description || !location) {
        return res.status(401).json(
            new ApiResponse(401,{}, "Title, description, and location are required.")
        );
    }

    const imageFiles = req.files;
    if (!imageFiles || imageFiles.length === 0) {
        return res.status(401).json(
            new ApiResponse(400, "At least one image is required.")
        );
    }

    const imageUrls = [];
    for (const file of imageFiles) {
        const result = await uploadOnCloudinary(file.path);
        if (result && result.url) {
            imageUrls.push(result.url);
        }
    }

    const property = await Property.create({
        host: hostId,
        title,
        description,
        propertyType,
        category,
        location,
        basePricePerNight,
        amenities: amenities ? amenities.split(',').map(item => item.trim()) : [],
        imageUrls
    });

    if (!property) {
         return res.status(401).json(
            new ApiResponse(404, {}, "Failed to create the property")
        );
    }

    // Clear relevant caches
    await redisClient.del('allProperties');
    await redisClient.del(`myProperties:${hostId}`);

    return res.status(201).json(new ApiResponse(201, property, "Property created successfully."));
});

// Get All Properties
const getAllProperties = asyncHandler(async (req, res) => {
    const { location, propertyType, minPrice, maxPrice, amenities, category } = req.query;

    const queryKey = `allProperties:${JSON.stringify(req.query)}`;

    // Try cache first
    const cachedData = await redisClient.get(queryKey);
    if (cachedData) {
        return res.status(200).json(new ApiResponse(200, JSON.parse(cachedData), "Properties retrieved from cache."));
    }

    const query = {};
    if (location) query.location = { $regex: location, $options: 'i' };
    if (propertyType) query.propertyType = propertyType;
    if (category) query.category = category;
    if (minPrice || maxPrice) {
        query.basePricePerNight = {};
        if (minPrice) query.basePricePerNight.$gte = Number(minPrice);
        if (maxPrice) query.basePricePerNight.$lte = Number(maxPrice);
    }
    if (amenities) {
        const amenitiesList = amenities.split(',');
        query.amenities = { $all: amenitiesList };
    }

    const properties = await Property.find(query).populate('host', 'profile.fullName');

    // Save to cache 
    await redisClient.setex(queryKey, CACHE_TTL, JSON.stringify(properties));

    return res.status(200).json(new ApiResponse(200, properties, "Properties retrieved successfully."));
});

// Delete Property
const deleteProperty = asyncHandler(async (req, res) => {
    const { propertyId } = req.params;
    const hostId = req.user._id;

    const property = await Property.findById(propertyId);
    if (!property) {
        return res.status(200).json(new ApiResponse(404, "Property not found."));
    }

    if (property.host.toString() !== hostId.toString()) {
        return res.status(200).json(new ApiResponse(403, "You are not authorized to delete this property."));
    }

    await property.deleteOne();

    // Clear relevant caches
    await redisClient.del('allProperties');
    await redisClient.del(`myProperties:${hostId}`);
    await redisClient.del(`property:${propertyId}`);

    return res.status(200).json(
        new ApiResponse(200, {}, "Property and associated reviews deleted successfully.")
    );
});

// Get My Properties 
const getMyProperties = asyncHandler(async (req, res) => {
    const hostId = req.user._id;
    const cacheKey = `myProperties:${hostId}`;

    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
        return res.status(200).json(new ApiResponse(200, JSON.parse(cachedData), "Host properties retrieved from cache."));
    }

    const properties = await Property.find({ host: hostId }).sort({ createdAt: -1 });

    await redisClient.setex(cacheKey, CACHE_TTL, JSON.stringify(properties)); 

    return res.status(200).json(new ApiResponse(200, properties, "Host properties retrieved successfully."));
});

// Get Property By ID with Caching
const getPropertyById = asyncHandler(async (req, res) => {
    const { propertyId } = req.params;
    const cacheKey = `property:${propertyId}`;

    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
        return res.status(200).json(new ApiResponse(200, JSON.parse(cachedData), "Property details retrieved from cache."));
    }

    const property = await Property.findById(propertyId).populate('host', 'profile.fullName');
    if (!property) {
        throw new ApiError(404, "Property not found.");
    }

    await redisClient.setex(cacheKey, CACHE_TTL, JSON.stringify(property)); 

    return res.status(200).json(new ApiResponse(200, property, "Property details retrieved successfully."));
});

// Get Property By ID for Host
const getPropertyByIdForHost = asyncHandler(async (req, res) => {
    const { propertyId } = req.params;
    const property = await Property.findOne({ _id: propertyId });
    if (!property) {
        throw new ApiError(404, "Property not found or you are not the host.");
    }
    return res.status(200).json(new ApiResponse(200, property, "Property details retrieved successfully."));
});

// Update Property 
const updateProperty = asyncHandler(async (req, res) => {
    const { propertyId } = req.params;
    const hostId = req.user._id;
    const { title, description, propertyType, category, location, basePricePerNight, amenities } = req.body;

    const property = await Property.findOne({ _id: propertyId, host: hostId });
    if (!property) {
        return res.status(200).json(new ApiResponse(404, "Property not found or you are not the host."));
    }

    if (req.files && req.files.length > 0) {
        const newImageUrls = [];
        for (const file of req.files) {
            const result = await uploadOnCloudinary(file.path);
            if (result && result.url) {
                newImageUrls.push(result.url);
            }
        }
        property.imageUrls = [...newImageUrls];
    }

    property.title = title || property.title;
    property.description = description || property.description;
    property.propertyType = propertyType || property.propertyType;
    property.category = category || property.category;
    property.location = location || property.location;
    property.basePricePerNight = basePricePerNight || property.basePricePerNight;
    property.amenities = amenities ? amenities.split(',').map(item => item.trim()) : property.amenities;

    await property.save({ validateBeforeSave: false });

    // Clear relevant caches
    await redisClient.del('allProperties');
    await redisClient.del(`myProperties:${hostId}`);
    await redisClient.del(`property:${propertyId}`);

    return res.status(200).json(new ApiResponse(200, property, "Property updated successfully."));
});

const getPropertyCoordinates = asyncHandler(async (req, res) => {
    const { propertyId } = req.params;

    const property = await Property.findById(propertyId).select('location');
    if (!property) {
        throw new ApiError(404, "Property not found.");
    }

    const locationQuery = encodeURIComponent(property.location);
    const mapboxUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${locationQuery}.json?access_token=${process.env.MAPBOX_API_KEY}&limit=1`;

    try {
        const response = await axios.get(mapboxUrl);
        const features = response.data.features;

        if (!features || features.length === 0) {
            throw new ApiError(404, "Could not find coordinates for this location.");
        }

        const [longitude, latitude] = features[0].center;
        
        return res.status(200).json(
            new ApiResponse(200, { longitude, latitude }, "Coordinates retrieved successfully.")
        );

    } catch (error) {
        throw new ApiError(500, "Failed to fetch geocoding data from Mapbox.");
    }
});

export {
    createProperty,
    getAllProperties,
    deleteProperty,
    getMyProperties,
    getPropertyByIdForHost,
    getPropertyCoordinates,
    getPropertyById,
    updateProperty
};
