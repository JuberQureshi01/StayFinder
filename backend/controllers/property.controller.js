import { Property } from '../models/property.model.js';
import { redisClient } from '../config/connectredis.js';
import { uploadCloudinary } from '../config/cloudinary.js';
import axios from 'axios';
import { ExpressError } from '../utils/ExpressError.js';
import { wrapAsync } from '../utils/wrapAsync.js';

const CACHE_TTL = 360;


const createProperty = wrapAsync(async (req, res) => {
    const hostId = req.user._id;
    const { title, description, propertyType, category, location, basePricePerNight, amenities } = req.body;

    if (!title || !description || !location) {
        throw new ExpressError(400, "Title, description and location are required.");
    }

    if (!req.files || req.files.length === 0) {
        throw new ExpressError(400, "At least one image is required.");
    }

    const imageUrls = [];

    for (const file of req.files) {
        const result = await uploadCloudinary(file.path);
        if (result?.url) imageUrls.push(result.url);
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

    await redisClient.del('allProperties');
    await redisClient.del(`myProperties:${hostId}`);

    res.status(201).json({
        success: true,
        message: "Property created successfully.",
        data: property
    });
});


const getAllProperties = wrapAsync(async (req, res) => {
    const { category, location } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (location) filter.location = { $regex: location, $options: "i" };

    const cacheKeyParts = ["properties"];
    if (category) cacheKeyParts.push(`category:${category}`);
    if (location) cacheKeyParts.push(`location:${location}`);

    const cacheKey = cacheKeyParts.join("|");

    const cached = await redisClient.get(cacheKey);
    if (cached) {
        return res.status(200).json({
            success: true,
            message: "Properties retrieved from cache.",
            data: JSON.parse(cached)
        });
    }

    const properties = await Property.find(filter).populate(
        "host",
        "profile.fullName"
    );


    await redisClient.set(cacheKey, JSON.stringify(properties),'EX',CACHE_TTL);

    return res.status(200).json({
        success: true,
        message: "Properties retrieved successfully.",
        data: properties
    });
});




const deleteProperty = wrapAsync(async (req, res) => {
    const { propertyId } = req.params;
    const hostId = req.user._id;

    const property = await Property.findOneAndDelete({ _id: propertyId });

    await redisClient.del('allProperties');
    await redisClient.del(`myProperties:${hostId}`);
    await redisClient.del(`property:${propertyId}`);
    await redisClient.del(`property:${propertyId}:reviews`);

    res.status(200).json({
        success: true,
        message: "Property deleted successfully."
    });
});


const getMyProperties = wrapAsync(async (req, res) => {
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
    await redisClient.set(cacheKey,JSON.stringify(properties),'EX',CACHE_TTL);

    res.status(200).json({
        success: true,
        message: "Properties retrieved successfully.",
        data: properties
    });
});


const getPropertyById = wrapAsync(async (req, res) => {
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
        throw new ExpressError(404, "Property not found.");
    }

    await redisClient.set(cacheKey, JSON.stringify(property),'EX',CACHE_TTL);

    res.status(200).json({
        success: true,
        message: "Property details retrieved successfully.",
        data: property
    });
});



const updateProperty = wrapAsync(async (req, res) => {
    const { propertyId } = req.params;
    const hostId = req.user._id;
    const { title, description, propertyType, category, location, basePricePerNight, amenities } = req.body;

    const property = await Property.findOne({ _id: propertyId, host: hostId });

    if (!property) {
        throw new ExpressError(404, "Property not found or unauthorized.");
    }

    if (req.files && req.files.length > 0) {
        const newImageUrls = [];

        for (const file of req.files) {
            const result = await uploadCloudinary(file.path);
            if (result?.url) newImageUrls.push(result.url);
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

    await redisClient.del('allProperties');
    await redisClient.del(`myProperties:${hostId}`);
    await redisClient.del(`property:${propertyId}`);
    property.save();
    res.status(200).json({
        success: true,
        message: "Property updated successfully.",
        data: property
    });
});



const getPropertyCoordinates = wrapAsync(async (req, res) => {
    const { propertyId } = req.params;

    const property = await Property.findById(propertyId).select('location');

    if (!property) {
        throw new ExpressError(404, "Property not found.");
    }

    const locationQuery = encodeURIComponent(property.location);
    const mapboxUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${locationQuery}.json?access_token=${process.env.MAPBOX_API_KEY}&limit=1`;

    const response = await axios.get(mapboxUrl);

    const features = response.data.features;

    if (!features || features.length === 0) {
        throw new ExpressError(404, "Could not find coordinates for this location.");
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
