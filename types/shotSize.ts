export interface ShotSize {
  type: string;
  prompt: string;
  thumbnail: any;
}

export const allShotSizes: ShotSize[] = [
  {
    type: "Close-Up",
    prompt:
      "Frame the shot extremely close to the product or a specific, important part of it. Emphasize intricate details, material textures, craftsmanship, or unique features. Apply a shallow depth of field to isolate the subject and softly blur the immediate background.",
    thumbnail: require("@/assets/images/close.png"),
  },
  {
    type: "Mid-Shot",
    prompt:
      "Compose a medium shot capturing a significant portion of the product (e.g., waist-up for clothing on a model, main body of an object). Balance showing the overall shape with revealing important details. Include some of the immediate environment or background context as defined by the background type.",
    thumbnail: require("@/assets/images/mid.png"),
  },
  {
    type: "Full Shot",
    prompt:
      "Capture the entire product within the frame, showing its full form and scale. Wide angle. If on a model, show the full figure. Include relevant surrounding context or environment as defined by the background prompt, ensuring the product remains prominent and well-composed within the scene.",
    thumbnail: require("@/assets/images/full.png"),
  },
];
