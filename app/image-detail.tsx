import { View, Text, SafeAreaView, Image, TouchableOpacity, TextInput, ScrollView } from "react-native";
import React from "react";
import { useImageGeneration } from "@/providers/ImageGenerationProvider";
import { useLocalSearchParams } from "expo-router";
import { GenerationHistory } from "@/types/generationHistory";
import { format } from "date-fns";
import BottomSheet from "@/components/common/BottomSheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Pencil, LoaderCircle } from "lucide-react-native";

export default function ImageDetail() {
  const insets = useSafeAreaInsets();
  const { imageEditing } = useImageGeneration();

  const searchParams = useLocalSearchParams();
  const { generatedImage } = searchParams;
  const image = JSON.parse(generatedImage as string) as GenerationHistory;

  // Edit sheet visibility and other properties
  const [isEditSheetVisible, setIsEditSheetVisible] = React.useState(false);
  const [editPrompt, setEditPrompt] = React.useState("");

  // Handle image editing
  const [isEditing, setIsEditing] = React.useState(false);
  const handleEdit = async () => {
    if (!image) return;
    setIsEditing(true);
    await imageEditing(image.imageUri, editPrompt);
    setEditPrompt("");
    setIsEditSheetVisible(false);
    setIsEditing(false);
  };
  return (
    <View className="flex-1 bg-background">
      <ScrollView
        contentContainerClassName="flex-1 flex-col px-horizontal"
        contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        <View className="w-full h-3/5 rounded-xl overflow-hidden bg-secondaryBg">
          <Image source={{ uri: image?.imageUri }} style={{ width: "100%", height: "100%" }} resizeMode="contain" />
        </View>
        <ImageMetadata image={image} />
        <DownloadButton setIsEditSheetVisible={setIsEditSheetVisible} generatedImage={image} />
      </ScrollView>
      <EditBottomSheet
        editPrompt={editPrompt}
        setEditPrompt={setEditPrompt}
        isEditSheetVisible={isEditSheetVisible}
        setIsEditSheetVisible={setIsEditSheetVisible}
        handleEdit={handleEdit}
        isEditing={isEditing}
      />
    </View>
  );
}

function ImageMetadata({ image }: { image: GenerationHistory }) {
  const metadata = [image.presentationType, image.shotSize, image.backgroundType];
  return (
    <View className="w-full flex flex-col gap-[11px] mt-[24px]">
      <Text className="text-secondaryText text-[16px]">{format(new Date(image.createdAt), "d MMMM y")}</Text>
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
        <View className="w-full flex items-start justify-start p-3 rounded-xl border border-border bg-secondaryBg">
          <Text className="text-secondaryText text-[14px]">{image.userInput}</Text>
        </View>
      )}
    </View>
  );
}
function DownloadButton({
  setIsEditSheetVisible,
  generatedImage,
}: {
  setIsEditSheetVisible: (isVisible: boolean) => void;
  generatedImage?: GenerationHistory;
}) {
  const { saveToGallery } = useImageGeneration();
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
        onPress={() => setIsEditSheetVisible(true)}
        className="bg-secondaryBg border border-border h-[50px] mb-4 rounded-xl w-[120px] items-center justify-center"
      >
        <Text className="text-white font-semibold text-[16px]">Edit</Text>
      </TouchableOpacity>
    </View>
  );
}

// Bottom sheet for editing
function EditBottomSheet({
  editPrompt,
  setEditPrompt,
  isEditSheetVisible,
  setIsEditSheetVisible,
  handleEdit,
  isEditing,
}: {
  editPrompt: string;
  setEditPrompt: (prompt: string) => void;
  isEditSheetVisible: boolean;
  setIsEditSheetVisible: (isVisible: boolean) => void;
  handleEdit: () => Promise<void>;
  isEditing: boolean;
}) {
  return (
    <BottomSheet isVisible={isEditSheetVisible} setIsVisible={setIsEditSheetVisible} height={250}>
      <View className="flex flex-col gap-4 pt-6 px-horizontal">
        <TextInput
          multiline
          placeholderTextColor={"#787878"}
          placeholder="Edit the image"
          className="h-[150px] border border-border p-4 rounded-xl text-white bg-secondaryBg text-[16px]"
          value={editPrompt}
          onChangeText={setEditPrompt}
        />
        <View className="w-full items-center mt-auto gap-2 flex-row">
          <TouchableOpacity
            onPress={handleEdit}
            className="bg-tint h-[50px] mb-4 rounded-xl flex-1 flex-row gap-2 items-center justify-center"
          >
            {isEditing ? (
              <View className="animate-spin">
                <LoaderCircle size={18} color="#fff" />
              </View>
            ) : (
              <Pencil size={18} color="#fff" />
            )}
            <Text className="text-white font-semibold text-[16px]">{isEditing ? "Editing" : "Edit"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsEditSheetVisible(false)}
            className="bg-secondaryBg border border-border h-[50px] mb-4 rounded-xl w-[120px] items-center justify-center"
          >
            <Text className="text-white font-semibold text-[16px]">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheet>
  );
}
