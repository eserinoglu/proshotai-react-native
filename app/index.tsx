import { View, Text, ScrollView, TouchableOpacity, Image, FlatList, TextInput } from "react-native";
import React from "react";
import { Coins, History, ImagePlus, WandSparkles, LoaderCircle } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { allPresentationTypes } from "@/types/presentationType";
import { allShotSizes } from "@/types/shotSize";
import { allBackgroundTypes } from "@/types/backgroundType";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useImageGeneration } from "@/providers/ImageGenerationProvider";
import { useRouter } from "expo-router";
import { useSupabase } from "@/providers/SupabaseProvide";

export default function Home() {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView edges={["top", "right", "left"]} className="flex-1">
      <ScrollView
        automaticallyAdjustKeyboardInsets
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 10 }}
        className="flex-1"
        contentContainerClassName="pt-5 gap-8"
      >
        <Header />
        <UploadImage />
        <PresentationTypeSelection />
        <ShotSizeSelection />
        <BackgroundTypeSelection />
        <UserInput />
        <GenerateButton />
      </ScrollView>
    </SafeAreaView>
  );
}

function Header() {
  const router = useRouter();
  const { user } = useSupabase();
  return (
    <View className="w-full flex flex-row items-center justify-between px-horizontal">
      <TouchableOpacity className="rect flex flex-row items-center gap-2">
        <Coins size={20} color="#FF9900" />
        <Text className="text-white font-medium">{user?.remaining_credits} CREDITS</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/history")} className="rect flex flex-row items-center gap-2">
        <History size={20} color="#787878" />
        <Text className="font-medium text-secondaryText">History</Text>
      </TouchableOpacity>
    </View>
  );
}

function UploadImage() {
  const { uploadedImage, setUploadedImage } = useImageGeneration();
  const uploadImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.2,
      mediaTypes: ["images"],
    });
    if (!result.canceled) {
      setUploadedImage(result.assets[0].uri);
    }
  };
  return (
    <View className="w-full px-horizontal">
      <TouchableOpacity
        onPress={uploadImage}
        className="w-full aspect-[3/4] rounded-2xl border overflow-hidden border-border bg-secondaryBg flex items-center justify-center gap-3"
      >
        {uploadedImage ? (
          <Image source={{ uri: uploadedImage }} style={{ width: "100%", height: "100%" }} resizeMode="contain" />
        ) : (
          <View className="flex flex-col gap-3 items-center">
            <ImagePlus size={72} color="#787878" strokeWidth={1.2} />
            <Text className="text-[20px] font-semibold text-secondaryText">Upload product photo</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

function PresentationTypeSelection() {
  const { selectedPresentationType, setSelectedPresentationType } = useImageGeneration();
  const presentationTypes = allPresentationTypes;
  return (
    <View className="w-full flex flex-col gap-3">
      <Text className="text-white font-semibold pl-horizontal text-[16px]">Presentation</Text>
      <FlatList
        horizontal
        contentContainerClassName="px-horizontal gap-2"
        data={presentationTypes}
        keyExtractor={(item) => item.type}
        renderItem={({ item }) => {
          const isSelected = selectedPresentationType.type === item.type;
          return (
            <TouchableOpacity
              onPress={() => setSelectedPresentationType(item)}
              style={{ opacity: isSelected ? 1 : 0.4 }}
              className="w-[75px] h-[90px] rounded-lg flex items-center justify-end overflow-hidden bg-neutral-500"
            >
              <Image
                source={item.thumbnail}
                style={{ position: "absolute", top: 0, right: 0, width: "100%", height: "100%" }}
              />
              <View className="w-full bg-black/60 flex items-center p-2">
                <Text className="text-[12px] text-white">{item.type}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

function ShotSizeSelection() {
  const shotSizes = allShotSizes;
  const { selectedShotSize, setSelectedShotSize } = useImageGeneration();
  return (
    <View className="w-full flex flex-col gap-3">
      <Text className="text-white font-semibold pl-horizontal text-[16px]">Shot Size</Text>
      <FlatList
        horizontal
        contentContainerClassName="px-horizontal gap-2"
        data={shotSizes}
        keyExtractor={(item) => item.type}
        renderItem={({ item }) => {
          const isSelected = selectedShotSize.type === item.type;
          return (
            <TouchableOpacity
              onPress={() => setSelectedShotSize(item)}
              style={{ opacity: isSelected ? 1 : 0.4 }}
              className="w-[75px] h-[90px] rounded-lg flex items-center justify-end overflow-hidden bg-neutral-500"
            >
              <Image
                source={item.thumbnail}
                style={{ position: "absolute", top: 0, right: 0, width: "100%", height: "100%" }}
              />
              <View className="w-full bg-black/60 flex items-center p-2 z-10">
                <Text className="text-[12px] text-white">{item.type}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

function BackgroundTypeSelection() {
  const backgroundTypes = allBackgroundTypes;
  const { selectedBackgroundType, setSelectedBackgroundType } = useImageGeneration();
  return (
    <View className="w-full flex flex-col gap-3">
      <Text className="text-white font-semibold pl-horizontal text-[16px]">Background</Text>
      <FlatList
        horizontal
        contentContainerClassName="px-horizontal gap-2"
        data={backgroundTypes}
        keyExtractor={(item) => item.type}
        renderItem={({ item }) => {
          const isSelected = selectedBackgroundType.type === item.type;
          return (
            <TouchableOpacity
              onPress={() => setSelectedBackgroundType(item)}
              style={{ opacity: isSelected ? 1 : 0.4 }}
              className="w-[75px] h-[90px] rounded-lg flex items-center justify-end overflow-hidden bg-neutral-500"
            >
              <Image
                source={item.thumbnail}
                style={{ position: "absolute", top: 0, right: 0, width: "100%", height: "100%" }}
              />
              <View className="w-full bg-black/60 flex items-center p-2">
                <Text className="text-[12px] text-white">{item.type}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

function UserInput() {
  const { userPrompt, setUserPrompt } = useImageGeneration();
  return (
    <View className="w-full px-horizontal">
      <TextInput
        multiline
        placeholderTextColor={"#787878"}
        placeholder="Anything you would like to add?"
        className="bg-secondaryBg p-3 rounded-xl border border-border text-white h-[100px] text-[16px]"
        value={userPrompt}
        onChangeText={setUserPrompt}
      />
    </View>
  );
}

function GenerateButton() {
  const { imageGeneration, uploadedImage } = useImageGeneration();
  const [isGenerating, setIsGenerating] = React.useState(false);
  const handleImageGeneration = async () => {
    setIsGenerating(true);
    try {
      if (!uploadedImage) return;
      await imageGeneration(uploadedImage);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsGenerating(false);
    }
  };
  return (
    <View className="w-full px-horizontal">
      <TouchableOpacity
        disabled={isGenerating}
        onPress={handleImageGeneration}
        className="w-full h-[50px] flex bg-tint items-center justify-center gap-2 flex-row rounded-xl"
      >
        {isGenerating ? (
          <View className="animate-spin">
            <LoaderCircle size={20} color="white" />
          </View>
        ) : (
          <WandSparkles size={20} color="white" />
        )}
        <Text className="text-white font-semibold text-[16px]">{isGenerating ? "Generating" : "Generate"}</Text>
      </TouchableOpacity>
    </View>
  );
}
