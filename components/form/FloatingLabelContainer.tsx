import { FORM_ANIMATION_DURATION } from "@/constants/animation";
import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";

type Props = {
  label: string;
  hasValue: boolean;
  collapsedHeight: number;
  expandedHeight: number;
  labelStyle: any;
  containerStyle: any;
  children: React.ReactNode;
};

export default function FloatingLabelContainer({
  label,
  hasValue,
  collapsedHeight,
  expandedHeight,
  labelStyle,
  containerStyle,
  children,
}: Props) {
  const progress = useRef(new Animated.Value(hasValue ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: hasValue ? 1 : 0,
      duration: FORM_ANIMATION_DURATION,
      useNativeDriver: false,
    }).start();
  }, [hasValue]);

  // altura del container
  const height = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [collapsedHeight, expandedHeight],
  });

  // desplazamiento del input
  const inputTop = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, expandedHeight - collapsedHeight],
  });

  // aparición suave del label
  const labelOpacity = progress;

  return (
    <Animated.View
      style={[
        containerStyle,
        { height, position: "relative", overflow: "hidden" },
      ]}
    >
      {/* LABEL (SIEMPRE FIJO) */}
      <Animated.Text
        style={[
          labelStyle,
          {
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1,
            opacity: labelOpacity,
          },
        ]}
      >
        {label}
      </Animated.Text>

      {/* INPUT + ICONO */}
      <Animated.View
        style={{
          position: "absolute",
          top: inputTop,
          left: 0,
          right: 0,
          zIndex: 2,
        }}
      >
        {children}
      </Animated.View>
    </Animated.View>
  );
}
