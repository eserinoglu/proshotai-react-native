import { View, Text, FlatList, Image, Dimensions, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { getHistory } from "@/service/database/historyDatabase";
import { GenerationHistory } from "@/types/generationHistory";
import { ImageMinus } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function History() {
  const [history, setHistory] = React.useState<GenerationHistory[] | []>([]);
  const fetchHistory = async () => {
    const history = await getHistory();
    setHistory(history);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const imageWidth = (Dimensions.get("window").width - 32) / 3 - 6;

  const router = useRouter();
  const navigateToDetail = (generationHistory: GenerationHistory) => {
    router.push({
      pathname: "/image-detail",
      params: {
        generatedImage: JSON.stringify(generationHistory),
      },
    });
  };

  return (
    <View className="flex-1 px-horizontal bg-background">
      <SafeAreaView className="flex-1 flex-col gap-5">
        <FlatList
          ListHeaderComponent={() => (
            <Text className="text-[30px] font-bold text-white mb-4">History</Text>
          )}
          contentContainerClassName="gap-[6px] mt-8"
          data={history}
          keyExtractor={(item) => item.imageUri}
          ListEmptyComponent={() => <EmptyListComponent />}
          numColumns={3}
          columnWrapperClassName="gap-[6px]"
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigateToDetail(item)}>
              <Image
                source={{ uri: item.imageUri }}
                style={{ width: imageWidth, aspectRatio: 1, borderRadius: 3 }}
              />
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </View>
  );
}

function EmptyListComponent() {
  return (
    <View className="flex-1 flex-col items-center justify-center gap-3 mt-20">
      <ImageMinus size={60} color="#787878" strokeWidth={1} />
      <Text className="text-secondaryText font-medium text-[16px]">
        You haven't generated any image yet.
      </Text>
    </View>
  );
}
