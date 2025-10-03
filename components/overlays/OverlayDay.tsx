import { event, exam, task } from "@/constants/types";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";

type Props = {
  overlay: boolean;
  selected: string;
  array: (task | exam | event)[];
};

const screenHeight = Dimensions.get("window").height;
const scrollHeight = screenHeight - 80;

const OverlayDay = ({ overlay, selected, array }: Props) => {
  const bottomAnim = useRef(new Animated.Value(-500)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(bottomAnim, {
        toValue: overlay ? 0 : -500,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  }, [overlay]);

  return (
    <Animated.View style={[styles.overlay, { bottom: bottomAnim }]}>
      <View>
        <Text>OverlayDay</Text>
      </View>
    </Animated.View>
  );
};

export default OverlayDay;

const styles = StyleSheet.create({
  overlayBg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: scrollHeight,
    backgroundColor: "#0000003d",
    zIndex: 20,
  },
  overlay: {
    position: "absolute",
    transitionProperty: "bottom",
    transitionDuration: "0.8s",
    left: 0,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    gap: 0,
    height: 500,
    width: "100%",
    zIndex: 21,
    borderTopEndRadius: 40,
    borderTopStartRadius: 40,
  },
  overlayContainer: {
    height: 400,
    width: "100%",
    gap: 10,
  },
  overlayDataContainer: {
    height: 50,
    flexDirection: "row",
  },
  overlayDataIconDiv: {
    width: "30%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  overlayDataIconImg: {
    height: 35,
    objectFit: "contain",
  },
  overlayDataTextDiv: {
    width: "70%",
    height: 50,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  overlayDataText: {
    fontFamily: "InstrumentSans-Medium",
    fontSize: 21,
    color: "#555",
  },
  overlayButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 30,
    paddingHorizontal: 30,
  },
  overlayButton: {
    height: 50,
    width: "50%",
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  overlayButtonIconDiv: {
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  overlayButtonTextDiv: {},
  overlayButtonText: {
    fontFamily: "InstrumentSans-SemiBold",
    fontSize: 17,
    letterSpacing: 1,
    width: "auto",
  },
});
