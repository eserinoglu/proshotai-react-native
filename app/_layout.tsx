import { Stack } from "expo-router";
import "@/global.css";
import { ImageGenerationProvider } from "@/providers/ImageGenerationProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { initHistoryDatabase } from "@/service/database/historyDatabase";
import { useEffect } from "react";

const initializeApp = async () => {
  initHistoryDatabase();
};

export default function RootLayout() {
  useEffect(() => {
    const init = async () => {
      await initializeApp();
    };
    init();
  }, []);
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <ImageGenerationProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
        </Stack>
      </ImageGenerationProvider>
    </SafeAreaProvider>
  );
}
