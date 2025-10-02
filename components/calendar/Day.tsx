import { event, exam, task } from "@/constants/types";
import React, { useEffect, useMemo, useState } from "react";
import { ColorValue, StyleSheet, Text, View } from "react-native";
import Event from "./Event";

type Props = {
  events: event[];
  exams: exam[];
  tasks: task[];
  date: Date;
  inMonth: boolean;
  sunday: boolean;
  isSelected: boolean;
};

const Day = ({
  date,
  events,
  exams,
  tasks,
  inMonth,
  sunday,
  isSelected,
}: Props) => {
  const [dayArray, setDayArray] = useState<(event[] | exam[] | task[])[]>([]);

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

      const newArray = [filteredEvents, filteredExams, filteredTasks];
      setDayArray(newArray);
    }
    filterData();
  }, []);

  const dayColor: ColorValue = useMemo(() => {
    if (isSelected) return "#6C98F7";
    else if (sunday) return "#446DC4";
    return "#000";
  }, []);

  return (
    <View style={styles.container}>
      {/* Day Number */}
      <View style={styles.day}>
        <Text style={[styles.dayText, { color: dayColor }]}>
          {date.getDate()}
        </Text>
      </View>

      {/* Elements */}
      <View style={styles.eventsContainer}>
        {dayArray[0].map((e) => (
          <Event e={e} />
        ))}
      </View>
    </View>
  );
};

export default Day;

const styles = StyleSheet.create({
  container: {},
  day: {},
  dayText: {},
  eventsContainer: {},
});
