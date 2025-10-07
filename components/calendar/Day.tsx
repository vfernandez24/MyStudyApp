import { event, exam, subject, task } from "@/constants/types";
import React, { useMemo } from "react";
import {
  ColorValue,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Event from "./Event";
import Exam from "./Exam";
import Task from "./Task";

const screenWidth = Dimensions.get("window").width;
const scrollHeight = Dimensions.get("window").height - 80;

type Props = {
  events: event[];
  exams: exam[];
  tasks: task[];
  date: Date;
  month: number[];
  sunday: boolean;
  isSelected: boolean;
  pressFunction: () => void;
  subjects: subject[];
};

const Day = ({
  date,
  events,
  exams,
  tasks,
  month,
  sunday,
  isSelected,
  pressFunction,
  subjects,
}: Props) => {
  const dayArray = useMemo(() => {
    const filteredEvents = events.filter((e) => e.date.toDateString() === date.toDateString());
    const filteredExams = exams.filter((e) => e.date.toDateString() === date.toDateString());
    const filteredTasks = tasks.filter((t) => t.finishedDate && t.finishedDate.toDateString() === date.toDateString());
    return { events: filteredEvents, exams: filteredExams, tasks: filteredTasks };
  }, [events, exams, tasks, date]);

  const inMonth: boolean = useMemo(() => {
    return (month[0] === date.getFullYear() && month[1] === date.getMonth())
  }, [month, date])

  const dayColor: ColorValue = useMemo(() => {
    if (isSelected) return "#6C98F7";
    else if (sunday) return "#446DC4";
    else if (inMonth) return "#222";
    return "#888";
  }, [isSelected, sunday, inMonth]);

  return (
    <TouchableOpacity onPress={pressFunction} style={[styles.container, { borderColor: isSelected ? "#446DC4" : "#ececec" }]}>
      {/* Day Number */}
      <View style={styles.day}>
        <Text style={[styles.dayText, { color: dayColor }]}>
          {date.getDate()}
        </Text>
      </View>

      {/* Elements */}
      <View style={styles.eventsContainer}>
        {dayArray.events.map((e) => (
          <Event key={e.id} e={e} date={date} />
        ))}

        {dayArray.exams.map((e) => (
          <Exam key={e.id} e={e} subjects={subjects} />
        ))}

        {dayArray.tasks.map((t) => (
          <Task t={t} key={t.id} subjects={subjects} />
        ))}
      </View>
    </TouchableOpacity>
  );
};

export default Day;

const styles = StyleSheet.create({
  container: {
    width: screenWidth / 7,
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#ececec"
  },
  day: {
    width: "100%",
    paddingHorizontal: 5
  },
  dayText: {},
  eventsContainer: {
    gap: 2
  },
});
