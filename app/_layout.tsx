import { Stack } from "expo-router";
import "@/global.css";
import { ImageGenerationProvider } from "@/providers/ImageGenerationProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { initHistoryDatabase } from "@/service/database/historyDatabase";
import { useEffect } from "react";
import { HistoryDatabaseProvider } from "@/providers/HistoryDatabaseProvider";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";

// TODO : Add a splash screen
// TODO : Integrate RevenueCat for credit management and tracking
// TODO : Add image preview modal with zooming, swiping and pan to dismiss functionality

export default function RootLayout() {
  const initializeApp = async () => {
    await initHistoryDatabase();
  };

  useEffect(() => {
    const init = async () => {
      await initializeApp();
    };
    init();
  }, []);
  return (
    <ThemeProvider value={DarkTheme}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <HistoryDatabaseProvider>
          <ImageGenerationProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
            </Stack>
          </ImageGenerationProvider>
        </HistoryDatabaseProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
