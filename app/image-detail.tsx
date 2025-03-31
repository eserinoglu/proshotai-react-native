import { View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { GenerationHistory } from "@/types/generationHistory";
import { Gesture, GestureDetector, TextInput } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CheckCircle, Download, Pencil, Trash, X } from "lucide-react-native";
import BottomSheet from "@/components/common/BottomSheet";
import { useHistoryDatabase } from "@/providers/HistoryDatabaseProvider";
import { useImageGeneration } from "@/providers/ImageGenerationProvider";
import { exportToGallery } from "@/service/imageSave";

export default function ImageDetail() {
  const searchParams = useLocalSearchParams();
  const image = JSON.parse(searchParams.generatedImage as string) as GenerationHistory;

  // History database hook
  const { deleteHistoryByImage } = useHistoryDatabase();
  // Image generation hook
  const { imageEditing } = useImageGeneration();

  // Action footer overlay visiblity
  const [isActionOverlayVisible, setIsActionOverlayVisible] = React.useState(true);

  // Edit sheet visibility and other editing options
  const [editPrompt, setEditPrompt] = React.useState("");
  const [isEditSheetVisible, setIsEditSheetVisible] = React.useState(false);
  const handleEdit = async () => {
    await imageEditing(image.imageUri, editPrompt);
  };

  // Delete sheet visibility and other delete options
  const [isDeleteSheetVisible, setIsDeleteSheetVisible] = React.useState(false);
  const handleDelete = async () => {
    await deleteHistoryByImage(image);
  };

  // Save image to gallery
  const saveImage = async () => {
    await exportToGallery(image.imageUri);
  };

  return (
    <View className="flex-1">
      <ImagePreview
        isActionOverlayVisible={isActionOverlayVisible}
        setIsActionOverlayVisible={setIsActionOverlayVisible}
        imageUri={image.imageUri}
      />
      <ActionOverlay
        isActionOverlayVisible={isActionOverlayVisible}
        setIsEditSheetVisible={setIsEditSheetVisible}
        setDeleteSheetVisible={setIsDeleteSheetVisible}
        handleDownload={saveImage}
      />
      <EditImageSheet
        isEditSheetVisible={isEditSheetVisible}
        setIsEditSheetVisible={setIsEditSheetVisible}
        editPrompt={editPrompt}
        setEditPrompt={setEditPrompt}
        handleEdit={handleEdit}
      />
      <DeleteSheet
        isDeleteSheetVisible={isDeleteSheetVisible}
        setIsDeleteSheetVisible={setIsDeleteSheetVisible}
        handleDelete={handleDelete}
      />
    </View>
  );
}

function ImagePreview({
  imageUri,
  isActionOverlayVisible,
  setIsActionOverlayVisible,
}: {
  imageUri: string;
  isActionOverlayVisible: boolean;
  setIsActionOverlayVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const insets = useSafeAreaInsets();

  const scale = useSharedValue(1);
  const baseScale = useSharedValue(1);

  const offset = useSharedValue({ x: 0, y: 0 });
  const baseOffset = useSharedValue({ x: 0, y: 0 });

  const pinch = Gesture.Pinch()
    .onStart(() => {
      baseScale.value = scale.value;
    })
    .onUpdate((event) => {
      scale.value = baseScale.value * event.scale;
    })
    .onEnd(() => {
      if (scale.value < 1) {
        scale.value = withTiming(1);
        offset.value = withTiming({ x: 0, y: 0 });
      } else if (scale.value > 5) {
        scale.value = withTiming(5);
      }
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (scale.value === 1) {
        scale.value = withTiming(2);
      } else {
        scale.value = withTiming(1);
      }
    });

  const pan = Gesture.Pan()
    .onStart(() => {
      baseOffset.value = offset.value;
    })
    .onUpdate((event) => {
      offset.value = {
        x: baseOffset.value.x + event.translationX,
        y: baseOffset.value.y + event.translationY,
      };
    });
  // Combine gestures
  const composed = Gesture.Simultaneous(pinch, doubleTap);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value.x }, { translateY: offset.value.y }, { scale: scale.value }],
      width: "100%",
      height: "100%",
    };
  });

  return (
    <GestureDetector gesture={composed}>
      <View
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
        onTouchStart={() => setIsActionOverlayVisible(!isActionOverlayVisible)}
        className="flex-1 overflow-hidden "
      >
        <Animated.Image resizeMode="contain" source={{ uri: imageUri }} style={[animatedStyle]} />
      </View>
    </GestureDetector>
  );
}

function ActionOverlay({
  isActionOverlayVisible,
  setIsEditSheetVisible,
  setDeleteSheetVisible,
  handleDownload,
}: {
  isActionOverlayVisible: boolean;
  setIsEditSheetVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setDeleteSheetVisible: React.Dispatch<React.SetStateAction<boolean>>;
  handleDownload: () => Promise<void>;
}) {
  const insets = useSafeAreaInsets();
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isActionOverlayVisible ? 1 : 0),
    };
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const handleDownloadImage = async () => {
    setIsSaving(true);
    try {
      await handleDownload();
      setIsSaved(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Animated.View
      style={[animatedStyle, { paddingBottom: insets.bottom + 12 }]}
      className="w-full flex flex-row items-center justify-between absolute bottom-0 px-horizontal bg-black/30 pt-4"
    >
      <TouchableOpacity className="flex w-[55px] items-center justify-center bg-tint rounded-xl h-[44px]">
        {isSaving ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : isSaved ? (
          <CheckCircle size={20} color={"#fff"} />
        ) : (
          <Download size={20} color={"#fff"} onPress={handleDownloadImage} />
        )}
      </TouchableOpacity>
      <View className="flex flex-row items-center gap-2">
        <TouchableOpacity
          onPress={() => setIsEditSheetVisible(true)}
          className="bg-secondaryBg w-[55px] rounded-xl h-[44px] border border-border flex items-center justify-center"
        >
          <Pencil size={20} color={"#787878"} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setDeleteSheetVisible(true)}
          className="bg-secondaryBg w-[55px] rounded-xl h-[44px] border border-border flex items-center justify-center"
        >
          <Trash size={20} color={"#787878"} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

function EditImageSheet({
  isEditSheetVisible,
  setIsEditSheetVisible,
  editPrompt,
  setEditPrompt,
  handleEdit,
}: {
  isEditSheetVisible: boolean;
  setIsEditSheetVisible: React.Dispatch<React.SetStateAction<boolean>>;
  editPrompt: string;
  setEditPrompt: React.Dispatch<React.SetStateAction<string>>;
  handleEdit: () => Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const handleEditImage = async () => {
    setIsEditing(true);
    try {
      await handleEdit();
      setIsEditSheetVisible(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsEditing(false);
    }
  };
  return (
    <BottomSheet isVisible={isEditSheetVisible} setIsVisible={setIsEditSheetVisible} height={270}>
      <View className="px-horizontal pt-6 flex flex-col gap-4">
        <View className="w-full flex flex-row items-center justify-between">
          <Text className="text-[22px] font-semibold text-white ml-2">Edit Image</Text>
          <TouchableOpacity onPress={() => setIsEditSheetVisible(false)} className="p-2 rounded-full bg-white/5">
            <X size={16} strokeWidth={3} color={"#787878"} />
          </TouchableOpacity>
        </View>
        <TextInput
          multiline
          textAlignVertical="top"
          className="text-white p-4 rounded-xl border border-border h-[150px] text-[16px] bg-secondaryBg"
          value={editPrompt}
          onChangeText={setEditPrompt}
          placeholder="Make the purse pink."
          placeholderTextColor={"#787878"}
        />
        <TouchableOpacity
          onPress={handleEditImage}
          className="w-full bg-tint h-[45px] rounded-xl flex items-center justify-center"
        >
          {isEditing ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-white font-medium text-[16px]">Edit Image</Text>
          )}
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
}

function DeleteSheet({
  isDeleteSheetVisible,
  setIsDeleteSheetVisible,
  handleDelete,
}: {
  isDeleteSheetVisible: boolean;
  setIsDeleteSheetVisible: React.Dispatch<React.SetStateAction<boolean>>;
  handleDelete: () => Promise<void>;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const deleteHistory = async () => {
    setIsDeleting(true);
    try {
      await handleDelete();
      setIsDeleteSheetVisible(false);
      router.back();
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <BottomSheet isVisible={isDeleteSheetVisible} setIsVisible={setIsDeleteSheetVisible} height={160}>
      <View className="w-full px-horizontal pt-5 flex flex-col">
        <View className="w-full flex flex-row items-center justify-between">
          <Text className="text-[22px] font-semibold text-white">Delete Image</Text>
          <TouchableOpacity onPress={() => setIsDeleteSheetVisible(false)} className="p-2 rounded-full bg-white/5">
            <X size={16} strokeWidth={3} color={"#787878"} />
          </TouchableOpacity>
        </View>
        <Text className="text-secondaryText text-[14px] leading-snug mt-4">
          Are you sure you want to delete this image from history? This action cannot be undone.
        </Text>
        <TouchableOpacity
          onPress={deleteHistory}
          className="w-full bg-red-500 h-[45px] rounded-xl flex items-center justify-center mt-5"
        >
          {isDeleting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-white font-medium text-[16px]">Delete</Text>
          )}
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
}
