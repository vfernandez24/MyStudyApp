// import months from "@/constants/months";
import ChevronRight from "@/assets/icons/ellipsis-vertical-solid.svg";
import colors from "@/constants/colors";
import months from "@/constants/months";
import { subject, task } from "@/constants/types";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  task: task;
  subjects: subject[];
  pressFunction: () => void;
};

const Task = ({ subjects, task, pressFunction }: Props) => {
  const [subject, setSubject] = useState<subject | undefined>(subjects[0]);
  useEffect(() => {
    const subjectU = subjects.find((s) => s.id === task.subject) ?? undefined;
    setSubject(subjectU);
  }, [subjects, task]);

  return (
    <TouchableOpacity onPress={pressFunction} style={styles.container}>
      <View style={styles.iconDiv}>
        <View
          style={[
            styles.bgDiv,
            {
              backgroundColor:
                task.subject === "personal" || subject === undefined
                  ? colors[9].hex
                  : colors[subject.color].hex,
            },
          ]}
        >
          <Text
            style={[
              styles.iconText2,
              {
                color:
                  task.subject === "personal" || subject === undefined
                    ? colors[9].text
                    : colors[subject.color].text,
              },
            ]}
          >
            {task.finishedDate
              ? months[task.finishedDate.getMonth()].litle
              : ""}
          </Text>
          <Text
            style={[
              styles.iconText,
              {
                color:
                  task.subject === "personal" || subject === undefined
                    ? colors[9].text
                    : colors[subject.color].text,
              },
            ]}
          >
            {task.finishedDate?.getDate()}
          </Text>
        </View>
      </View>
      <View style={styles.textDiv}>
        <View style={styles.tDiv}>
          <Text style={styles.text1} numberOfLines={1} ellipsizeMode="tail">
            {task.name}
          </Text>
        </View>
        <View style={styles.tDiv}>
          <Text style={styles.text2}>
            {task.subject === "personal" || subject === undefined
              ? "Personal"
              : subject.name}
          </Text>
        </View>
      </View>
      <View style={styles.arrowDiv}>
        <ChevronRight height={25} width={25} fill="#6C98F7" />
      </View>
    </TouchableOpacity>
  );
};

export default Task;

const styles = StyleSheet.create({
  container: {
    height: 70,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    overflow: "visible",
    alignItems: "center",
    padding: 10,
    zIndex: 5,
  },
  iconDiv: {
    width: "20%",
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: { fontFamily: "InstrumentSans-Bold", fontSize: 22.5 },
  iconText2: { fontFamily: "InstrumentSans-Medium", fontSize: 18 },
  bgDiv: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
  textDiv: {
    width: "80%",
    height: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingLeft: 10,
    overflow: "visible",
  },
  tDiv: {
    marginBottom: 4,
    overflow: "visible",
    width: "90%",
  },
  text1: {
    fontSize: 24,
    lineHeight: 32,
    color: "#0b0279",
    overflow: "visible",
    fontFamily: "InstrumentSans-Bold",
  },
  text2: {
    fontSize: 20,
    overflow: "visible",
    fontFamily: "InstrumentSans-Medium",
    color: "#afafaf",
  },
  arrowDiv: {
    position: "absolute",
    top: "50%",
    right: 15,
    alignItems: "center",
    justifyContent: "center",
  },
});
