import colors from "@/constants/colors";
import { event } from "@/constants/types";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Event({ e, date }: { e: event; date: Date }) {
  const bg = colors[e.color].hex;
  const getWidthAndMargin = () => {
    const isStartTimeBeforeDate = e.startTime < date;
    const isFinishTimeAfterDate = e.finishedTime > date;

    if (e.startTime.toDateString() !== e.finishedTime.toDateString()) {
      if (isStartTimeBeforeDate && isFinishTimeAfterDate) {
        return { width: "100%", margin: "none" };
      } else if (isStartTimeBeforeDate) {
        return { width: "85%", margin: "right" };
      } else if (isFinishTimeAfterDate) {
        return { width: "85%", margin: "left" };
      }
    }
    return { width: "75%", margin: "both" };
  };
  let { width, margin } = getWidthAndMargin();

  return (
    <View style={[styles.container, { backgroundColor: bg, width: width }]}>
      <Text
        style={[
          styles.time,
          {
            display: e.startTime ? "flex" : "none",
          },
        ]}
      >
        {`${e.startTime?.getHours()} : ${e.startTime?.getMinutes()}`}
      </Text>
      <Text
        style={[
          styles.name,
          {
            width: e.allDay ? "70%" : "100%",
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
