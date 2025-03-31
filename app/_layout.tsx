import { Stack } from "expo-router";
import "@/global.css";
import { ImageGenerationProvider } from "@/providers/ImageGenerationProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { initHistoryDatabase } from "@/service/database/historyDatabase";
import { useEffect, useState } from "react";
import { HistoryDatabaseProvider } from "@/providers/HistoryDatabaseProvider";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SplashScreen from "expo-splash-screen";


// TODO : Integrate RevenueCat for credit management and tracking
// TODO : Add image preview modal with zooming, swiping and pan to dismiss functionality

/// Disable the splash screen auto hide
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isAppReady, setIsAppReady] = useState(false);

  const initializeApp = async () => {
    await initHistoryDatabase();
    setTimeout(() => {
      setIsAppReady(true);
    }, 2000);
  };

  useEffect(() => {
    if (isAppReady) {
      SplashScreen.hideAsync();
    }
  }, [isAppReady]);

  useEffect(() => {
    const init = async () => {
      await initializeApp();
    };
    init();
  }, []);

  if (!isAppReady) {
    return null;
  }

  return (
    <ThemeProvider value={DarkTheme}>
      <GestureHandlerRootView className="flex-1">
        <SafeAreaProvider>
          <StatusBar style="auto" />
          <HistoryDatabaseProvider>
            <ImageGenerationProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
              </Stack>
            </ImageGenerationProvider>
          </HistoryDatabaseProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
