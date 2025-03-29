import { View, Text, SafeAreaView, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useImageGeneration } from "@/providers/ImageGenerationProvider";
import { useLocalSearchParams } from "expo-router";
import { GenerationHistory } from "@/types/generationHistory";
import { format } from "date-fns";

export default function GeneratedImage() {
  const searchParams = useLocalSearchParams();
  const { generatedImage } = searchParams;
  const image = JSON.parse(generatedImage as string) as GenerationHistory;
  return (
    <View className="flex-1 px-horizontal bg-background">
      <SafeAreaView className="flex-1 flex flex-col">
        <View className="w-full h-3/5 rounded-xl overflow-hidden bg-secondaryBg">
          <Image
            source={{ uri: image?.imageUri }}
            style={{ width: "100%", height: "100%", zIndex: 3 }}
            resizeMode="cover"
          />
        </View>
        <ImageMetadata image={image} />
        <DownloadButton />
      </SafeAreaView>
    </View>
  );
}

function ImageMetadata({ image }: { image: GenerationHistory }) {
  const metadata = [image.presentationType, image.shotSize, image.backgroundType];
  return (
    <View className="w-full flex flex-col gap-[11px] mt-[24px]">
      <Text className="text-secondaryText text-[16px]">
        {format(new Date(image.createdAt), "d MMMM y")}
      </Text>
      <View className="w-full flex flex-row flex-wrap gap-[6px]">
        {metadata.map((item) => (
          <Text
            key={item}
            className="text-secondaryText text-[14px] px-[12px] py-[6px] rounded-lg border border-border bg-secondaryBg"
          >
            {item}
          </Text>
        ))}
      </View>
      {image.userInput && (
        <View className="w-full flex items-start justify-start p-4 rounded-xl border border-border bg-secondaryBg">
          <Text className="text-secondaryText text-[14px]">{image.userInput}</Text>
        </View>
      )}
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
    <View className="w-full items-center mt-auto gap-2 flex-row">
      <TouchableOpacity
        onPress={handleSaveToGallery}
        className="bg-tint h-[50px] mb-4 rounded-xl flex-1 items-center justify-center"
      >
        <Text className="text-white font-semibold text-[16px]">Download Image</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleSaveToGallery}
        className="bg-secondaryBg border border-border h-[50px] mb-4 rounded-xl w-[120px] items-center justify-center"
      >
        <Text className="text-white font-semibold text-[16px]">Edit</Text>
      </TouchableOpacity>
    </View>
  );
}
