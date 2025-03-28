import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { Coins, History} from "lucide-react-native"

export default function Home() {
  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1" contentContainerClassName="px-horizontal pt-5">
          <Header />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Header() {
  return (
    <View className="w-full flex flex-row items-center justify-between">
      <TouchableOpacity className="rect flex flex-row items-center gap-2">
        <Coins size={20} color="#FF9900" />
        <Text className="text-white font-medium">5 CREDITS</Text>
      </TouchableOpacity>
      <TouchableOpacity className="rect flex flex-row items-center gap-2">
        <History size={20} color="#787878" />
        <Text className="font-medium text-secondaryText">History</Text>
      </TouchableOpacity>
    </View>
  );
}
