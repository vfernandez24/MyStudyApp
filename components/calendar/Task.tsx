import colors from "@/constants/colors";
import { subject, task } from "@/constants/types";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Task = ({ t, subjects }: { t: task; subjects: subject[] }) => {
  const subject = subjects.find((s) => s.id === t.subject) ?? subjects[0];
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors[subject?.color].hex },
      ]}
    >
      {/* Name */}
      <Text
        style={[
          styles.nameText,
          {
            color: colors[subject?.color].text,
          },
        ]}
      >
        {t.name}
      </Text>
    </View>
  );
};

export default Task;

const styles = StyleSheet.create({
  container: {},
  time: {},
  timeText: {
    width: "100%",
  },
  name: {},
  nameText: {},
});
