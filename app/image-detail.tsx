import { View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { GenerationHistory } from "@/types/generationHistory";
import { Gesture, GestureDetector, TextInput } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useWorkletCallback,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft, CheckCircle, Download, Pencil, Trash, X } from "lucide-react-native";
import BottomSheet from "@/components/BottomSheet";
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

  // Görsel ve container boyutlarını tutacak sharedValue'lar
  const imageWidth = useSharedValue(0);
  const imageHeight = useSharedValue(0);
  const containerWidth = useSharedValue(0);
  const containerHeight = useSharedValue(0);

  // Görselin yüklenmesi
  useEffect(() => {
    if (imageUri) {
      Image.getSize(imageUri, (width, height) => {
        imageWidth.value = width;
        imageHeight.value = height;
      });
    }
  }, [imageUri]);

  // Sınırları hesaplama fonksiyonu
  const calculateBounds = useCallback(() => {
    "worklet";

    // Eğer scale 1 ise hiç kaydırma yok
    if (scale.value <= 1) {
      return { xMin: 0, xMax: 0, yMin: 0, yMax: 0 };
    }

    // Görsel boyutları hesaplanmadıysa
    if (imageWidth.value === 0 || containerWidth.value === 0) {
      return { xMin: 0, xMax: 0, yMin: 0, yMax: 0 };
    }

    // Görsel ve container aspect ratio'larını hesapla
    const imageRatio = imageWidth.value / imageHeight.value;
    const containerRatio = containerWidth.value / containerHeight.value;

    // Container içinde görüntülenen görsel boyutlarını hesapla
    // (aspect ratio korunarak)
    let displayedWidth, displayedHeight;

    if (imageRatio > containerRatio) {
      // Görsel genişliği container genişliğiyle sınırlı
      displayedWidth = containerWidth.value;
      displayedHeight = containerWidth.value / imageRatio;
    } else {
      // Görsel yüksekliği container yüksekliğiyle sınırlı
      displayedHeight = containerHeight.value;
      displayedWidth = containerHeight.value * imageRatio;
    }

    // Ölçeklendirilmiş boyutlar
    const scaledWidth = displayedWidth * scale.value;
    const scaledHeight = displayedHeight * scale.value;

    // X ekseni sınırları (varsa)
    const xLimit = Math.max(0, (scaledWidth - containerWidth.value) / 2);

    // Y ekseni sınırları (varsa)
    const yLimit = Math.max(0, (scaledHeight - containerHeight.value) / 2);

    return {
      xMin: -xLimit,
      xMax: xLimit,
      yMin: -yLimit,
      yMax: yLimit,
    };
  }, []);

  const constrainPosition = useCallback(() => {
    "worklet";
    const bounds = calculateBounds();

    // Mevcut offset'i sınırlar içinde tut
    offset.value = {
      x: Math.min(Math.max(offset.value.x, bounds.xMin), bounds.xMax),
      y: Math.min(Math.max(offset.value.y, bounds.yMin), bounds.yMax),
    };
  }, []);

  const pinch = Gesture.Pinch()
    .onStart(() => {
      "worklet";
      baseScale.value = scale.value;
    })
    .onUpdate((event) => {
      "worklet";
      // Yeni scale'i hesapla ve sınırla
      scale.value = Math.min(Math.max(baseScale.value * event.scale, 1), 5);
    })
    .onEnd(() => {
      "worklet";
      // Scale 1'in altındaysa, 1'e resetle ve offset'i temizle
      if (scale.value < 1) {
        scale.value = withTiming(1);
        offset.value = withTiming({ x: 0, y: 0 });
      } else {
        // Sınırları uygula
        constrainPosition();
      }
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      "worklet";
      if (scale.value === 1) {
        scale.value = withTiming(2.5);
      } else {
        scale.value = withTiming(1);
        offset.value = withTiming({ x: 0, y: 0 });
      }
    });

  const pan = Gesture.Pan()
    .onStart(() => {
      "worklet";
      baseOffset.value = offset.value;
    })
    .onUpdate((event) => {
      "worklet";
      // Sadece scale > 1 ise kaydırmaya izin ver
      if (scale.value > 1) {
        const bounds = calculateBounds();

        // Yeni pozisyonu hesapla
        const newX = baseOffset.value.x + event.translationX;
        const newY = baseOffset.value.y + event.translationY;

        // Sınırlar içinde tut
        offset.value = {
          x: Math.min(Math.max(newX, bounds.xMin), bounds.xMax),
          y: Math.min(Math.max(newY, bounds.yMin), bounds.yMax),
        };
      }
    })
    .onEnd(() => {
      "worklet";
      constrainPosition();
    });

  // Tüm gesture'ları birleştir
  const composed = Gesture.Simultaneous(pinch, doubleTap, pan);

  const animatedStyle = useAnimatedStyle(() => {
    "worklet";
    return {
      transform: [{ translateX: offset.value.x }, { translateY: offset.value.y }, { scale: scale.value }],
      width: "100%",
      height: "100%",
    };
  });

  // Container boyutları değiştiğinde güncelle
  const onLayoutContainer = useCallback((event: any) => {
    const { width, height } = event.nativeEvent.layout;
    containerWidth.value = width;
    containerHeight.value = height;
  }, []);

  return (
    <GestureDetector gesture={composed}>
      <View
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
        onTouchEnd={() => setIsActionOverlayVisible(!isActionOverlayVisible)}
        className="flex-1 overflow-hidden"
        onLayout={onLayoutContainer}
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
  // Router
  const router = useRouter();

  const insets = useSafeAreaInsets();
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isActionOverlayVisible ? 1 : 0),
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 2,
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
      className="flex flex-col pointer-events-box-none items-center justify-between h-full"
      style={[animatedStyle]}
    >
      <View
        style={{ paddingTop: insets.top }}
        className="w-full flex flex-row items-center justify-start px-horizontal"
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-3 rounded-full bg-secondaryBg border border-border flex items-center justify-center"
        >
          <ArrowLeft size={20} color={"#fff"} />
        </TouchableOpacity>
      </View>
      <View
        style={{ paddingBottom: insets.bottom + 10 }}
        className="w-full flex flex-row items-center justify-between px-horizontal bg-black/30 pt-4"
      >
        <TouchableOpacity className="flex w-[50px] items-center justify-center bg-tint rounded-full aspect-square">
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
            className="bg-secondaryBg w-[50px] rounded-full aspect-square border border-border flex items-center justify-center"
          >
            <Pencil size={20} color={"#787878"} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setDeleteSheetVisible(true)}
            className="bg-secondaryBg w-[50px] rounded-full aspect-square border border-border flex items-center justify-center"
          >
            <Trash size={20} color={"#787878"} />
          </TouchableOpacity>
        </View>
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
    <BottomSheet isVisible={isEditSheetVisible} setIsVisible={setIsEditSheetVisible} height={220}>
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
          className="text-white p-4 rounded-xl border border-border h-[100px] text-[16px] bg-secondaryBg"
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
