import Plus from "@/assets/icons/plus-solid.svg";
import PageTitle from "@/components/common/PageTitle";
import OverlayDay from "@/components/overlays/OverlayDay";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const screenHeight = Dimensions.get("window").height;
const scrollHeight = screenHeight - 80;

const calendar = () => {
  const today = new Date();

  function getWeeksInMonth(year: number, month: number): number {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const firstDayOfWeek = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const daysFromStart = firstDayOfWeek;
    const totalVisibleDays = daysFromStart + totalDays;

    return Math.ceil(totalVisibleDays / 7);
  }
  const weeks = getWeeksInMonth(today.getFullYear(), today.getMonth());

  function daysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
  }
  const days = daysInMonth(today.getFullYear(), today.getMonth());

  function getDaysArray(days: number) {
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayNumber = firstDay.getDay();
  }

  const [selected, setSelected] = useState<Date>(today);

  const [overlay, setOverlay] = useState<boolean>(false);
  const [alert, setAlert] = useState<boolean>(false);

  return (
    <>
      {/* Overlay */}
      <TouchableOpacity
        onPress={alert == true ? () => {} : () => setOverlay(false)}
        style={[
          styles.overlayBg,
          { display: overlay == true ? "flex" : "none" },
        ]}
      ></TouchableOpacity>

      <OverlayDay />

      <TouchableOpacity
        style={styles.addButton}
        onPress={async () => {
          await AsyncStorage.setItem("typeExam", "create");
          router.push("/(modal)/createEvent");
        }}
      >
        <Plus fill="#fff" height={30} width={30} />
      </TouchableOpacity>

      {/* Scroll */}
      <ScrollView>
        <PageTitle title="CALENDARIO" />
        <View>
          <View></View>
        </View>

        {/* MAIN */}
        <View>{}</View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: scrollHeight,
    padding: 15,
    paddingBottom: 200,
  },
  overlayBg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: scrollHeight,
    backgroundColor: "#0000003d",
    zIndex: 20,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    height: 60,
    width: 60,
    zIndex: 10,
    borderRadius: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0b0279",
  },
});

export default calendar;
