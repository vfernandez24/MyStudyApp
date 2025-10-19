import colors from "@/constants/colors";
import { calendarElement as styles } from "@/constants/styles";
import { event } from "@/constants/types";
import React from "react";
import { Dimensions, Text, View } from "react-native";

type Props = {
  e: event;
  date: Date;
  numberDays?: number;
  isPlaceholder?: boolean;
  segmentStartsAfterEventStart?: boolean; 
  segmentEndsBeforeEventEnd?: boolean;
};

export default function Event({
  e,
  date,
  numberDays = 1,
  isPlaceholder = false,
  segmentStartsAfterEventStart = false,
  segmentEndsBeforeEventEnd = false,
}: Props) {
  const bg = colors[e.color].hex;

  const screenWidth = Dimensions.get("window").width;
  const dayWidth = screenWidth / 7 - 1;

  const width = dayWidth * numberDays;

  if (isPlaceholder) {
    return (
      <View style={[styles.container, {
        backgroundColor: "transparent",
        width,
        marginLeft: 0,
        marginRight: 0,
        opacity: 0,
      }]}>
      </View>
    );
  }

  return (
    <View style={[styles.container, {
      backgroundColor: bg,
      width,
      marginLeft: 0,
      marginRight: 0,
      position: "relative",
      zIndex: 30,
      borderRadius: 5
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
            width: !e.allDay ? "70%" : "100%",
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
