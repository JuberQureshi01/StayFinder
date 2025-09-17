
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class AIService {

    async generateItinerary(location, tripType, budget, durationInDays) {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `Create a ${durationInDays}-day travel itinerary for a trip to ${location}. The trip type is "${tripType}" and the budget is "${budget}". Suggest specific activities, local restaurants, and experiences for each day. Format the response as a simple, clean text plan.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            return text;
        } catch (error) {
            return res.status(401).json(
                new ApiResponse(500, "Failed to generate itinerary from AI service."))
        }
    }
    async generatePropertyDescription(propertyType, location, amenities) {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `Generate an attractive and welcoming property description for an Airbnb listing. The property is a "${propertyType}" located in "${location}". Key amenities include: ${amenities.join(', ')}. The tone should be inviting and highlight the best features. Keep it under 150 words.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            return text;
        } catch (error) {
          return res.status(401).json(
        new ApiResponse(500, "Failed to generate property description from AI service."))
        }
    }
}
export const aiService = new AIService();