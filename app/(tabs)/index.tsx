import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { Octicons } from "@expo/vector-icons";

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <ScrollView className="flex-1" contentContainerClassName="px-horizontal">
        <UploadProductPhoto />
      </ScrollView>
    </SafeAreaView>
  );
}

function UploadProductPhoto() {
  return (
    <TouchableOpacity className="mt-4 w-full p-4 h-[400px] rounded-xl gap-2 border border-black/5 dark:border-white/5 bg-neutral-100 dark:bg-neutral-900 flex flex-col items-center justify-center">
      <Octicons className="opacity-40" name="image" size={64} color="black" />
      <Text className="text-xl font-medium tracking-tight opacity-40">Upload Product Photo</Text>
    </TouchableOpacity>
  );
}
