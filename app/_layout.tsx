import { resetNotificationsFromStorage } from "@/scripts/notifications";
import * as Device from "expo-device";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const _layout = () => {
  const [fontsLoaded] = useFonts({
    "InstrumentSans-Regular": require("../assets/fonts/InstrumentSans-Regular.ttf"),
    "InstrumentSans-Medium": require("../assets/fonts/InstrumentSans-Medium.ttf"),
    "InstrumentSans-SemiBold": require("../assets/fonts/InstrumentSans-SemiBold.ttf"),
    "InstrumentSans-Bold": require("../assets/fonts/InstrumentSans-Bold.ttf"),
    "Inter-Italic": require("@/assets/fonts/Inter-Italic-VariableFont_opsz,wght.ttf"),
    Inter: require("@/assets/fonts/Inter-VariableFont_opsz,wght.ttf"),
    "SpaceMono-Regular": require("@/assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined
  );

  useEffect(() => {
    resetNotificationsFromStorage();

    async function registerNotifications() {
      if (Device.isDevice) {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== "granted") {
          alert("No se concedieron permisos para notificaciones 😢");
        }
      }
    }
    registerNotifications();
  }, []); 

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
