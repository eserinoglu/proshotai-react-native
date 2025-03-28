import { BackgroundType } from "@/types/backgroundType";
import { PromptConfig } from "@/types/promptConfig";

export const backgroundPrompts: Record<BackgroundType, PromptConfig> = {
  [BackgroundType.Outdoor]: {
    type: BackgroundType.Outdoor,
    prompt:
      "The background of the photo should be outdoors. The outdoor space should be related to the product. Objects suitable for the product can be found.",
  },
  [BackgroundType.Studio]: {
    type: BackgroundType.Studio,
    prompt:
      "The background of the photo should be a studio. Studio lighting. Solid studio background.",
  },
};
