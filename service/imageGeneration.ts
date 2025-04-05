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
  const prompt = `Generate a high-resolution, photorealistic product photograph suitable for e-commerce and advertising. The primary subject is the provided product image. Focus on sharp details, accurate color representation, realistic material textures, and natural, flattering lighting that includes soft shadows and subtle highlights to define the product's form. Ensure a visually appealing and balanced composition. The overall aesthetic must be professional, clean, and high-quality. Specific details regarding presentation, shot angle, and background will follow. Avoid generating text or logos unless specifically requested. ${presentationTypePrompt} ${backgroundTypePrompt} ${shotSizePrompt}
    ${userPrompt ? `Additionally, consider the following user request: "${userPrompt}"` : ""}`;

  try {
    const response = await fetch("https://proshot-api.onrender.com/image/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.id}`,
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

  const imageBase64 = await uriToBase64(imageUri);
  const prompt = `Edit the image based on the following user request: "${editPrompt}"`;

  try {
    const response = await fetch("https://proshot-api.onrender.com/image/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.id}`,
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
    throw JSON.stringify(error);
  }
};
