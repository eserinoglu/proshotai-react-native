export interface ShotSize {
  type: string;
  prompt: string;
  thumbnail: any;
}

export const allShotSizes: ShotSize[] = [
  {
    type: "Close-Up",
    prompt:
      "Capture a close-up shot of the product, highlighting intricate details, textures, and materials.",
    thumbnail: require("@/assets/images/close.png"),
  },
  {
    type: "Mid-Shot",
    prompt:
      "Frame the product from a medium distance, providing a balanced view of its design and overall shape.",
    thumbnail: require("@/assets/images/mid.png"),
  },
  {
    type: "Full Shot",
    prompt:
      "Show the entire product from a distance, ensuring the full structure is visible in a well-composed frame. If the product is worn or used, show it in context.",
    thumbnail: require("@/assets/images/full.png"),
  },
];
