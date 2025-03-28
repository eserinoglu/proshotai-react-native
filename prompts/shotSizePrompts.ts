import { PromptConfig } from "@/types/promptConfig";
import { ShotSize } from "@/types/shotSize";

export const shotSizePrompts: Record<ShotSize, PromptConfig> = {
  [ShotSize.CloseUp]: {
    type: ShotSize.CloseUp,
    prompt: "Shot size will be close up. Focus on product details. Zoom in.",
  },
  [ShotSize.MediumShot]: {
    type: ShotSize.MediumShot,
    prompt: "Shot size will be medium. Focus on product and some background or context.",
  },
  [ShotSize.FullShot]: {
    type: ShotSize.FullShot,
    prompt: "Shot size will be full. Focus on the entire product and its surroundings or context.",
  },
};
