import ChevronRight from "@/assets/icons/chevron-right-solid.svg";
import colors from "@/constants/colors";
import { teacher } from "@/constants/types";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Teacher = ({
  t,
  pressFunction,
}: {
  t: teacher;
  pressFunction: () => void;
}) => {
  const [idColor, setIdColor] = useState(0);
  let maxNum = 24,
    minNum = 0;

  useEffect(() => {
    let color = Math.floor(Math.random() * (maxNum - minNum + 1) + minNum);
    setIdColor(color);
  }, []);

  return (
    <TouchableOpacity onPress={pressFunction} style={styles.container}>
      <View style={styles.iconDiv}>
        <View style={[styles.bgDiv, { backgroundColor: colors[idColor].hex }]}>
          <Text style={{
            fontFamily: "InstrumentSans-Medium",
            fontWeight: 900,
            fontSize: 25,
            color: colors[idColor].text
          }}>
            {t.name.split("")[0]}
          </Text>
        </View>
      </View>
      <View style={styles.textDiv}>
        <View style={styles.tDiv}>
          <Text style={styles.text1}>{t.name}</Text>
        </View>
        <View style={styles.tDiv}>
          <Text style={styles.text2}>{t.surnames}</Text>
        </View>
      </View>
      <View style={styles.arrowDiv}>
        <ChevronRight height={25} width={25} fill="#d3d3d3" />
      </View>
    </TouchableOpacity>
  );
};

export default Teacher;

const styles = StyleSheet.create({
  container: {
    height: 70,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    overflow: "visible",
    alignItems: "center",
    padding: 10,
    zIndex: 5,
  },
  iconDiv: {
    width: "20%",
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  bgDiv: {
    width: 55,
    height: 55,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
  textDiv: {
    width: "80%",
    height: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingLeft: 10,
  },
  tDiv: {
    height: "45%",
    overflow: "visible",
  },
  text1: {
    fontSize: 24,
    lineHeight: 28,
    color: "#0b0279",
    overflow: "visible",
    fontFamily: "InstrumentSans-Bold",
  },
  text2: {
    fontSize: 20,
    overflow: "visible",
    fontFamily: "InstrumentSans-Medium",
    color: "#afafaf",
    textAlign: "right",
  },
  arrowDiv: {
    position: "absolute",
    top: "50%",
    right: 15,
    alignItems: "center",
    justifyContent: "center",
  },
});
