import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({});

class AIService {
    async generateItinerary(location, tripType, budget, durationInDays) {
        if (!location || !tripType || !budget || !durationInDays) {
            throw new Error("Missing required parameters for itinerary generation.");
        }

        const prompt = `Create a ${durationInDays}-day travel itinerary for a trip to ${location}. 
The trip type is "${tripType}" and the budget is "${budget}". 
Suggest specific activities, local restaurants, and experiences for each day. 
Format the response as a simple, clean text plan.`;

        const response = await ai.models.generateContent({
            model: "gemini-flash-latest",
            contents: prompt,
        });

        return response.text
    }

    async generatePropertyDescription(propertyType, location, amenities) {
        if (!propertyType || !location || !Array.isArray(amenities)) {
            throw new Error("Missing required parameters for property description generation.");
        }

        const prompt = `Generate an attractive and welcoming property description for an Airbnb listing. 
The property is a "${propertyType}" located in "${location}". 
Key amenities include: ${amenities.join(", ")}. 
The tone should be inviting and highlight the best features. Keep it under 150 words.`;

        const response = await ai.models.generateContent({
            model: "gemini-flash-latest",
            contents: prompt,
        });

        return response.text
    }
}

export const aiService = new AIService();
