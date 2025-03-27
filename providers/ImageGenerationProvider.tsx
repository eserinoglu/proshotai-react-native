import { createContext, useContext, useState } from "react";
import { generateImage } from "@/service/imageGeneration";
import { useRouter } from "expo-router";
import { exportToGallery } from "@/service/imageSave";

interface ImageGenerationContextProps {
  uploadedImage: string | null;
  setUploadedImage: (image: string | null) => void;
  imageGeneration: () => Promise<void>;
  selectedShotSize: "wide" | "close" | "medium";
  setSelectedShotSize: (size: "wide" | "close" | "medium") => void;
  saveToGallery: (imageBase64: string) => Promise<void>;
  generatedImage: string | null;
}

export const ImageGenerationContext = createContext<ImageGenerationContextProps>({
  uploadedImage: null,
  setUploadedImage: () => {},
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
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
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

  const imageGeneration = async () => {
    if (!uploadedImage) {
      throw new Error("No image uploaded");
    }
    try {
      const result = await generateImage(uploadedImage, selectedShotSize);
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
        uploadedImage,
        selectedShotSize,
        setSelectedShotSize,
        setUploadedImage,
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
