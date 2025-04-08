import { useUser } from "@/stores/useUser";
import { uriToBase64 } from "@/utils/uriToBase64";

const baseUrl = "http://localhost:1905";

export const generateImage = async (
  imageUri: string,
  shotSizePrompt: string,
  presentationTypePrompt: string,
  backgroundTypePrompt: string,
  userPrompt: string | undefined = undefined
): Promise<string | undefined> => {
  const user = useUser.getState().user;
  if (!user) {
    throw new Error("User not found");
  }
  const imageBase64 = await uriToBase64(imageUri);
  const prompt = `
      You are a professional product photography AI. 
      Your task is to transform the provided product image into a high-resolution, photorealistic product photograph suitable for e-commerce. 
      NEVER change the core look or design of the product.

      Details:
      - Subject: the provided product image (keep proportions and design intact).
      - Style: ${presentationTypePrompt}
      - Background: ${backgroundTypePrompt}
      - Shot: ${shotSizePrompt}
      - User request: ${userPrompt || "None"}

      Requirements:
      - Sharp details, accurate colors, realistic textures
      - Professional lighting (soft shadows, subtle highlights)
      - Clean and commercial-grade composition
      - No text or logos unless requested
      - No inappropriate content
`;

  try {
    const response = await fetch(`${baseUrl}/image/generate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.id}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageBase64: imageBase64,
        prompt,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      return data?.image;
    } else {
      throw new Error(data?.error || "Image generation failed");
    }
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

export const editImage = async (imageUri: string, editPrompt: string): Promise<string | undefined> => {
  const user = useUser.getState().user;
  if (!user) {
    throw new Error("User not found");
  }

  const prompt = `Edit the image based on the following user request: "${editPrompt}". Also enhance the image quality, ensuring sharp details, accurate color representation, and realistic material textures. The overall aesthetic must be professional, clean, and high-quality. Avoid generating text or logos unless specifically requested.`;

  try {
    const response = await fetch(`${baseUrl}/image/generate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.id}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageBase64: await uriToBase64(imageUri),
        prompt,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      return data?.image;
    } else {
      throw new Error(data?.error || "Image generation failed");
    }
  } catch (error) {
    console.error("Error generating image:", error);
    throw JSON.stringify(error);
  }
};
