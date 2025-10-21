import { asyncHandler } from '../middlewares/asyncHandler.js';
import { Property } from '../model/property.model.js';
import { redisClient } from '../config/redis.js';
import { uploadOnCloudinary } from '../config/cloudinary.js';
import axios from 'axios';
import mongoose from 'mongoose';

const CACHE_TTL = 360;


const createProperty = asyncHandler(async (req, res) => {
    const hostId = req.user._id;
    const { title, description, propertyType, category, location, basePricePerNight, amenities } = req.body;

    if (!title || !description || !location) {
        return res.status(400).json({
            success: false,
            message: "Title, description, and location are required."
        });
    }

    const imageFiles = req.files;
    if (!imageFiles || imageFiles.length === 0) {
        return res.status(400).json({
            success: false,
            message: "At least one image is required."
        });
    }

    const imageUrls = [];
    for (const file of imageFiles) {
        const result = await uploadOnCloudinary(file.path);
        if (result && result.url) imageUrls.push(result.url);
    }

    const property = await Property.create({
        host: hostId,
        title,
        description,
        propertyType,
        category,
        location,
        basePricePerNight,
        amenities: amenities ? amenities.split(',').map(i => i.trim()) : [],
        imageUrls
    });

    if (!property) {
        return res.status(500).json({
            success: false,
            message: "Failed to create the property."
        });
    }

    await redisClient.del('allProperties');
    await redisClient.del(`myProperties:${hostId}`);

    res.status(201).json({
        success: true,
        message: "Property created successfully.",
        data: property
    });
});



const getAllProperties = asyncHandler(async (req, res) => {
    const { location, propertyType, minPrice, maxPrice, amenities, category } = req.query;
    const cacheKey = `allProperties:${JSON.stringify(req.query)}`;

    const cached = await redisClient.get(cacheKey);
    if (cached) {
        return res.status(200).json({
            success: true,
            message: "Properties retrieved from cache.",
            data: JSON.parse(cached)
        });
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
        query.amenities = { $all: amenities.split(',') };
    }

    const properties = await Property.find(query).populate('host', 'profile.fullName');

    await redisClient.setex(cacheKey, CACHE_TTL, JSON.stringify(properties));

    res.status(200).json({
        success: true,
        message: "Properties retrieved successfully.",
        data: properties
    });
});



const deleteProperty = asyncHandler(async (req, res) => {
    const { propertyId } = req.params;
    const hostId = req.user._id;

    const property = await Property.findById(propertyId);
    if (!property) {
        return res.status(404).json({ success: false, message: "Property not found." });
    }

    if (property.host.toString() !== hostId.toString()) {
        return res.status(403).json({ success: false, message: "You are not authorized to delete this property." });
    }

    await property.deleteOne();

    await redisClient.del('allProperties');
    await redisClient.del(`myProperties:${hostId}`);
    await redisClient.del(`property:${propertyId}`);

    res.status(200).json({
        success: true,
        message: "Property deleted successfully."
    });
});



const getMyProperties = asyncHandler(async (req, res) => {

    const hostId = req.user._id;
    const cacheKey = `myProperties:${hostId}`;

    const cached = await redisClient.get(cacheKey);
    if (cached) {
        return res.status(200).json({
            success: true,
            message: "Properties retrieved from cache.",
            data: JSON.parse(cached)
        });
    }

    const properties = await Property.find({ host: hostId }).sort({ createdAt: -1 });

    await redisClient.setex(cacheKey, CACHE_TTL, JSON.stringify(properties));
    res.status(200).json({
        success: true,
        message: "Properties retrieved successfully.",
        data: properties
    });
});



const getPropertyById = asyncHandler(async (req, res) => {
    const { propertyId } = req.params;
    const cacheKey = `property:${propertyId}`;

    const cached = await redisClient.get(cacheKey);
    if (cached) {
        return res.status(200).json({
            success: true,
            message: "Property details retrieved from cache.",
            data: JSON.parse(cached)
        });
    }

    const property = await Property.findById(propertyId).populate('host', 'profile.fullName');
    if (!property) {
        return res.status(404).json({ success: false, message: "Property not found." });
    }

    await redisClient.setex(cacheKey, CACHE_TTL, JSON.stringify(property));

    res.status(200).json({
        success: true,
        message: "Property details retrieved successfully.",
        data: property
    });
});




const updateProperty = asyncHandler(async (req, res) => {
    const { propertyId } = req.params;
    const hostId = req.user._id;
    const { title, description, propertyType, category, location, basePricePerNight, amenities } = req.body;

    const property = await Property.findOne({ _id: propertyId, host: hostId });
    if (!property) {
        return res.status(404).json({
            success: false,
            message: "Property not found or unauthorized."
        });
    }

    if (req.files && req.files.length > 0) {
        const newImageUrls = [];
        for (const file of req.files) {
            const result = await uploadOnCloudinary(file.path);
            if (result && result.url) newImageUrls.push(result.url);
        }
        property.imageUrls = newImageUrls;
    }

    property.title = title || property.title;
    property.description = description || property.description;
    property.propertyType = propertyType || property.propertyType;
    property.category = category || property.category;
    property.location = location || property.location;
    property.basePricePerNight = basePricePerNight || property.basePricePerNight;
    property.amenities = amenities ? amenities.split(',').map(a => a.trim()) : property.amenities;

    await property.save({ validateBeforeSave: false });

    await redisClient.del('allProperties');
    await redisClient.del(`myProperties:${hostId}`);
    await redisClient.del(`property:${propertyId}`);

    res.status(200).json({
        success: true,
        message: "Property updated successfully.",
        data: property
    });
});



const getPropertyCoordinates = asyncHandler(async (req, res) => {
    const { propertyId } = req.params;

    const property = await Property.findById(propertyId).select('location');
    if (!property) {
        return res.status(404).json({
            success: false,
            message: "Property not found."
        });
    }

    const locationQuery = encodeURIComponent(property.location);
    const mapboxUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${locationQuery}.json?access_token=${process.env.MAPBOX_API_KEY}&limit=1`;

    const response = await axios.get(mapboxUrl);
    const features = response.data.features;

    if (!features || features.length === 0) {
        return res.status(404).json({
            success: false,
            message: "Could not find coordinates for this location."
        });
    }

    const [longitude, latitude] = features[0].center;

    res.status(200).json({
        success: true,
        message: "Coordinates retrieved successfully.",
        data: { longitude, latitude }
    });
});

export {
    createProperty,
    getAllProperties,
    deleteProperty,
    getMyProperties,
    getPropertyCoordinates,
    getPropertyById,
    updateProperty
};
