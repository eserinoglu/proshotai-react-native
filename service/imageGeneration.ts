import { uriToBase64 } from "@/utils/uriToBase64";
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: "AIzaSyC6ASYNRqaatr7e3iTsJrxUvSElaWTUARA" });

export const generateImage = async (
  imageUri: string,
  shotSizePrompt: string,
  presentationTypePrompt: string,
  backgroundTypePrompt: string,
  userPrompt: string | undefined = undefined
): Promise<string | undefined> => {
  const imageBase64 = await uriToBase64(imageUri);
  if (!imageBase64) {
    throw new Error("No image uploaded");
  }
  // Prompt for the image generation model
  // generateImage fonksiyonu içindeki basePrompt'u bununla değiştirebilirsiniz:
  let basePrompt = `
Generate a high-resolution, photorealistic product photograph suitable for e-commerce and advertising. The primary subject is the provided product image. Focus on sharp details, accurate color representation, realistic material textures, and natural, flattering lighting that includes soft shadows and subtle highlights to define the product's form. Ensure a visually appealing and balanced composition. The overall aesthetic must be professional, clean, and high-quality. Specific details regarding presentation, shot angle, and background will follow. Avoid generating text or logos unless specifically requested. ${presentationTypePrompt} ${backgroundTypePrompt} ${shotSizePrompt}
`;

  if (userPrompt && userPrompt.trim() !== "") {
    basePrompt += ` Additionally, consider the following user request: "${userPrompt}"`;
  }

  const contents = [
    {
      text: basePrompt.trim(),
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

export const editImage = async (imageUri: string, editPrompt: string): Promise<string | undefined> => {
  const imageBase64 = await uriToBase64(imageUri);
  if (!imageBase64) {
    throw new Error("No image uploaded");
  }
  const prompt = `Edit the image based on the following user request: "${editPrompt}"`;
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
