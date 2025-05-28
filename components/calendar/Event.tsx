import colors from "@/constants/colors";
import { event } from "@/constants/types";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  e: event;
}

export default function Event({ e }: Props) {
  const event = e;
  const bg = colors[e.color].hex;

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <Text
        style={[
          styles.time,
          {
            display: e.startTime ? "flex" : "none",
          },
        ]}
      >
        {e.startTime}
      </Text>
      <Text
        style={[
          styles.name,
          {
            width: e.startTime ? "70%" : "100%",
          },
        ]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {e.name}
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
    lineHeight: 35,
    justifyContent: "center",
    wordWrap: "nowrap",
    overflow: "hidden",
    flexWrap: "nowrap",
    width: "28%",
    fontFamily: "InstrumentSans-SemiBold",
  },
  name: {
    fontSize: 15,
    justifyContent: "center",
    wordWrap: "nowrap",
    overflow: "hidden",
    flexWrap: "nowrap",
  },
});
