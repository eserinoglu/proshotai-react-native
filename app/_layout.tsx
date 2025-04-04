import { Stack } from "expo-router";
import "@/global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { initHistoryDatabase } from "@/service/database/historyDatabase";
import { useEffect, useState } from "react";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SplashScreen from "expo-splash-screen";
import CustomPaywall from "@/components/Paywall";
import { useRevenueCat } from "@/stores/useRevenueCat";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import ErrorModal from "@/components/ErrorModal";
import { useUser } from "@/stores/useUser";

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
  const { initRevenueCat, getOfferings } = useRevenueCat();
  const { checkUser } = useUser();
  const [isAppReady, setIsAppReady] = useState(false);

  const [initError, setInitError] = useState<string | null>(null);

  const initializeApp = async () => {
    setInitError(null);
    setIsAppReady(false);
    try {
      await initHistoryDatabase();
      await checkUser();
      await initRevenueCat();
      await getOfferings();
    } catch (error) {
      if (error instanceof Error) {
        setInitError(error.message);
      } else {
        setInitError("An unknown error occurred");
      }
    } finally {
      setIsAppReady(true);
    }
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

  if (initError) {
    return (
      <View className="flex-1 bg-background flex items-center justify-center flex-col">
        <Text className="text-white text-[16px] font-semibold">{initError}</Text>
        <TouchableOpacity onPress={initializeApp} className="bg-tint px-4 py-2 rounded-xl mt-6">
          <Text className="text-[16px] text-white">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ThemeProvider value={DarkTheme}>
      <GestureHandlerRootView className="flex-1">
        <StatusBar style="light" />
        <SafeAreaProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
          </Stack>
          <ErrorModal />
          <CustomPaywall />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
