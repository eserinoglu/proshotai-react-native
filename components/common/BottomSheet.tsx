import { Keyboard } from "react-native";
import Animated, { KeyboardState, useAnimatedKeyboard, useAnimatedStyle, withTiming } from "react-native-reanimated";
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
      backgroundColor: withTiming(keyboard.state.get() === KeyboardState.OPEN ? "rgba(0, 0, 0, 0.3)" : "transparent", {
        duration: 150,
      }),
    };
  });
  const sheetStyle = useAnimatedStyle(() => {
    return {
      width: "100%",
      transform: [{ translateY: withTiming(isVisible ? 0 : sheetHeight) }],
      height: sheetHeight - -keyboard.height.value,
      paddingBottom: insets.bottom,
    };
  });
  return (
    <Animated.View
      onTouchStart={(e) => e.target === e.currentTarget && Keyboard.dismiss()}
      style={[containerStyle]}
      className="absolute top-0 right-0 left-0 bottom-0 flex items-end justify-end w-full h-full z-10"
    >
      <Animated.View style={[sheetStyle]} className="bg-neutral-800 rounded-t-xl flex flex-col z-20">
        {children}
      </Animated.View>
    </Animated.View>
  );
}
