export interface BackgroundType {
  type: string;
  prompt: string;
  thumbnail: any;
}

export const allBackgroundTypes: BackgroundType[] = [
  {
    type: "Studio",
    prompt:
      "Use a solid color studio background with soft and even lighting, ensuring a professional and distraction-free setting.",
    thumbnail: require("@/assets/images/studio.png"),
  },
  {
    type: "Outdoor",
    prompt:
      "Place the product in an outdoor environment, ensuring a natural backdrop that enhances realism and lifestyle appeal.",
    thumbnail: require("@/assets/images/outdoor.png"),
  },
];
