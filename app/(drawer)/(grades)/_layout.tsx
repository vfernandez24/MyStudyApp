import { Stack } from "expo-router";
import React from "react";

const _layout = () => {
  return (
    <Stack
      screenOptions={{
        gestureEnabled: true,
        presentation: "card",
        headerShown: false,
        animation: "slide_from_left",
      }}
    >
      <Stack.Screen name="grades" options={{}}></Stack.Screen>
    </Stack>
  );
};

export default _layout;
