import { PresentationType } from "@/types/presentationType";
import { PromptConfig } from "@/types/promptConfig";

export const presentationPrompts: Record<PresentationType, PromptConfig> = {
  [PresentationType.OnModel]: {
    type: PresentationType.OnModel,
    prompt: "Product/products will be displayed as worn by a model.",
  },
  [PresentationType.OnHanger]: {
    type: PresentationType.OnHanger,
    prompt: "Product/products will be displayed on a hanger.",
  },
  [PresentationType.InUse]: {
    type: PresentationType.InUse,
    prompt: "Product/products will be displayed in use.",
  },
  [PresentationType.Flat]: {
    type: PresentationType.Flat,
    prompt: "Product/products will be displayed flat.",
  },
};
