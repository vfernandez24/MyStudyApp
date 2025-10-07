import InProcess from "@/assets/icons/circle-half-stroke-solid-full.svg";
import Pending from "@/assets/icons/circle-regular-full.svg";
import Completed from "@/assets/icons/circle-solid-full.svg";
import colors from "@/constants/colors";
import { calendarElement as styles } from "@/constants/styles";
import { subject, task } from "@/constants/types";
import React from "react";
import { Dimensions, Text, View } from "react-native";

const Task = ({ t, subjects }: { t: task; subjects: subject[] }) => {
  const subject = subjects.find((s) => s.id === t.subject) ?? subjects[0];
  const screenWidth = Dimensions.get("window").width;
  const dayWidth = (screenWidth / 7) * 0.9;
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors[subject?.color].hex, width: dayWidth },
      ]}
    >
      <View
        style={{
          width: 11,
          justifyContent: "center",
          alignItems: "center",
          height: 15,
        }}
      >
        {(() => {
          switch (t.status) {
            case "pending":
              return <Pending height={11} width={11} fill={colors[subject.color].text} />;
            case "inProgress":
              return <InProcess height={11} width={11} fill={colors[subject.color].text} />;
            case "completed":
              return <Completed height={11} width={11} fill={colors[subject.color].text} />;
          }
        })()}
      </View>
      {/* Name */}
      <Text
        style={[
          styles.name,
          {
            color: colors[subject?.color].text,
          },
        ]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {t.name}
      </Text>
    </View>
  );
};

export default Task;
