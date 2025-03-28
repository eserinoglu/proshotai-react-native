import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: "AIzaSyC6ASYNRqaatr7e3iTsJrxUvSElaWTUARA" });

export const generateImage = async (
  imageBase64: string,
  shotSize: "wide" | "close" | "medium"
): Promise<string | undefined> => {
  const contents = [
    {
      text: `Show this product/products being worn by a model. High-quality fashion photography with a solid studio background.Studio lighting with an ultra-realistic finish.Shot size: ${shotSize}. - "Close" means a zoomed-in shot focusing on the product details. - "Medium" means a mid-range shot showing the product and some of the model's body. - "Wide" means a full-body shot showing the entire outfit with surrounding context.`,
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
