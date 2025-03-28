export interface PresentationType {
  type: string;
  prompt: string;
  thumbnail: any;
}

export const allPresentationTypes: PresentationType[] = [
  {
    type: "On Model",
    prompt:
      "Display the product worn by a model, ensuring a natural and stylish presentation that enhances its appeal.",
    thumbnail: require("@/assets/images/model.png"),
  },
  {
    type: "In Use",
    prompt:
      "Show the product in action, being used in a real-world scenario to demonstrate its functionality.",
    thumbnail: require("@/assets/images/inuse.png"),
  },
  {
    type: "On Hanger",
    prompt:
      "Present the product hanging on a stylish hanger, emphasizing its form and structure against a clean background.",
    thumbnail: require("@/assets/images/hanger.png"),
  },
  {
    type: "Flat",
    prompt:
      "Lay the product flat on a complementary surface, ensuring an aesthetically pleasing top-down composition.",
    thumbnail: require("@/assets/images/flat.png"),
  },
];
