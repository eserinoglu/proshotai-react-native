import { createContext, useContext, useState } from "react";
import { generateImage } from "@/service/imageGeneration";
import { useRouter } from "expo-router";
import { exportToGallery } from "@/service/imageSave";

interface ImageGenerationContextProps {
  imageGeneration: (imageBase64 : string) => Promise<void>;
  selectedShotSize: "wide" | "close" | "medium";
  setSelectedShotSize: (size: "wide" | "close" | "medium") => void;
  saveToGallery: (imageBase64: string) => Promise<void>;
  generatedImage: string | null;
}

export const ImageGenerationContext = createContext<ImageGenerationContextProps>({
  imageGeneration: async () => {},
  selectedShotSize: "wide",
  setSelectedShotSize: () => {},
  saveToGallery: async () => {},
  generatedImage: null,
});

interface ImageGenerationProviderProps {
  children: React.ReactNode;
}
export const ImageGenerationProvider = ({ children }: ImageGenerationProviderProps) => {
  const router = useRouter();
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedShotSize, setSelectedShotSize] = useState<"wide" | "close" | "medium">("wide");

  const saveToGallery = async (imageBase64: string) => {
    try {
      await exportToGallery(imageBase64);
    } catch (error) {
      console.error("Error while saving image to gallery. Image generation Provider.", error);
      throw new Error("Error while saving image to gallery. Image generation Provider.");
    }
  };

  const imageGeneration = async (imageBase64 : string) => {
    if (!imageBase64) {
      throw new Error("No image uploaded");
    }
    try {
      const result = await generateImage(imageBase64, selectedShotSize);
      if (result) {
        setGeneratedImage(result);
        router.push("/generated-image");
      }
    } catch (error) {
      console.error("Error while editing image. Image generation Provider.", error);
      throw new Error("Error while editing image. Image generation Provider.");
    }
  };

  return (
    <ImageGenerationContext.Provider
      value={{
        selectedShotSize,
        setSelectedShotSize,
        imageGeneration,
        generatedImage,
        saveToGallery,
      }}
    >
      {children}
    </ImageGenerationContext.Provider>
  );
};

export const useImageGeneration = () => {
  const context = useContext(ImageGenerationContext);
  if (!context) {
    throw new Error("useImageGeneration must be used within an ImageGenerationProvider");
  }
  return context;
};
