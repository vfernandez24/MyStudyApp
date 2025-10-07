import colors from "@/constants/colors";
import { calendarElement as styles } from "@/constants/styles";
import { event } from "@/constants/types";
import React from "react";
import { Dimensions, Text, View } from "react-native";

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
      return { width: dayWidth * 0.95, marginLeft: 0, marginRight: dayWidth * 0.05, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 };
    } else if (isFinishTimeAfterDate) {
      return { width: dayWidth * 0.95, marginLeft: dayWidth * 0.05, marginRight: 0, borderTopRightRadius: 0, borderBottomRightRadius: 0, };
    }
    return { width: dayWidth * 0.9, marginLeft: dayWidth * 0.05, marginRight: dayWidth * 0.05, borderTopRightRadius: 0, borderBottomRightRadius: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 };
  };
  let { width, marginLeft, marginRight, borderBottomLeftRadius, borderBottomRightRadius, borderTopLeftRadius, borderTopRightRadius } = getWidthAndMargin();

  const getDaysOfEvent = () => {
    let numberDays: number = 0;
    const sTime = e.startTime;
    const fTime = e.finishedTime;
    return numberDays
  }
  const numberDays = getDaysOfEvent();

  return (
    <View style={[styles.container, { backgroundColor: bg, width, marginLeft, marginRight, borderBottomLeftRadius, borderBottomRightRadius, borderTopLeftRadius, borderTopRightRadius }, {
      position: "relative"
    }]}>
      <Text
        style={[
          styles.time,
          {
            display: !e.allDay ? "flex" : "none",
          },
        ]}
      >
        {`${e.startTime?.getHours().toString().padStart(2, "0")} : ${e.startTime?.getMinutes().toString().padStart(2, "0")}`}
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
