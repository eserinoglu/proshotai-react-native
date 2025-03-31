import { createContext, useContext, useState } from "react";
import { editImage, generateImage } from "@/service/imageGeneration";
import { useRouter } from "expo-router";
import { exportToGallery } from "@/service/imageSave";
import { allShotSizes, ShotSize } from "@/types/shotSize";
import { allPresentationTypes, PresentationType } from "@/types/presentationType";
import { allBackgroundTypes, BackgroundType } from "@/types/backgroundType";
import { GenerationHistory } from "@/types/generationHistory";
import { base64ToUri } from "@/utils/base64ToUri";
import { useHistoryDatabase } from "./HistoryDatabaseProvider";

interface ImageGenerationContextProps {
  // Uploaded Image
  uploadedImage: string | null;
  setUploadedImage: (image: string | null) => void;
  // Image generation function
  imageGeneration: (imageUri: string) => Promise<void>;
  // Image editing with prompt
  imageEditing: (imageUri: string, prompt: string) => Promise<void>;
  // Shot size
  selectedShotSize: ShotSize;
  setSelectedShotSize: (size: ShotSize) => void;
  // Presentation type
  selectedPresentationType: PresentationType;
  setSelectedPresentationType: (presentationType: PresentationType) => void;
  // Background type
  selectedBackgroundType: BackgroundType;
  setSelectedBackgroundType: (backgroundType: BackgroundType) => void;
  // User extra addition to prompt
  userPrompt: string | undefined;
  setUserPrompt: (prompt: string | undefined) => void;
  // Save to gallery function
  saveToGallery: (imageUri: string) => Promise<void>;
}

export const ImageGenerationContext = createContext<ImageGenerationContextProps>({
  // Uploaded Image
  uploadedImage: null,
  setUploadedImage: () => {},
  // Image generation funciton
  imageGeneration: async () => {},
  // Image editing with prompt
  imageEditing: async () => {},
  // Shot size
  selectedShotSize: allShotSizes[0],
  setSelectedShotSize: () => {},
  // Presentation type
  selectedPresentationType: allPresentationTypes[0],
  setSelectedPresentationType: () => {},
  // Background type
  selectedBackgroundType: allBackgroundTypes[0],
  setSelectedBackgroundType: () => {},
  // User extra addition to prompt
  userPrompt: undefined,
  setUserPrompt: () => {},
  // Save to gallery function
  saveToGallery: async () => {},
});

interface ImageGenerationProviderProps {
  children: React.ReactNode;
}
export const ImageGenerationProvider = ({ children }: ImageGenerationProviderProps) => {
  const { newHistory } = useHistoryDatabase();
  const router = useRouter();
  const [userPrompt, setUserPrompt] = useState<string | undefined>(undefined);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedShotSize, setSelectedShotSize] = useState<ShotSize>(allShotSizes[0]);
  const [selectedPresentationType, setSelectedPresentationType] = useState<PresentationType>(allPresentationTypes[0]);
  const [selectedBackgroundType, setSelectedBackgroundType] = useState<BackgroundType>(allBackgroundTypes[0]);

  const saveToGallery = async (imageBase64: string) => {
    try {
      await exportToGallery(imageBase64);
    } catch (error) {
      console.error("Error while saving image to gallery. Image generation Provider.", error);
      throw new Error("Error while saving image to gallery. Image generation Provider.");
    }
  };

  const imageGeneration = async (imageUri: string) => {
    if (!imageUri) {
      throw new Error("No image uploaded");
    }
    try {
      const result = await generateImage(
        imageUri,
        selectedShotSize.prompt,
        selectedPresentationType.prompt,
        selectedBackgroundType.prompt,
        userPrompt
      );
      if (result) {
        const uri = await base64ToUri(result);
        const generatedImage: GenerationHistory = {
          imageUri: uri,
          shotSize: selectedShotSize.type,
          presentationType: selectedPresentationType.type,
          backgroundType: selectedBackgroundType.type,
          createdAt: new Date().toISOString(),
          userInput: userPrompt,
        };
        await newHistory(generatedImage);
        router.push({
          pathname: "/image-detail",
          params: {
            generatedImage: JSON.stringify(generatedImage),
          },
        });
      }
    } catch (error) {
      console.error("Error while editing image. Image generation Provider.", error);
      throw new Error("Error while editing image. Image generation Provider.");
    }
  };

  const imageEditing = async (imageUri: string, prompt: string) => {
    if (!imageUri) {
      throw new Error("No image uploaded");
    }
    try {
      const result = await editImage(imageUri, prompt);
      if (result) {
        const uri = await base64ToUri(result);
        const generatedImage: GenerationHistory = {
          imageUri: uri,
          shotSize: selectedShotSize.type,
          presentationType: selectedPresentationType.type,
          backgroundType: selectedBackgroundType.type,
          createdAt: new Date().toISOString(),
          userInput: prompt,
        };
        await newHistory(generatedImage);
        router.push({
          pathname: "/image-detail",
          params: {
            generatedImage: JSON.stringify(generatedImage),
          },
        });
      }
    } catch (error) {
      console.error("Error while editing image. Image generation Provider.", error);
      throw new Error("Error while editing image. Image generation Provider.");
    }
  };

  return (
    <ImageGenerationContext.Provider
      value={{
        userPrompt,
        setUserPrompt,
        uploadedImage,
        setUploadedImage,
        imageGeneration,
        imageEditing,
        selectedShotSize,
        setSelectedShotSize,
        selectedPresentationType,
        setSelectedPresentationType,
        selectedBackgroundType,
        setSelectedBackgroundType,
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
