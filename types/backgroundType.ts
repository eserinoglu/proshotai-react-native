export interface BackgroundType {
  type: string;
  prompt: string;
  thumbnail: any;
}

export const allBackgroundTypes: BackgroundType[] = [
  {
    type: "Studio",
    prompt:
      "Set the product against a seamless, professional studio background (e.g., solid color paper roll, subtle gradient, cyclorama wall). Utilize controlled, soft, and even studio lighting (like softboxes or diffused panels) to minimize harsh shadows and create a focused, distraction-free environment. The background color should complement the product.",
    thumbnail: require("@/assets/images/studio.png"),
  },
  {
    type: "Outdoor",
    prompt:
      "Situate the product realistically within a natural or urban outdoor setting (e.g., park, beach, modern street, forest path). Use natural lighting appropriate for the scene (e.g., bright daylight with soft shadows, golden hour warmth, overcast diffusion). The background should provide relevant context or lifestyle appeal but remain secondary to the product.",
    thumbnail: require("@/assets/images/outdoor.png"),
  },
  {
    type: "Indoor",
    prompt:
      "Position the product realistically within an appropriate indoor setting (e.g., modern home interior, cozy living room, minimalist office, stylish cafe) which is related with the product. Use natural window light or soft, ambient artificial lighting suitable for the environment. The background should provide context or enhance lifestyle appeal without clutter or distraction.",
    thumbnail: require("@/assets/images/indoor.png"),
  },
];
