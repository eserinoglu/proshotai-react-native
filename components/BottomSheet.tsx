import { Keyboard } from "react-native";
import Animated, { useAnimatedKeyboard, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function BottomSheet({
  isVisible,
  setIsVisible,
  height,
  children,
}: {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  height: number;
  children: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();
  const sheetHeight = height + insets.bottom;
  // Animated keyboard handling
  const keyboard = useAnimatedKeyboard();
  const containerStyle = useAnimatedStyle(() => {
    return {
      pointerEvents: isVisible ? "auto" : "none",
      zIndex: 5,
      backgroundColor: withTiming(isVisible ? "rgba(0, 0, 0, 0.5)" : "transparent"),
    };
  });
  const sheetStyle = useAnimatedStyle(() => {
    return {
      width: "100%",
      transform: [{ translateY: withTiming(isVisible ? 0 : sheetHeight) }],
      height: sheetHeight + keyboard.height.value,
      paddingBottom: insets.bottom,
      zIndex: 100,
    };
  });
  return (
    <Animated.View
      onTouchStart={(e) => e.target === e.currentTarget && Keyboard.dismiss()}
      style={[containerStyle]}
      className="absolute top-0 right-0 left-0 bottom-0 flex items-center justify-end"
    >
      <Animated.View style={[sheetStyle]} className="bg-neutral-800 rounded-t-xl">
        {children}
      </Animated.View>
    </Animated.View>
  );
}
