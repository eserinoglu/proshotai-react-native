import { useUser } from "@/stores/useUser";
import { uriToBase64 } from "@/utils/uriToBase64";

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
  if (!imageBase64) {
    throw new Error("No image uploaded");
  }
  // Prompt for the image generation model
  let basePrompt = `
Generate a high-resolution, photorealistic product photograph suitable for e-commerce and advertising. The primary subject is the provided product image. Focus on sharp details, accurate color representation, realistic material textures, and natural, flattering lighting that includes soft shadows and subtle highlights to define the product's form. Ensure a visually appealing and balanced composition. The overall aesthetic must be professional, clean, and high-quality. Specific details regarding presentation, shot angle, and background will follow. Avoid generating text or logos unless specifically requested. ${presentationTypePrompt} ${backgroundTypePrompt} ${shotSizePrompt}
`;

  if (userPrompt && userPrompt.trim() !== "") {
    basePrompt += ` Additionally, consider the following user request: "${userPrompt}"`;
  }

  try {
    const response = await fetch("http://localhost:1905/image/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${user.id}`,
      },
      body: JSON.stringify({
        prompt: basePrompt,
        imageBase64: imageBase64,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      const image = data?.image;
      if (image) {
        return image;
      } else {
        throw new Error("No image returned from the API.");
      }
    } else {
      throw data.error;
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
  // Convert the image URI to base64
  const imageBase64 = await uriToBase64(imageUri);
  if (!imageBase64) {
    throw new Error("No image uploaded");
  }
  const prompt = `Edit the image based on the following user request: "${editPrompt}"`;
  try {
    const response = await fetch("http://localhost:1905/image/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${user.id}`,
      },
      body: JSON.stringify({
        prompt: prompt,
        imageBase64: imageBase64,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      const image = data?.image;
      if (image) {
        return image;
      } else {
        throw new Error("No image returned from the API.");
      }
    } else {
      throw data.error;
    }
  } catch (error) {
    throw error;
  }
};
