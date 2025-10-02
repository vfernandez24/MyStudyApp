import colors from "@/constants/colors";
import { event } from "@/constants/types";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

export default function Event({ e, date }: { e: event; date: Date }) {
  const bg = colors[e.color].hex;
  const getWidthAndMargin = () => {
    const isStartTimeBeforeDate = e.startTime < date;
    const isFinishTimeAfterDate = e.finishedTime > date;
    const screenWidth = Dimensions.get("window").width;
    const dayWidth = screenWidth / 7;

    if (isStartTimeBeforeDate && isFinishTimeAfterDate) {
      return { width: dayWidth, marginLeft: 0, marginRight: 0 };
    } else if (isStartTimeBeforeDate) {
      return { width: dayWidth * 0.85, marginLeft: 0, marginRight: 5 };
    } else if (isFinishTimeAfterDate) {
      return { width: dayWidth * 0.85, marginLeft: 5, marginRight: 0 };
    }
    return { width: dayWidth * 0.7, marginLeft: 5, marginRight: 5 };
  };
  let { width, marginLeft, marginRight } = getWidthAndMargin();

  return (
    <View style={[styles.container, { backgroundColor: bg, width, marginLeft, marginRight }]}>
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
