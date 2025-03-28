import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: "AIzaSyC6ASYNRqaatr7e3iTsJrxUvSElaWTUARA" });

export const generateImage = async (
  imageBase64: string,
  shotSizePrompt: string,
  presentationTypePrompt: string,
  backgroundTypePrompt: string
): Promise<string | undefined> => {
  // Prompt for the image generation model
  const prompt = `
  Generate a high-quality, professional product image with realistic lighting, sharp details, and a visually appealing composition. The product should be well-lit, with natural shadows and highlights enhancing its form. Ensure the background complements the product without distracting from it. The image should be photorealistic, suitable for commercial use, and free from artifacts or distortions. ${shotSizePrompt} ${presentationTypePrompt} ${backgroundTypePrompt}`;

  const contents = [
    {
      text: prompt.trim(),
    },
    {
      inlineData: {
        mimeType: "image/png",
        data: imageBase64,
      },
    },
  ];
  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash-exp-image-generation",
      contents,
      config: {
        responseModalities: ["image", "text"],
      },
    });
    const candidates = response?.candidates ?? [];
    if (candidates.length === 0) {
      throw new Error("No candidates returned from image generation service.");
    }
    for (const part of candidates[0]?.content?.parts ?? []) {
      if (part.text) {
        console.log(part.text);
      } else if (part.inlineData) {
        return part.inlineData.data;
      }
    }
  } catch (error) {
    console.error("Error while editing image. Image generation service.", error);
    throw new Error("Error while editing image. Image generation service.");
  }
};
