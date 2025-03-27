import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, Modal } from "react-native";
import React from "react";
import { Octicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useImageGeneration } from "@/providers/ImageGenerationProvider";

export default function Home() {
  const { generatedImage } = useImageGeneration();
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <ScrollView className="flex-1" contentContainerClassName="px-horizontal">
        <UploadProductPhoto />
        <Filters />
      </ScrollView>
      <GenerateButton />
    </SafeAreaView>
  );
}

function UploadProductPhoto() {
  const { setUploadedImage, uploadedImage } = useImageGeneration();
  const uploadImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
      base64: true,
      mediaTypes: ["images"],
    });
    if (!result.canceled) {
      setUploadedImage(result.assets[0].base64!);
    }
  };
  return (
    <TouchableOpacity
      onPress={uploadImage}
      className="mt-4 w-full h-[400px] rounded-xl gap-2 border border-black/5 dark:border-white/5 bg-neutral-100 dark:bg-neutral-900 flex flex-col items-center justify-center"
    >
      {uploadedImage ? (
        <Image
          source={{ uri: `data:image/png;base64,${uploadedImage}` }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="contain"
        />
      ) : (
        <View className="flex flex-col gap-1 items-center">
          <Octicons className="opacity-40" name="image" size={64} color="black" />
          <Text className="text-xl font-medium tracking-tight opacity-40">
            Upload Product Photo
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function GenerateButton() {
  const { imageGeneration } = useImageGeneration();
  return (
    <TouchableOpacity
      onPress={imageGeneration}
      className="bg-black/5 dark:bg-white/5 p-4 mb-4 rounded-xl w-full items-center justify-center"
    >
      <Text className="text-lg font-medium text-black dark:text-white">Generate Image</Text>
    </TouchableOpacity>
  );
}

function Filters() {
  const shotSizes = ["wide", "close", "medium"];
  const { selectedShotSize, setSelectedShotSize } = useImageGeneration();
  return (
    <View className="w-full flex flex-row items-center gap-2 mt-4">
      {shotSizes.map((size) => {
        const isSelected = selectedShotSize === size;
        return (
          <TouchableOpacity
            onPress={() => setSelectedShotSize(size as any)}
            style={{ backgroundColor: isSelected ? "blue" : "transparent" }}
            key={size}
            className="px-4 py-2 rounded-xl border border-black/10"
          >
            <Text style={{ color: isSelected ? "white" : "black" }}>{size.toUpperCase()}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
