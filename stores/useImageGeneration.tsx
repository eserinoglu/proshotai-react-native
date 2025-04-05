import { create } from "zustand";
import { allBackgroundTypes, BackgroundType } from "@/types/backgroundType";
import { allPresentationTypes, PresentationType } from "@/types/presentationType";
import { allShotSizes, ShotSize } from "@/types/shotSize";
import { generateImage, editImage } from "@/service/imageGeneration";
import { exportToGallery } from "@/service/imageSave";
import { base64ToUri } from "@/utils/base64ToUri";
import { useHistoryDatabase } from "@/stores/useHistoryDatabase";
import { GenerationHistory } from "@/types/generationHistory";
import { useRevenueCat } from "./useRevenueCat";
import { useUser } from "./useUser";

type ImageGenerationStore = {
  uploadedImage: string | null;
  setUploadedImage: (image: string | null) => void;
  imageGeneration: (imageUri: string) => Promise<GenerationHistory | undefined>;
  imageEditing: (imageUri: string, prompt: string) => Promise<GenerationHistory | undefined>;
  selectedShotSize: ShotSize;
  setSelectedShotSize: (size: ShotSize) => void;
  selectedPresentationType: PresentationType;
  setSelectedPresentationType: (presentationType: PresentationType) => void;
  selectedBackgroundType: BackgroundType;
  setSelectedBackgroundType: (backgroundType: BackgroundType) => void;
  userPrompt: string | undefined;
  setUserPrompt: (prompt: string | undefined) => void;
  saveToGallery: (imageUri: string) => Promise<void>;
};

export const useImageGeneration = create<ImageGenerationStore>((set, get) => ({
  uploadedImage: null,
  setUploadedImage: (image) => set({ uploadedImage: image }),
  imageGeneration: async (imageUri: string) => {
    const user = useUser.getState().user;
    if (!user || user.remaining_credits <= 0) {
      useRevenueCat.getState().setShowPaywall(true);
      return;
    }
    const { selectedShotSize, selectedPresentationType, selectedBackgroundType, userPrompt } = get();
    const response = await generateImage(
      imageUri,
      selectedShotSize.prompt,
      selectedPresentationType.prompt,
      selectedBackgroundType.prompt,
      userPrompt
    );
    if (response) {
      const uri = await base64ToUri(response);
      const generatedImage: GenerationHistory = {
        imageUri: uri,
        shotSize: selectedShotSize.type,
        presentationType: selectedPresentationType.type,
        backgroundType: selectedBackgroundType.type,
        createdAt: new Date().toISOString(),
        userInput: userPrompt,
      };
      useUser.getState().removeCredits(1);
      await useHistoryDatabase.getState().newHistory(generatedImage);
      return generatedImage;
    }
  },
  imageEditing: async (imageUri: string, prompt: string) => {
    const user = useUser.getState().user;
    if (!user || user.remaining_credits <= 0) {
      useRevenueCat.getState().setShowPaywall(true);
      return;
    }
    const response = await editImage(imageUri, prompt);
    if (response) {
      const uri = await base64ToUri(response);
      const generatedImage: GenerationHistory = {
        imageUri: uri,
        shotSize: "edited",
        presentationType: "edited",
        backgroundType: "edited",
        createdAt: new Date().toISOString(),
        userInput: prompt,
      };
      await useHistoryDatabase.getState().newHistory(generatedImage);
      useUser.getState().removeCredits(1);
      return generatedImage;
    }
  },
  selectedShotSize: allShotSizes[0],
  setSelectedShotSize: (size) => set({ selectedShotSize: size }),
  selectedPresentationType: allPresentationTypes[0],
  setSelectedPresentationType: (presentationType) => set({ selectedPresentationType: presentationType }),
  selectedBackgroundType: allBackgroundTypes[0],
  setSelectedBackgroundType: (backgroundType) => set({ selectedBackgroundType: backgroundType }),
  userPrompt: undefined,
  setUserPrompt: (prompt) => set({ userPrompt: prompt }),
  saveToGallery: async (imageUri: string) => {
    try {
      await exportToGallery(imageUri);
    } catch (error) {
      console.error("Error while saving image to gallery. Image generation Provider.", error);
      throw new Error("Error while saving image to gallery. Image generation Provider.");
    }
  },
}));
