import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateRecipesFromGemini = async (prompt) => {
  try {
    const generationConfig = { response_mime_type: "application/json" };
    const model = genAI.getGenerativeModel(
      { model: "gemini-2.5-flash" },
      generationConfig
    );
    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();
    return responseText;
  } catch (error) {
    console.error("Gemini API Error:", error);
  }
};
