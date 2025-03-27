import { Stack } from "expo-router";
import "@/global.css";
import { ImageGenerationProvider } from "@/providers/ImageGenerationProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ImageGenerationProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </ImageGenerationProvider>
    </SafeAreaProvider>
  );
}
