import { Property } from '../models/property.model.js';
import { Review } from '../models/review.model.js';
import { redisClient } from '../config/connectredis.js';
import { uploadCloudinary } from '../config/cloudinary.js';
import axios from 'axios';
import { ExpressError } from '../utils/ExpressError.js';
import { wrapAsync } from '../utils/wrapAsync.js';

const CACHE_TTL = 600;

const clearPropertyCaches = async (hostId, propertyId) => {
    const keys = ['allProperties'];
    if (hostId) keys.push(`myProperties:${hostId}`);
    if (propertyId) keys.push(`property:${propertyId}`, `property:${propertyId}:reviews`);
    const categories = ['Trending', 'Mountains', 'Beachfront', 'Swimming Pools', 'Countryside', 'City Center'];
    categories.forEach(c => keys.push(`properties|category:${c}`));
    await redisClient.del(...keys);
};


const createProperty = wrapAsync(async (req, res) => {
    const hostId = req.user._id;
    const { title, description, propertyType, category, location, basePricePerNight, amenities } = req.body;

    if (!title || !description || !location) {
        throw new ExpressError(400, "Title, description and location are required.");
    }

    if (!req.files || req.files.length === 0) {
        throw new ExpressError(400, "At least one image is required.");
    }

    const uploadResults = await Promise.all(req.files.map(file => uploadCloudinary(file.path)));
    const imageUrls = uploadResults.filter(r => r?.url).map(r => r.url);

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

    await clearPropertyCaches(hostId);

    res.status(201).json({
        success: true,
        message: "Property created successfully.",
        data: property
    });
});


const getAllProperties = wrapAsync(async (req, res) => {
    const { category, location, page = 1, limit = 20 } = req.query;

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

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [properties, total] = await Promise.all([
        Property.find(filter)
            .populate("host", "profile.fullName")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean(),
        Property.countDocuments(filter)
    ]);

    const responseData = { properties, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) };

    await redisClient.set(cacheKey, JSON.stringify(responseData), 'EX', CACHE_TTL);

    return res.status(200).json({
        success: true,
        message: "Properties retrieved successfully.",
        data: responseData
    });
});




const deleteProperty = wrapAsync(async (req, res) => {
    const { propertyId } = req.params;
    const hostId = req.user._id;

    const property = await Property.findOne({ _id: propertyId, host: hostId });
    if (!property) {
        throw new ExpressError(404, "Property not found or unauthorized.");
    }

    await Property.findByIdAndDelete(propertyId);
    await clearPropertyCaches(hostId, propertyId);

    res.status(200).json({
        success: true,
        message: "Property deleted successfully.",
        deletedPropertyId: propertyId
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

    const properties = await Property.find({ host: hostId })
        .sort({ createdAt: -1 })
        .lean();

    await redisClient.set(cacheKey, JSON.stringify(properties), 'EX', CACHE_TTL);

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

    const property = await Property.findById(propertyId)
        .populate('host', 'profile.fullName')
        .lean();

    if (!property) {
        throw new ExpressError(404, "Property not found.");
    }

    const reviewStats = await Review.aggregate([
        { $match: { property: property._id } },
        { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);

    property.averageRating = reviewStats.length > 0 ? parseFloat(reviewStats[0].avgRating.toFixed(2)) : "New";
    property.reviewCount = reviewStats.length > 0 ? reviewStats[0].count : 0;

    await redisClient.set(cacheKey, JSON.stringify(property), 'EX', CACHE_TTL);

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
        const uploadResults = await Promise.all(req.files.map(file => uploadCloudinary(file.path)));
        property.imageUrls = uploadResults.filter(r => r?.url).map(r => r.url);
    }

    if (title !== undefined) property.title = title;
    if (description !== undefined) property.description = description;
    if (propertyType !== undefined) property.propertyType = propertyType;
    if (category !== undefined) property.category = category;
    if (location !== undefined) property.location = location;
    if (basePricePerNight !== undefined) property.basePricePerNight = basePricePerNight;
    if (amenities !== undefined) property.amenities = amenities.split(',').map(a => a.trim());

    await property.save();
    await clearPropertyCaches(hostId, propertyId);

    res.status(200).json({
        success: true,
        message: "Property updated successfully.",
        data: property
    });
});



const getPropertyCoordinates = wrapAsync(async (req, res) => {
    const { propertyId } = req.params;
    const coordCacheKey = `coords:${propertyId}`;

    const cached = await redisClient.get(coordCacheKey);
    if (cached) {
        return res.status(200).json({
            success: true,
            message: "Coordinates retrieved from cache.",
            data: JSON.parse(cached)
        });
    }

    const property = await Property.findById(propertyId).select('location').lean();
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
    const coords = { longitude, latitude };

    await redisClient.set(coordCacheKey, JSON.stringify(coords), 'EX', 86400);

    res.status(200).json({
        success: true,
        message: "Coordinates retrieved successfully.",
        data: coords
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
