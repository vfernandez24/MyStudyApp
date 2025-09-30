import PageTitle from "@/components/common/PageTitle";
import React, { useState } from "react";
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

const screenHeight = Dimensions.get("window").height;
const scrollHeight = screenHeight - 80;

const calendar = () => {
  const today = new Date();
  function daysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
  }
  const daysInThisMonth = daysInMonth(today.getFullYear(), today.getMonth());

  const [selected, setSelected] = useState<Date>(today);

  const [overlay, setOverlay] = useState<boolean>(false);
  const [alert, setAlert] = useState<boolean>(false);

  return (
    <>
      <TouchableOpacity
        onPress={alert == true ? () => { } : () => setOverlay(false)}
        style={[
          styles.overlayBg,
          { display: overlay == true ? "flex" : "none" },
        ]}
      ></TouchableOpacity>
      <ScrollView>
        <PageTitle title="CALENDARIO" />
        <View></View>
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
})

export default calendar;
