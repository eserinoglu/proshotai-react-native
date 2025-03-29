import { Stack } from "expo-router";
import "@/global.css";
import { ImageGenerationProvider } from "@/providers/ImageGenerationProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { initHistoryDatabase } from "@/service/database/historyDatabase";
import { useEffect } from "react";
import { HistoryDatabaseProvider } from "@/providers/HistoryDatabaseProvider";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";

export default function RootLayout() {
  const initializeApp = async () => {
    initHistoryDatabase();
  };

  useEffect(() => {
    const init = async () => {
      await initializeApp();
    };
    init();
  }, []);
  return (
    <SafeAreaProvider>
      <ThemeProvider value={DarkTheme}>
        <StatusBar style="light" />
        <ImageGenerationProvider>
          <HistoryDatabaseProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
            </Stack>
          </HistoryDatabaseProvider>
        </ImageGenerationProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
