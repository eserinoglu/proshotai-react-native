import { View, Text, SafeAreaView, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useImageGeneration } from "@/providers/ImageGenerationProvider";
import { BlurView } from "expo-blur";

export default function GeneratedImage() {
  const { generatedImage } = useImageGeneration();
  return (
    <View className="flex-1 px-horizontal bg-white dark:bg-black">
      <SafeAreaView className="flex-1 flex flex-col">
        <View className="w-full h-[500px] rounded-xl overflow-hidden">
          <Image
            source={{ uri: `data:image/png;base64,${generatedImage}` }}
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 1,
            }}
            resizeMode="cover"
          />
          <BlurView intensity={20} className="absolute w-full h-full top-0 left-0 z-[3]" />
          <Image
            source={{ uri: `data:image/png;base64,${generatedImage}` }}
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
    await saveToGallery(generatedImage);
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
