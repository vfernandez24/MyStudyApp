import ChevronDown from "@/assets/icons/chevron-down-solid.svg";
import Gear from "@/assets/icons/gear-solid.svg";
import Plus from "@/assets/icons/plus-solid.svg";
import Day from "@/components/calendar/Day";
import PageTitle from "@/components/common/PageTitle";
import OverlayDay from "@/components/overlays/OverlayDay";
import {
  defaultEvents,
  defaultExams,
  defaultSubjects,
  defaultTasks,
} from "@/constants/defaultValues";
import { event, exam, subject, task } from "@/constants/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const screenHeight = Dimensions.get("window").height;
const scrollHeight = screenHeight - 80;

const calendar = () => {
  // Datos del AsyncStorage
  const [events, setEvents] = useState<event[]>([]);
  const [exams, setExams] = useState<exam[]>([]);
  const [tasks, setTasks] = useState<task[]>([]);
  const [subjects, setSubjects] = useState<subject[]>([]);

  useEffect(() => {
    async function loadData() {
      const awaitEvents = await AsyncStorage.getItem("events");
      const parsedEvents: event[] = awaitEvents
        ? JSON.parse(awaitEvents, (key, value) => {
            if (
              key === "date" ||
              key === "startTime" ||
              key === "finishedTime"
            ) {
              return value ? new Date(value) : undefined;
            }
            return value;
          })
        : defaultEvents;
      setEvents(parsedEvents);

      const awaitExams = await AsyncStorage.getItem("exams");
      const parsedExams: exam[] = awaitExams
        ? JSON.parse(awaitExams, (key, value) => {
            if (
              key === "date" ||
              key === "startTime" ||
              key === "finishedTime"
            ) {
              return value ? new Date(value) : undefined;
            }
            return value;
          })
        : defaultExams;
      setExams(parsedExams);

      const awaitTasks = await AsyncStorage.getItem("tasks");
      const parsedTasks: task[] = awaitTasks
        ? JSON.parse(awaitTasks, (key, value) => {
            if (
              key === "date" ||
              key === "startTime" ||
              key === "finishedTime" ||
              key === "finishedDate"
            ) {
              return value ? new Date(value) : undefined;
            }
            return value;
          })
        : defaultTasks;
      setTasks(parsedTasks);

      const awaitSubjects = await AsyncStorage.getItem("subjects");
      const parsedSubjects = awaitSubjects
        ? JSON.parse(awaitSubjects)
        : defaultSubjects;
      setSubjects(parsedSubjects);
    }
    loadData();
  }, []);

  // Array para el map (cuadricula => DAYS)
  const today = new Date();
  const [month, setMonth] = useState<number[]>([
    today.getFullYear(),
    today.getMonth(),
  ]);
  const [weeksArray, setWeeksArray] = useState<
    { date: Date; day: number; inMonth: boolean }[][]
  >([]);

  function daysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
  }

  async function getDaysArray(monthArray: number[]) {
    const month = new Date(monthArray[0], monthArray[1], 1);
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
    const firstDayNumber = firstDay.getDay();
    const days = daysInMonth(monthArray[0], monthArray[1]);

    let daysArrayInMonth: { date: Date; day: number; inMonth: boolean }[] = [];
    for (let i = 1; i <= days; i++) {
      let newDay = {
        date: new Date(month.getFullYear(), month.getMonth(), i),
        day:
          i === 1
            ? firstDayNumber
            : (daysArrayInMonth[daysArrayInMonth.length - 1].day + 1) % 7,
        inMonth: true,
      };
      daysArrayInMonth.push(newDay);
    }

    const firstDaySetting =
      String(await AsyncStorage.getItem("firstDaySetting")) || "sunday";

    let daysArrayOutMonthBefore: {
      date: Date;
      day: number;
      inMonth: boolean;
    }[] = [];
    let numberBefore: number = firstDayNumber;
    if (firstDaySetting === "monday") numberBefore = (firstDayNumber + 6) % 7;
    else numberBefore = firstDayNumber;
    let monthBefore = new Date(month);
    monthBefore.setMonth(month.getMonth() - 1);
    const daysInMonthBefore = daysInMonth(
      monthBefore.getFullYear(),
      monthBefore.getMonth()
    );
    for (let i = numberBefore - 1; i >= 0; i--) {
      let newDay = {
        date: new Date(
          monthBefore.getFullYear(),
          monthBefore.getMonth(),
          daysInMonthBefore - i + 1
        ),
        day: (firstDayNumber - (i + 1) + 7) % 7,
        inMonth: false,
      };
      daysArrayOutMonthBefore.push(newDay);
    }

    let daysArrayOutMonthAfter: {
      date: Date;
      day: number;
      inMonth: boolean;
    }[] = [];
    const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    const lastDayNumber = lastDay.getDay();
    let numberAfter: number;
    numberAfter =
      (7 - ((lastDayNumber - (firstDaySetting === "monday" ? 1 : 0) + 7) % 7)) %
      7;
    let monthAfter = new Date(month);
    monthAfter.setMonth(month.getMonth() + 1);
    for (let i = 1; i <= numberAfter; i++) {
      let newDay = {
        date: new Date(monthAfter.getFullYear(), monthAfter.getMonth(), i),
        day: (lastDayNumber + i) % 7,
        inMonth: false,
      };
      daysArrayOutMonthAfter.push(newDay);
    }

    const newDaysArray = [
      ...daysArrayOutMonthBefore,
      ...daysArrayInMonth,
      ...daysArrayOutMonthAfter,
    ];

    const weeksFinal = Math.ceil(newDaysArray.length / 7);

    let newWeeksArray: { date: Date; day: number; inMonth: boolean }[][] = [];
    let t = 0;
    for (let i = 0; i < weeksFinal; i++) {
      let newWeek: { date: Date; day: number; inMonth: boolean }[] = [];
      for (let k = 0; k < 7; k++) {
        newWeek.push(newDaysArray[t]);
        t++;
      }
      newWeeksArray.push(newWeek);
    }

    setWeeksArray(newWeeksArray);
  }

  useEffect(() => {
    getDaysArray(month);
  }, [month]);

  const [selected, setSelected] = useState<Date>(today);
  function dayPressed() {}

  const [overlay, setOverlay] = useState<boolean>(false);
  const [alert, setAlert] = useState<boolean>(false);

  return (
    <>
      {/* Overlay */}
      <TouchableOpacity
        onPress={alert == true ? () => {} : () => setOverlay(false)}
        style={[
          styles.overlayBg,
          { display: overlay == true ? "flex" : "none" },
        ]}
      ></TouchableOpacity>

      <OverlayDay />

      <TouchableOpacity
        style={styles.addButton}
        onPress={async () => {
          await AsyncStorage.setItem("typeExam", "create");
          //! router.push("/(modal)/");
          //? router.push("/(modal)/");
          //* router.push("/(modal)/");
          //TODO => router.push("/(modal)/");
        }}
      >
        <Plus fill="#fff" height={30} width={30} />
      </TouchableOpacity>

      {/* Scroll */}
      <ScrollView>
        <View style={{ marginBottom: 10 }}>
          <PageTitle title="CALENDARIO" />
        </View>

        {/* Month Title */}
        <View style={styles.monthDiv}>
          <TouchableOpacity style={styles.monthButton}></TouchableOpacity>
          <View style={styles.monthTitleDiv}>
            <Text style={styles.monthTitle}></Text>
          </View>
          <TouchableOpacity style={styles.monthButton}></TouchableOpacity>
        </View>

        {/* MAIN */}
        <View>
          {weeksArray.map((w) => (
            <View>
              {w.map((day) => (
                <Day
                  subjects={subjects}
                  pressFunction={dayPressed}
                  inMonth={day.inMonth}
                  sunday={day.day === 0}
                  isSelected={selected === day.date}
                  events={events}
                  exams={exams}
                  tasks={tasks}
                  date={day.date}
                />
              ))}
            </View>
          ))}
        </View>

        {/* Settings of calendar */}
        <View style={styles.buttonsContainer}>
          {/* Type of view */}
          <View style={styles.typeDiv}>
            <Text style={styles.buttonsTitle}>Tipo de vista</Text>
            <TouchableOpacity style={styles.typeButton}>
              <Text style={styles.typeButtonText}>{}</Text>
              <ChevronDown height={30} width={30} fill="#446DC4" />
            </TouchableOpacity>
          </View>

          <View style={styles.othersContainer}>
            {/* Today */}
            <TouchableOpacity
              style={styles.othersDiv}
              onPress={() => {
                setMonth([today.getFullYear(), today.getMonth()]);
                setSelected(today);
              }}
            >
              <Text style={styles.buttonsTitle}>Hoy</Text>
            </TouchableOpacity>
            {/* Settings */}
            <Link style={styles.othersDiv} href={"/"}>
              <Gear height={25} width={25} fill="#446DC4" />
              <Text style={styles.buttonsTitle}>Ajustes</Text>
            </Link>{" "}
            {/* PONER AQUÍ EL ENLACE DE LA PÁGINA DE AJUSTES */}
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: scrollHeight,
    padding: 15,
    paddingBottom: 200,
  },
  overlayBg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: scrollHeight,
    backgroundColor: "#0000003d",
    zIndex: 20,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    height: 60,
    width: 60,
    zIndex: 10,
    borderRadius: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0b0279",
  },
  monthDiv: {},
  monthTitle: {},
  monthTitleDiv: {},
  monthButton: {},
  main: {},
  week: {},
  buttonsContainer: {},
  buttonsTitle: {
    color: "#0b0279",
    fontFamily: "InstrumentSans-Bold",
  },
  typeDiv: {
    backgroundColor: "rgba(108, 152, 247, 0.11) ",
  },
  typeButton: {
    backgroundColor: "rgba(65, 109, 196, 0.19)",
  },
  typeButtonText: {},
  othersContainer: {},
  othersDiv: {},
});

export default calendar;
