import colors from "@/constants/colors";
import { exam, subject } from "@/constants/types";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Exam = ({ e, subjects }: { e: exam; subjects: subject[] }) => {
  const subject = subjects.find((s) => s.id === e.subject) ?? subjects[0];
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors[subject?.color].hex },
      ]}
    >
      {/* Time? */}
      <Text
        style={[
          styles.timeText,
          {
            display: e.startTime ? "flex" : "none",
            color: colors[subject?.color].text,
          },
        ]}
      >{`${e.startTime?.getHours()} : ${e.startTime?.getMinutes()}`}</Text>

      {/* Name */}
      <Text
        style={[
          styles.nameText,
          {
            width: e.startTime ? "70%" : "100%",
            color: colors[subject?.color].text,
          },
        ]}
      >
        {e.name}
      </Text>
    </View>
  );
};

export default Exam;

const styles = StyleSheet.create({
  container: {},
  time: {},
  timeText: {},
  name: {},
  nameText: {},
});
