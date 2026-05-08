import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildCafePrompt } from "./prompts/cafePrompt";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);

/**
 * Sends nearby cafés + user message to Gemini and returns structured JSON
 * @param {Array} cafes
 * @param {string} userMessage
 * @returns {Promise<Object>}
 */
export async function askGemini(cafes, userMessage) {
  // Validate API key
  if (!import.meta.env.VITE_GEMINI_KEY) {
    throw new Error("Missing Gemini API key");
  }

  // Initialize model - gemini-3.1-flash-lite-preview is great for speed
  const model = genAI.getGenerativeModel({
    model: "gemini-3.1-flash-lite-preview",
    // We force the model to output JSON
    generationConfig: {
        responseMimeType: "application/json",
    }
  });

  // Build compact café context for the AI to "read"
  const cafeContext = cafes
    .slice(0, 12) // Limit to 12 to save tokens and stay relevant
    .map((c, i) => {
        return `ID: ${i} | Name: ${c.name} | Rating: ${c.rating || "N/A"} | Reviews: ${c.totalRatings || 0} | Open: ${c.isOpen ? "Yes" : "No"} | Address: ${c.address}`;
    })
    .join("\n");

  // Build the prompt using your external builder
  const prompt = buildCafePrompt(cafeContext, userMessage);

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    /**
     * CLEANING LOGIC:
     * Sometimes AI models wrap JSON in markdown blocks like ```json ... ```
     * This regex removes those blocks to prevent JSON.parse() from failing.
     */
    const cleanJson = text.replace(/```json|```/g, "").trim();
    
    const parsedResponse = JSON.parse(cleanJson);

    // Ensure we always return the expected structure even if the AI misses a key
    return {
      text: parsedResponse.text || "Here are some spots I found:",
      cafes: parsedResponse.cafes || []
    };

  } catch (error) {
    console.error("Gemini API or Parsing Error:", error);

    // Fallback: Return a friendly error object that won't break the UI loop
    return { 
      text: "Sorry, I’m having trouble processing that right now. Could you try again? ☕", 
      cafes: [] 
    };
  }
}