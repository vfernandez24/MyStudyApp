import { event, exam, subject, task } from "@/constants/types";
import React, { useEffect, useMemo, useState } from "react";
import {
  ColorValue,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Event from "./Event";
import Exam from "./Exam";
import Task from "./Task";

type Props = {
  events: event[];
  exams: exam[];
  tasks: task[];
  date: Date;
  inMonth: boolean;
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
  inMonth,
  sunday,
  isSelected,
  pressFunction,
  subjects,
}: Props) => {
  const [dayArray, setDayArray] = useState<{
    events: event[];
    exams: exam[];
    tasks: task[];
  }>({
    events: [],
    exams: [],
    tasks: [],
  });

  useEffect(() => {
    function filterData() {
      const filteredEvents: event[] = events.filter(
        (e) =>
          new Date(
            e.date.getFullYear(),
            e.date.getMonth(),
            e.date.getDate()
          ) === new Date(date)
      );

      const filteredExams: exam[] = exams.filter(
        (e) =>
          new Date(
            e.date.getFullYear(),
            e.date.getMonth(),
            e.date.getDate()
          ) === new Date(date)
      );

      const filteredTasks: task[] = tasks.filter(
        (t) =>
          t.finishedDate &&
          new Date(
            t.finishedDate.getFullYear(),
            t.finishedDate.getMonth(),
            t.finishedDate.getDate()
          ) === new Date(date)
      );

      const newArray = {
        events: filteredEvents,
        exams: filteredExams,
        tasks: filteredTasks,
      };
      setDayArray(newArray);
    }
    filterData();
  }, []);

  const dayColor: ColorValue = useMemo(() => {
    if (isSelected) return "#6C98F7";
    else if (sunday) return "#446DC4";
    else if (inMonth) return "#888";
    return "#222";
  }, []);

  return (
    <TouchableOpacity onPress={pressFunction} style={styles.container}>
      {/* Day Number */}
      <View style={styles.day}>
        <Text style={[styles.dayText, { color: dayColor }]}>
          {date.getDate()}
        </Text>
      </View>

      {/* Elements */}
      <View style={styles.eventsContainer}>
        {dayArray.events.map((e) => (
          <Event e={e} date={date} />
        ))}

        {dayArray.exams.map((e) => (
          <Exam e={e} subjects={subjects} />
        ))}

        {dayArray.tasks.map((e) => (
          <Task />
        ))}
      </View>
    </TouchableOpacity>
  );
};

export default Day;

const styles = StyleSheet.create({
  container: {},
  day: {},
  dayText: {},
  eventsContainer: {},
});
