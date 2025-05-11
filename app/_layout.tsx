import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

const _layout = () => {
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
