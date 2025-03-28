import { View, Text, SafeAreaView, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useImageGeneration } from "@/providers/ImageGenerationProvider";
import { BlurView } from "expo-blur";

export default function GeneratedImage() {
  const { generatedImage } = useImageGeneration();
  return (
    <View className="flex-1 px-horizontal bg-background">
      <SafeAreaView className="flex-1 flex flex-col">
        <View className="w-full h-[500px] rounded-xl overflow-hidden bg-secondaryBg">
          <Image
            source={{ uri: generatedImage?.imageUri }}
            style={{ width: "100%", height: "100%", zIndex: 3 }}
            resizeMode="contain"
          />
        </View>
        <DownloadButton />
      </SafeAreaView>
    </View>
  );
}

function DownloadButton() {
  const { generatedImage, saveToGallery } = useImageGeneration();
  const handleSaveToGallery = async () => {
    if (!generatedImage) return;
    await saveToGallery(generatedImage.imageUri);
  };
  return (
    <TouchableOpacity
      onPress={handleSaveToGallery}
      className="bg-black/5 dark:bg-white/5 p-4 mb-4 mt-auto rounded-xl w-full items-center justify-center"
    >
      <Text className="text-black dark:text-white font-medium">Download Image</Text>
    </TouchableOpacity>
  );
}
