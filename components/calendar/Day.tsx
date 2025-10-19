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
  weekStartDate: Date;
  firstDaySetting: string;
};

const dayOnly = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const daysBetween = (a: Date, b: Date) => {
  const diff = dayOnly(b).getTime() - dayOnly(a).getTime();
  return Math.round(diff / (1000 * 60 * 60 * 24));
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
  weekStartDate,
  firstDaySetting,
}: Props) => {
  const dayArray = useMemo(() => {
    const dateOnly = dayOnly(date);

    const filteredEvents = events.filter((e) => {
      const s = e.startTime ? dayOnly(e.startTime) : undefined;
      const f = e.finishedTime ? dayOnly(e.finishedTime) : undefined;
      if (!s || !f) return false;
      return s.getTime() <= dateOnly.getTime() && f.getTime() >= dateOnly.getTime();
    });

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

  const weekStart = dayOnly(weekStartDate);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  return (
    <TouchableOpacity onPress={pressFunction} style={[styles.container, { borderColor: isSelected ? "#446DC4" : "#ececec" }]}>
      <View style={styles.day}>
        <Text style={[styles.dayText, { color: dayColor }]}>
          {date.getDate()}
        </Text>
      </View>

      <View style={styles.eventsContainer}>
        {dayArray.events.map((e) => {
          const eventStart = dayOnly(e.startTime!);
          const eventEnd = dayOnly(e.finishedTime!);

          const segmentStart = eventStart.getTime() < weekStart.getTime() ? weekStart : eventStart;
          const segmentEnd = eventEnd.getTime() > weekEnd.getTime() ? weekEnd : eventEnd;

          const numberDays = daysBetween(segmentStart, segmentEnd) + 1;

          const isSegmentVisibleHere = dayOnly(date).getTime() === segmentStart.getTime();


          const segmentStartsAfterEventStart = segmentStart.getTime() > eventStart.getTime();

          const segmentEndsBeforeEventEnd = segmentEnd.getTime() < eventEnd.getTime();

          if (isSegmentVisibleHere) {
            return (
              <Event
                key={e.id}
                e={e}
                date={date}
                numberDays={numberDays}
                isPlaceholder={false}
                segmentStartsAfterEventStart={segmentStartsAfterEventStart}
                segmentEndsBeforeEventEnd={segmentEndsBeforeEventEnd}
              />
            );
          } else {
            return (
              <Event
                key={`${e.id}-ph-${date.toDateString()}`}
                e={e}
                date={date}
                numberDays={1}
                isPlaceholder={true}
                segmentStartsAfterEventStart={false}
                segmentEndsBeforeEventEnd={false}
              />
            );
          }
        })}

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
    zIndex: 10,
    height: "100%",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#ececec",
    overflow: "visible",
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
