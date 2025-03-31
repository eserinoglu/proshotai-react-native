export interface PresentationType {
  type: string;
  prompt: string;
  thumbnail: any;
}

export const allPresentationTypes: PresentationType[] = [
  {
    type: "On Model",
    prompt:
      "Showcase the product naturally worn or used by a realistic human model. The model's pose and expression should be neutral or subtly positive, complementing the product without distracting from it. Ensure the product remains the clear focus. Adopt a professional fashion or lifestyle photography aesthetic relevant to the product type.",
    thumbnail: require("@/assets/images/model.png"),
  },
  {
    type: "Product",
    prompt:
      "Isolate the product as the sole subject. Present it with sharp focus against a clean, non-distracting background (as specified by the background type). Emphasize its form, key features, and material texture. Use classic, professional product-only photography lighting and composition. No figures or people should be present in the image.",
    thumbnail: require("@/assets/images/product.png"),
  },
  {
    type: "Flat",
    prompt:
      "Arrange the product neatly in a flat lay composition, viewed directly from above (bird's-eye view). Use even, diffused lighting ideal for flat surfaces, highlighting details and textures without harsh shadows. Ensure the composition on the surface (defined by the background type) is clean, organized, and aesthetically pleasing.",
    thumbnail: require("@/assets/images/flat.png"),
  },
];
