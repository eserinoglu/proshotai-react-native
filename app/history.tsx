import { View, Text, FlatList, Image, Dimensions } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { getHistory } from "@/service/database/historyDatabase";
import { GenerationHistory } from "@/types/generationHistory";
import { ImageMinus } from "lucide-react-native";

export default function History() {
  const [history, setHistory] = React.useState<GenerationHistory[] | []>([]);
  const fetchHistory = async () => {
    const history = await getHistory();
    setHistory(history);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const imageWidth = Dimensions.get("window").width / 3

  return (
    <View className="flex-1 px-horizontal bg-background">
      <SafeAreaView className="flex-1 flex-col gap-5 pt-8">
        <Text className="text-[30px] font-bold text-white">History</Text>
        <FlatList
          data={history}
          keyExtractor={(item) => item.id!.toString()}
          ListEmptyComponent={() => <EmptyListComponent />}
          numColumns={3}
          renderItem={({ item }) => (
            <Image source={{ uri: item.imageUri }} style={{ width: imageWidth, aspectRatio : 1, borderRadius: 10 }} />
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
      <Text className="text-secondaryText font-medium text-[16px]">You haven't generated any image yet.</Text>
    </View>
  );
}
