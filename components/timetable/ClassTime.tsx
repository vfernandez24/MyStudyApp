import { colors } from "@/constants/colors";
import { classTime, subject } from "@/constants/types";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  e: classTime;
}

export default function ClassTime({ e }: Props) {
  const subjects: subject[] = [];
  const event = e;
  const bg = colors[subjects[e.subject].color].hex;

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <Text style={styles.time}>{e.startTime}</Text>
      <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
        {subjects[e.subject].name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 30,
    paddingHorizontal: 5,
    margin: 0,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
  },
  time: {
    fontSize: 15,
    justifyContent: "center",
    wordWrap: "nowrap",
    overflow: "hidden",
    flexWrap: "nowrap",
    width: "28%",
  },
  name: {
    fontSize: 15,
    justifyContent: "center",
    wordWrap: "nowrap",
    overflow: "hidden",
    flexWrap: "nowrap",
  },
});
