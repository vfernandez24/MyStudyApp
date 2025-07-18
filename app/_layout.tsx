import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const _layout = () => {
  const [fontsLoaded] = useFonts({
    "InstrumentSans-Regular": require("../assets/fonts/InstrumentSans-Regular.ttf"),
    "InstrumentSans-Medium": require("../assets/fonts/InstrumentSans-Medium.ttf"),
    "InstrumentSans-SemiBold": require("../assets/fonts/InstrumentSans-SemiBold.ttf"),
    "InstrumentSans-Bold": require("../assets/fonts/InstrumentSans-Bold.ttf"),
    "Inter-Italic": require("@/assets/fonts/Inter-Italic-VariableFont_opsz,wght.ttf"),
    "Inter": require("@/assets/fonts/Inter-VariableFont_opsz,wght.ttf"),
    "SpaceMono-Regular": require("@/assets/fonts/SpaceMono-Regular.ttf")
  });

  if (!fontsLoaded) return null;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="(drawer)"
          options={{ animation: "fade", animationDuration: 100 }}
        />
        <Stack.Screen
          name="(modal)"
          options={{ animation: "fade_from_bottom" }}
        />
      </Stack>
    </SafeAreaView>
  );
};

export default _layout;

const styles = StyleSheet.create({});
