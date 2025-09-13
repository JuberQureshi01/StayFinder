
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import { aiService } from './ai.service.js';


const getAIItinerary = asyncHandler(async (req, res) => {
    const { location, tripType, budget, durationInDays } = req.body;

    if (!location || !tripType || !budget || !durationInDays) {
        return res.status(200).json(
            new ApiResponse(400, "Location, trip type, budget, and duration in days are required."));
    }

    const itinerary = await aiService.generateItinerary(location, tripType, budget, durationInDays);

    return res.status(200).json(
        new ApiResponse(200, { itinerary }, "Itinerary generated successfully.")
    );
});

const getAIDescription = asyncHandler(async (req, res) => {
    const { propertyType, location, amenities } = req.body;

    if (!propertyType || !location || !amenities || !Array.isArray(amenities)) {
        return res.status(200).json(
        new ApiResponse(400, "Property type, location, and an array of amenities are required."));
    }

    const description = await aiService.generatePropertyDescription(propertyType, location, amenities);

    return res.status(200).json(
        new ApiResponse(200, { description }, "Property description generated successfully.")
    );
});

export { getAIItinerary, getAIDescription };
