import { Stack } from "expo-router";
import "@/global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { initHistoryDatabase } from "@/service/database/historyDatabase";
import { useEffect, useState } from "react";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SplashScreen from "expo-splash-screen";
import { initRevenueCat } from "@/service/RevenueCat";
import { useSupabase } from "@/stores/useSupabase";
import CustomPaywall from "@/components/Paywall";

/// Disable the splash screen auto hide
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { checkUser } = useSupabase();
  const [isAppReady, setIsAppReady] = useState(false);

  const initializeApp = async () => {
    await initHistoryDatabase();
    await checkUser();
    await initRevenueCat();
  };

  useEffect(() => {
    if (isAppReady) {
      SplashScreen.hideAsync();
    }
  }, [isAppReady]);

  useEffect(() => {
    const init = async () => {
      await initializeApp();
      setIsAppReady(true);
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
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
          </Stack>
          <CustomPaywall />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
