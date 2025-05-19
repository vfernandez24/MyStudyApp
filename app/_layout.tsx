import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

const _layout = () => {
  const [fontsLoaded] = useFonts({
      "InstrumentSans-Regular": require("../assets/fonts/InstrumentSans-Regular.ttf"),
      "InstrumentSans-Medium": require("../assets/fonts/InstrumentSans-Medium.ttf"),
      "InstrumentSans-Bold": require("../assets/fonts/InstrumentSans-Bold.ttf"),
    });
  
    if (!fontsLoaded) return null;
  return (
    <Stack
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="(drawer)"
        options={{animation: "fade", animationDuration: 100}}
      />
      <Stack.Screen
        name="(modal)"
        options={{ animation: "fade_from_bottom" }}
      />
    </Stack>
  );
};

export default _layout;

const styles = StyleSheet.create({});
