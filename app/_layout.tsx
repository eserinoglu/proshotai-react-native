import { Stack } from "expo-router";
import "@/global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { initHistoryDatabase } from "@/service/database/historyDatabase";
import { useEffect, useState } from "react";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SplashScreen from "expo-splash-screen";
import { useSupabase } from "@/stores/useSupabase";
import CustomPaywall from "@/components/Paywall";
import { useRevenueCat } from "@/stores/useRevenueCat";
import { Text, TextInput } from "react-native";

// Disable font-scaling
(Text as any).defaultProps = {
  allowFontScaling: false,
};
(TextInput as any).defaultProps = {
  allowFontScaling: false,
};

/// Disable the splash screen auto hide
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { checkUser } = useSupabase();
  const { initRevenueCat, getOfferings } = useRevenueCat();
  const [isAppReady, setIsAppReady] = useState(false);

  const initializeApp = async () => {
    await initHistoryDatabase();
    await checkUser();
    await initRevenueCat();
    await getOfferings();
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
