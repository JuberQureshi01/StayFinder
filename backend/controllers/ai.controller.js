import { asyncHandler } from '../middlewares/asyncHandler.js';
import { aiService } from '../services/ai.service.js';

const getAIItinerary = asyncHandler(async (req, res) => {
    const { location, tripType, budget, durationInDays } = req.body;

    if (!location || !tripType || !budget || !durationInDays) {
        return res.status(400).json({
            success: false,
            message: "Location, trip type, budget, and duration in days are required."
        });
    }

    const itinerary = await aiService.generateItinerary(location, tripType, budget, durationInDays);

    return res.status(200).json({
        success: true,
        message: "Itinerary generated successfully.",
        data: { itinerary }
    });
});

const getAIDescription = asyncHandler(async (req, res) => {
    const { propertyType, location, amenities } = req.body;

    if (!propertyType || !location || !amenities || !Array.isArray(amenities)) {
        return res.status(400).json({
            success: false,
            message: "Property type, location, and an array of amenities are required."
        });
    }

    const description = await aiService.generatePropertyDescription(propertyType, location, amenities);

    return res.status(200).json({
        success: true,
        message: "Property description generated successfully.",
        data: { description }
    });
});

export { getAIItinerary, getAIDescription };
