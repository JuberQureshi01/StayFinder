import { aiService } from '../services/ai.service.js';
import { ExpressError } from '../utils/ExpressError.js';
import { wrapAsync } from '../utils/wrapAsync.js';

const getAIItinerary = wrapAsync(async (req, res) => {
    const { location, tripType, budget, durationInDays } = req.body;

    if (!location || !tripType || !budget || !durationInDays) {
        throw new ExpressError(400,"Location, trip type, budget, and duration in days are required")
    }

    const itinerary = await aiService.generateItinerary(location, tripType, budget, durationInDays);

    return res.status(200).json({
        success: true,
        message: "Itinerary generated successfully.",
        data: { itinerary }
    });
});

const getAIDescription = wrapAsync(async (req, res) => {
    const { propertyType, location, amenities } = req.body;

    if (!propertyType || !location || !amenities ) {
        throw new ExpressError(400,"Property type, location, and an array of amenities are required")
    }

    const description = await aiService.generatePropertyDescription(propertyType, location, amenities);

    return res.status(200).json({
        success: true,
        message: "Property description generated successfully.",
        data: { description }
    });
});

export { getAIItinerary, getAIDescription };
