import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useError } from "@/stores/useError";

export default function ErrorModal() {
  const { errorMessage, setErrorMessage, onRetry } = useError();
  const visible = errorMessage !== null;

  // Close the modal
  const closeModal = () => {
    setErrorMessage(null);
  };
  // Handle retry
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    }
    closeModal();
  };
  const containerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(visible ? "rgba(0, 0, 0, 0.5)" : "transparent"),
      pointerEvents: visible ? "auto" : "none",
      width: "100%",
      height: "100%",
      position: "absolute",
      top: 0,
      left: 0,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 20,
    };
  });

  const messageStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withTiming(visible ? 1 : 0.5) }],
      opacity: withTiming(visible ? 1 : 0),
    };
  });

  return (
    <Animated.View style={[containerStyle]}>
      <Animated.View style={[messageStyle]} className="p-5 rounded-2xl bg-secondaryBg flex flex-col gap-2 w-3/4">
        <Text className="text-white text-[22px] font-semibold">Error</Text>
        <Text className="text-[14px] text-secondaryText leading-normal">{errorMessage}</Text>
        <View className="w-full flex flex-row items-center gap-2 mt-5">
          {onRetry && (
            <TouchableOpacity
              onPress={handleRetry}
              className="flex-1 h-[40px] flex items-center justify-center rounded-xl bg-tint"
            >
              <Text className="text-white text-[14px] font-semibold">Retry</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={closeModal} className="flex-1 h-[40px] flex items-center justify-center">
            <Text className="text-secondaryText text-[14px]">Close</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
}
