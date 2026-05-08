import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildCafePrompt } from "./prompts/cafePrompt";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);

/**
 * Sends nearby cafés + user message to Gemini
 * @param {Array} cafes
 * @param {string} userMessage
 * @returns {Promise<string>}
 */
export async function askGemini(cafes, userMessage) {
  // Validate API key
  if (!import.meta.env.VITE_GEMINI_KEY) {
    throw new Error("Missing Gemini API key");
  }

  // Initialize model
  const model = genAI.getGenerativeModel({
    model: "gemini-3.1-flash-lite-preview",
  });

  // Build compact café context
  const cafeContext = cafes
    .slice(0, 10)
    .map(
      (c, i) => `
${i + 1}. ${c.name}
Rating: ${c.rating || "N/A"} (${c.totalRatings || 0} reviews)
Status: ${c.isOpen ? "Open now" : "Closed"}
Address: ${c.address}
`,
    )
    .join("\n");

  // Use external prompt builder
  const prompt = buildCafePrompt(cafeContext, userMessage);

  try {
    const result = await model.generateContent(prompt);

    const response = await result.response;

    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);

    return "Sorry, I’m having trouble finding café recommendations right now ☕";
  }
}
