import Chevron from "@/assets/icons/chevron-down-solid.svg";
import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";

export default function RotatingChevron({ open }: { open: boolean }) {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: open ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [open]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <Animated.View style={{ transform: [{ rotate: rotation }] }}>
      <Chevron height={30} width={30} fill="rgba(108, 152, 247, 0.41)" />
    </Animated.View>
  );
}
