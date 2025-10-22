import InProgress from "@/assets/icons/circle-half-stroke-solid-full.svg";
import Pending from "@/assets/icons/circle-regular-full.svg";
import Completed from "@/assets/icons/circle-solid-full.svg";
import colors from "@/constants/colors";
import { event, exam, subject, task } from "@/constants/types";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import {
  Animated,
  ColorValue,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = {
  overlay: boolean;
  selected: string;
  array: {
    tasks: task[];
    exams: exam[];
    events: event[];
  };
  subjects: subject[];
};

const screenHeight = Dimensions.get("window").height;
const scrollHeight = screenHeight - 80;

type ElementProps = {
  startTime: string;
  finishedTime: string;
  allDay: boolean;
  name: string;
  subject: string;
  status?: "pending" | "inProgress" | "completed";
  color: ColorValue;
  type: "exam" | "event" | "task";
};

const Element = ({
  allDay,
  color,
  finishedTime,
  name,
  startTime,
  subject,
  type,
  status,
}: ElementProps) => {
  return (
    <View style={styles.element}>
      <View style={[styles.elementColor, { backgroundColor: color }]}></View>
      <View style={[styles.elementDatesDiv, {}]}>
        {type === "task" ? (
          status && status === "completed" ? (
            <Completed height={40} width={40} fill={color} />
          ) : status && status === "pending" ? (
            <Pending height={40} width={40} fill={color} />
          ) : (
            <InProgress height={40} width={40} fill={color} />
          )
        ) : !allDay ? (
          <>
            <Text style={styles.elementDateText}>{startTime}</Text>
            <Text style={styles.elementDateText}>{finishedTime}</Text>
          </>
        ) : (
          <Text style={styles.elementDateText}>
            {type === "exam" ? "Sin hora" : "Todo el día"}
          </Text>
        )}
      </View>
      <View style={styles.elementLine}></View>
      <View style={styles.elementDataDiv}>
        <Text
          ellipsizeMode="tail"
          numberOfLines={1}
          style={{ fontSize: 20, fontFamily: "InstrumentSans-SemiBold" }}
        >
          {name}
        </Text>
        <Text
          ellipsizeMode="tail"
          numberOfLines={1}
          style={{ fontSize: 17, fontFamily: "InstrumentSans-Regular" }}
        >
          {subject}
        </Text>
      </View>
    </View>
  );
};

const OverlayDay = ({ overlay, selected, array, subjects }: Props) => {
  const bottomAnim = useRef(new Animated.Value(-500)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(bottomAnim, {
        toValue: overlay ? 0 : -500,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  }, [overlay]);

  useEffect(() => {
    let newArray: { date: Date; element: ReactNode }[] = [];
    const eventsSubArray: { date: Date; element: ReactNode }[] =
      array.events.map((e) => {
        let subject = "personal";
        switch (e.type) {
          case "personal":
            subject = "Personal";
            break;
          case "job":
            subject = "Trabajo";
            break;
          case "other":
            subject = "Otros";
            break;
          default:
            subject =
              subjects.find((s) => s.id === e.subject)?.name ??
              subjects[0].name;
            break;
        }

        const newEvent: { date: Date; element: ReactNode } = {
          date: e.startTime,
          element: (
            <Element
              allDay={e.allDay}
              key={`ev${e.id}`}
              color={colors[e.color].hex}
              finishedTime={
                !e.allDay
                  ? `${e.finishedTime.getHours()}:${e.finishedTime
                      .getMinutes()
                      .toString()
                      .padStart(2, "0")}`
                  : `${e.finishedTime.getFullYear()}-${e.finishedTime.getMonth()}-${e.finishedTime.getDate()}`
              }
              name={e.name}
              type="event"
              startTime={
                !e.allDay
                  ? `${e.startTime.getHours()}:${e.startTime
                      .getMinutes()
                      .toString()
                      .padStart(2, "0")}`
                  : `${e.startTime.getFullYear()}-${e.startTime.getMonth()}-${e.startTime.getDate()}`
              }
              subject={subject}
            />
          ),
        };
        return newEvent;
      });

    const tasksSubArray: { date: Date; element: ReactNode }[] = array.tasks.map(
      (e) => {
        let subject: subject =
          subjects.find((s) => s.id === e.subject) ?? subjects[0];

        const newTask: { date: Date; element: ReactNode } = {
          date: e.finishedDate ?? new Date(),
          element: (
            <Element
              allDay={true}
              key={`ta${e.id}`}
              color={colors[subject.color].hex}
              finishedTime=""
              name={e.name}
              type="task"
              startTime=""
              subject={subject.name}
              status={e.status}
            />
          ),
        };
        return newTask;
      }
    );

    const examsSubArray: { date: Date; element: ReactNode }[] = array.exams.map(
      (e) => {
        let subject = subjects.find((s) => s.id === e.subject) ?? subjects[0];

        const newExam: { date: Date; element: ReactNode } = {
          date: e.date,
          element: (
            <Element
              allDay={e.allDay}
              key={`ex${e.id}`}
              color={colors[subject.color].hex}
              type="exam"
              finishedTime={
                !e.allDay
                  ? `${e.finishedTime?.getHours()}:${e.finishedTime
                      ?.getMinutes()
                      .toString()
                      .padStart(2, "0")}`
                  : `${e.finishedTime?.getFullYear()}-${e.finishedTime?.getMonth()}-${e.finishedTime?.getDate()}`
              }
              name={e.name}
              startTime={
                !e.allDay
                  ? `${e.startTime?.getHours()}:${e.startTime
                      ?.getMinutes()
                      .toString()
                      .padStart(2, "0")}`
                  : `${e.startTime?.getFullYear()}-${e.startTime?.getMonth()}-${e.startTime?.getDate()}`
              }
              subject={subject.name}
            />
          ),
        };
        return newExam;
      }
    );

    newArray = [...eventsSubArray, ...examsSubArray, ...tasksSubArray];

    const orderArray = newArray.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
    setElementsArray(orderArray);
  }, [selected]);

  const [elementsArray, setElementsArray] = useState<
    { date: Date; element: ReactNode }[]
  >([]);

  return (
    <Animated.View style={[styles.overlay, { bottom: bottomAnim }]}>
      <View style={styles.line}></View>
      <Text style={styles.date}>{selected}</Text>
      <ScrollView
        contentContainerStyle={{
          gap: 15,
          justifyContent: "flex-start",
          alignItems: "center",
        }}
        style={styles.dataContainer}
      >
        {elementsArray.map((e) => e.element)}
      </ScrollView>
    </Animated.View>
  );
};

export default OverlayDay;

const styles = StyleSheet.create({
  overlayBg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: Dimensions.get("screen").width,
    height: scrollHeight,
    backgroundColor: "#0000003d",
    zIndex: 20,
  },
  overlay: {
    position: "absolute",
    transitionProperty: "bottom",
    transitionDuration: "0.8s",
    left: 0,
    backgroundColor: "#F7F7F7",
    alignItems: "center",
    justifyContent: "center",
    gap: 0,
    height: 500,
    width: Dimensions.get("screen").width,
    zIndex: 21,
    borderTopEndRadius: 40,
    borderTopStartRadius: 40,
  },
  line: {
    width: Dimensions.get("screen").width * 0.4,
    height: 3,
    borderRadius: 3,
    backgroundColor: "#c7c6c6ff",
    marginVertical: 10,
  },
  date: {
    marginVertical: 10,
    alignSelf: "flex-start",
    paddingHorizontal: 25,
    fontSize: 23,
    color: "#0b0279",
    fontFamily: "InstrumentSans-Bold",
  },
  dataContainer: {
    width: "100%",
    height: 400,
    gap: 20,
  },
  element: {
    height: 80,
    width: Dimensions.get("screen").width * 0.93,
    backgroundColor: "#fff",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  elementColor: {
    height: 65,
    width: 10,
    borderRadius: 5,
  },
  elementDatesDiv: {
    width: Dimensions.get("screen").width * 0.93 * 0.2,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  elementDateText: {
    fontSize: 20,
    fontFamily: "InstrumentSans-Medium",
    textAlign: "center",
  },
  elementLine: {
    width: 2,
    height: 60,
    backgroundColor: "#dedede",
  },
  elementDataDiv: {
    justifyContent: "center",
    alignItems: "flex-start",
    width: Dimensions.get("screen").width * 0.93 * 0.5,
  },
});
