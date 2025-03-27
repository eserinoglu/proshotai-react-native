import { createContext, useContext, useState } from "react";

interface ImageGenerationContextProps {
  uploadedImage: string | null;
  setUploadedImage: (image: string | null) => void;
  generateImage: () => Promise<void>;
  generatedImage: string | null;
}

export const ImageGenerationContext = createContext<ImageGenerationContextProps>({
  uploadedImage: null,
  setUploadedImage: () => {},
  generateImage: async () => {},
  generatedImage: null,
});

interface ImageGenerationProviderProps {
  children: React.ReactNode;
}
export const ImageGenerationProvider = ({ children }: ImageGenerationProviderProps) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const generateImage = async () => {
    // This is where the image generation logic would go
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setGeneratedImage("https://via.placeholder.com/400");
  };

  return (
    <ImageGenerationContext.Provider
      value={{ uploadedImage, setUploadedImage, generateImage, generatedImage }}
    >
      {children}
    </ImageGenerationContext.Provider>
  );
};

export const useImageGeneration = () => {
  const context = useContext(ImageGenerationContext);
  if (!context) {
    throw new Error("useImageGeneration must be used within an ImageGenerationProvider");
  }
  return context;
};
