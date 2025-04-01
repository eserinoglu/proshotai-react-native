import { View, Text, FlatList, Image, Dimensions, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { GenerationHistory } from "@/types/generationHistory";
import { ImageMinus, X } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useHistoryDatabase } from "@/providers/HistoryDatabaseProvider";
import BottomSheet from "@/components/BottomSheet";

export default function History() {
  const { allHistory, fetchHistory } = useHistoryDatabase();

  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchAllHistory = async () => {
      await fetchHistory();
    };
    fetchAllHistory();
  }, []);

  const imageWidth = (Dimensions.get("window").width) / 4 - 2

  const router = useRouter();
  const navigateToDetail = (generationHistory: GenerationHistory) => {
    router.push({
      pathname: "/image-detail",
      params: {
        generatedImage: JSON.stringify(generationHistory),
      },
    });
  };

  const [isVisibleHistoryClearSheet, setIsVisibleHistoryClearSheet] = React.useState(false);

  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 bg-background">
      <FlatList
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View className="w-full flex flex-row items-center justify-between mb-4 px-horizontal">
            <Text className="text-[30px] font-bold text-white">History</Text>
            <HistoryClearButton setIsVisibleHistoryClearSheet={setIsVisibleHistoryClearSheet} />
          </View>
        )}
        contentContainerClassName="mt-8 pb-10 gap-[2px]"
        columnWrapperClassName="gap-[2px]"
        data={allHistory}
        keyExtractor={(item) => item.imageUri}
        ListEmptyComponent={() => <EmptyListComponent />}
        numColumns={4}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigateToDetail(item)}>
            <Image source={{ uri: item.imageUri }} style={{ width: imageWidth, aspectRatio: 1, borderRadius: 0 }} />
          </TouchableOpacity>
        )}
      />
      <HistoryClearConfirmationSheet
        isVisibleHistoryClearSheet={isVisibleHistoryClearSheet}
        setIsVisibleHistoryClearSheet={setIsVisibleHistoryClearSheet}
      />
    </View>
  );
}

function EmptyListComponent() {
  return (
    <View className="flex-1 flex-col items-center justify-center gap-3 mt-20">
      <ImageMinus size={60} color="#787878" strokeWidth={1} />
      <Text className="text-secondaryText font-medium text-[16px]">You haven't generated any image yet.</Text>
    </View>
  );
}

function HistoryClearButton({
  setIsVisibleHistoryClearSheet,
}: {
  setIsVisibleHistoryClearSheet: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <TouchableOpacity
      onPress={() => setIsVisibleHistoryClearSheet(true)}
      className="px-[12px] py-[6px] rounded-xl bg-secondaryBg"
    >
      <Text className="text-[14px] font-medium text-secondaryText">Clear</Text>
    </TouchableOpacity>
  );
}

function HistoryClearConfirmationSheet({
  isVisibleHistoryClearSheet,
  setIsVisibleHistoryClearSheet,
}: {
  isVisibleHistoryClearSheet: boolean;
  setIsVisibleHistoryClearSheet: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { deleteAllHistory } = useHistoryDatabase();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const handleDeleteHistory = async () => {
    setIsDeleting(true);
    try {
      await deleteAllHistory();
      setIsVisibleHistoryClearSheet(false);
    } catch (error) {
      console.error("Error deleting history:", error);
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <BottomSheet isVisible={isVisibleHistoryClearSheet} setIsVisible={setIsVisibleHistoryClearSheet} height={180}>
      <View className="w-full flex flex-col px-horizontal pt-5">
        <View className="w-full flex flex-row items-center justify-between">
          <Text className="text-[22px] font-semibold text-white">Clear History</Text>
          <TouchableOpacity
            onPress={() => setIsVisibleHistoryClearSheet(false)}
            className="p-2 rounded-full bg-white/5"
          >
            <X size={16} strokeWidth={3} color={"#787878"} />
          </TouchableOpacity>
        </View>
        <Text className="text-[14px] text-secondaryText leading-snug mt-3">
          Are you sure you want to clear the history? This action will delete all the images that you have generated.
          Cannot be undone.
        </Text>
        <TouchableOpacity
          onPress={handleDeleteHistory}
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
