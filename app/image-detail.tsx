import { View, Text, SafeAreaView, Image, TouchableOpacity, TextInput, ScrollView } from "react-native";
import React from "react";
import { useImageGeneration } from "@/providers/ImageGenerationProvider";
import { useLocalSearchParams, useRouter } from "expo-router";
import { GenerationHistory } from "@/types/generationHistory";
import { format } from "date-fns";
import BottomSheet from "@/components/common/BottomSheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Pencil, LoaderCircle, Trash } from "lucide-react-native";
import { useHistoryDatabase } from "@/providers/HistoryDatabaseProvider";

export default function ImageDetail() {
  // Router
  const router = useRouter();
  // Safe area insets
  const insets = useSafeAreaInsets();

  // Image editing function import
  const { imageEditing } = useImageGeneration();

  // History database context
  const { deleteHistoryByImage } = useHistoryDatabase();

  const searchParams = useLocalSearchParams();
  // Get the image data from the search params
  const { generatedImage } = searchParams;
  const image = JSON.parse(generatedImage as string) as GenerationHistory;

  // Edit sheet visibility and other properties
  const [isEditSheetVisible, setIsEditSheetVisible] = React.useState(false);
  const [editPrompt, setEditPrompt] = React.useState("");

  // Delete sheet visibility and other properties
  const [isDeleteSheetVisible, setIsDeleteSheetVisible] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const handleDelete = async () => {
    if (!image) return;
    setIsDeleting(true);
    await deleteHistoryByImage(image);
    setIsDeleting(false);
    setIsDeleteSheetVisible(false);
    router.back();
  };

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
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical={false}
        contentContainerClassName="flex-1 flex-col px-horizontal"
        contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        <TouchableOpacity
          onPress={() => setIsDeleteSheetVisible(true)}
          className="px-[12px] py-[6px] rounded-xl bg-secondaryBg w-[70px] flex items-center justify-center ml-auto"
        >
          <Text className="text-[14px] font-medium text-secondaryText">Delete</Text>
        </TouchableOpacity>
        <View className="w-full h-3/5 rounded-xl overflow-hidden bg-secondaryBg mt-4">
          <Image source={{ uri: image?.imageUri }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
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
      <DeleteBottomSheet
        isDeleteSheetVisible={isDeleteSheetVisible}
        setIsDeleteSheetVisible={setIsDeleteSheetVisible}
        handleDelete={handleDelete}
        isDeleting={isDeleting}
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
    <BottomSheet isVisible={isEditSheetVisible} setIsVisible={setIsEditSheetVisible} height={230}>
      <View className="flex flex-col gap-4 pt-6 px-horizontal">
        <TextInput
          multiline
          placeholderTextColor={"#787878"}
          placeholder="Edit the image"
          className="h-[150px] border border-border p-4 rounded-xl text-white bg-secondaryBg text-[16px]"
          value={editPrompt}
          onChangeText={setEditPrompt}
          textAlignVertical="top"
          returnKeyType="done"
          returnKeyLabel="Done"
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
// Delete history sheet
function DeleteBottomSheet({
  isDeleteSheetVisible,
  setIsDeleteSheetVisible,
  handleDelete,
  isDeleting,
}: {
  isDeleteSheetVisible: boolean;
  setIsDeleteSheetVisible: (isVisible: boolean) => void;
  handleDelete: () => Promise<void>;
  isDeleting: boolean;
}) {
  return (
    <BottomSheet isVisible={isDeleteSheetVisible} setIsVisible={setIsDeleteSheetVisible} height={190}>
      <View className="flex flex-col gap-4 pt-6 px-horizontal">
        <Text className="text-[22px] font-semibold text-white">Delete History</Text>
        <Text className="text-[15px] text-secondaryText">
          Are you sure you want to delete this image? This action cannot be undone and you will not be able to restore
          it.
        </Text>
        <View className="w-full items-center mt-2 gap-2 flex-row">
          <TouchableOpacity
            onPress={handleDelete}
            className="bg-red-500 h-[50px] mb-4 rounded-xl flex-1 flex-row gap-2 items-center justify-center"
          >
            {isDeleting ? (
              <View className="animate-spin">
                <LoaderCircle size={18} color="#fff" />
              </View>
            ) : (
              <Trash size={18} color="#fff" />
            )}
            <Text className="text-white font-semibold text-[16px]">{isDeleting ? "Deleting" : "Delete"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsDeleteSheetVisible(false)}
            className="bg-secondaryBg border border-border h-[50px] mb-4 rounded-xl w-[120px] items-center justify-center"
          >
            <Text className="text-white font-semibold text-[16px]">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheet>
  );
}
