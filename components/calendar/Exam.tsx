import colors from "@/constants/colors";
import { calendarElement as styles } from "@/constants/styles";
import { exam, subject } from "@/constants/types";
import React from "react";
import { Dimensions, Text, View } from "react-native";

const Exam = ({ e, subjects }: { e: exam; subjects: subject[] }) => {
  const screenWidth = Dimensions.get("window").width;
  const dayWidth = (screenWidth / 7) - 1;
  const subject = subjects.find((s) => s.id === e.subject) ?? subjects[0];
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors[subject.color].hex, width: dayWidth, alignSelf: "center", },
      ]}
    >
      {/* Time? */}
      <Text
        style={[
          styles.time,
          {
            display: e.startTime ? "flex" : "none",
            color: colors[subject?.color].text,
          },
        ]}
      >{`${e.startTime?.getHours().toString().padStart(2, "0")} : ${e.startTime?.getMinutes().toString().padStart(2, "0")}`}</Text>

      {/* Name */}
      <Text
        style={[
          styles.name,
          {
            color: colors[subject?.color].text,
            flex: 1,
          },
        ]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {e.name}
      </Text>
    </View>
  );
};

export default Exam;
