import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
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
  const containerStyle = useAnimatedStyle(() => {
    return {
      pointerEvents: isVisible ? "auto" : "none",
    };
  });
  const sheetStyle = useAnimatedStyle(() => {
    return {
      width: "100%",
      transform: [{ translateY: withTiming(isVisible ? 0 : sheetHeight) }],
      height: sheetHeight,
      paddingBottom: insets.bottom,
    };
  });
  return (
    <Animated.View
      style={[containerStyle]}
      className="absolute z-20 top-0 right-0 left-0 bottom-0 flex items-end justify-end w-full h-full"
    >
      <Animated.View style={[sheetStyle]} className="bg-neutral-900 rounded-t-xl flex flex-col">
        {children}
      </Animated.View>
    </Animated.View>
  );
}
