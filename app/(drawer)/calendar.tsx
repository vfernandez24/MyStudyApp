import ChevronSide from "@/assets/icons/chevron-right-solid.svg";
import Gear from "@/assets/icons/gear-solid.svg";
import Plus from "@/assets/icons/plus-solid.svg";
import Day from "@/components/calendar/Day";
import SelectNewElement from "@/components/calendar/SelectNewElement";
import PageTitle from "@/components/common/PageTitle";
import OverlayDay from "@/components/overlays/OverlayDay";
import {
  defaultEvents,
  defaultExams,
  defaultTasks,
} from "@/constants/calendarConstants";
import days from "@/constants/days";
import {
  // defaultEvents,
  // defaultExams,
  // defaultTasks,
  defaultSubjects,
} from "@/constants/defaultValues";
import months from "@/constants/months";
import { event, exam, subject, task } from "@/constants/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
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
const screenWidth = Dimensions.get("window").width;

const calendar = () => {
  // Datos del AsyncStorage
  const [events, setEvents] = useState<event[]>([]);
  const [exams, setExams] = useState<exam[]>([]);
  const [tasks, setTasks] = useState<task[]>([]);
  const [subjects, setSubjects] = useState<subject[]>(defaultSubjects);

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
      // setEvents(parsedEvents);
      setEvents(defaultEvents);

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
      setExams(defaultExams);
      // setExams(parsedExams);

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
      // setTasks(parsedTasks);
      setTasks(defaultTasks);

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

  function getDaysArray(monthArray: number[]) {
    const month = new Date(monthArray[0], monthArray[1], 1);
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
    const firstDayNumber =
      (firstDay.getDay() + (firstDaySetting === "monday" ? 0 : 1)) % 7;
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
          daysInMonthBefore - i
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

    while (newDaysArray.length < 42) {
      const lastDate = newDaysArray[newDaysArray.length - 1].date;
      const nextDate = new Date(lastDate);
      nextDate.setDate(lastDate.getDate() + 1);

      newDaysArray.push({
        date: nextDate,
        day: (lastDate.getDay() + 1) % 7,
        inMonth: false,
      });
    }

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
    async function loadFirstDaySetting() {
      const setting = await AsyncStorage.getItem("firstDaySetting");
      setFirstDaySetting(setting || "monday");
    }
    loadFirstDaySetting();
  }, []);

  const [selected, setSelected] = useState<string>(today.toDateString());
  const [daySelectedArray, setDaySelectedArray] = useState<
    (task | exam | event)[]
  >([]);
  function dayPressed(date: Date) {
    setOverlay(true);
    setSelected(date.toDateString());

    const filteredExams = exams.filter(
      (e) => e.date.toDateString() === date.toDateString()
    );
    const filteredTasks = tasks.filter(
      (t) =>
        t.finishedDate && t.finishedDate.toDateString() === date.toDateString()
    );
    const filteredEvents = events.filter(
      (e) => e.finishedTime.toDateString() === date.toDateString()
    );

    setDaySelectedArray([
      ...filteredEvents,
      ...filteredExams,
      ...filteredTasks,
    ]);
  }

  const [firstDaySetting, setFirstDaySetting] = useState<string>("monday");

  useEffect(() => {
    getDaysArray(month);
  }, [month, firstDaySetting]);

  const [overlay, setOverlay] = useState<boolean>(false);
  const [overlaySelect, setOverlaySelect] = useState<boolean>(false);
  const [overlayDay, setOverlayDay] = useState<boolean>(false);
  const [alert, setAlert] = useState<boolean>(false);

  async function typePressed(id: "event" | "exam" | "task") {
    switch (id) {
      case "event":
        AsyncStorage.setItem("typeEvent", "create");
        router.push("/(modal)/createEvent");
        break;
      case "exam":
        AsyncStorage.setItem("typeExam", "create");
        router.push("/(modal)/createExams");
        break;
      case "task":
        AsyncStorage.setItem("typeHomework", "create");
        router.push("/(modal)/createHomework");
        break;
    }
  }

  return (
    <>
      {/* Overlay */}
      <TouchableOpacity
        onPress={
          alert == true
            ? () => {}
            : () => {
                setOverlayDay(false);
                setOverlaySelect(false);
                setOverlay(false);
              }
        }
        style={[
          styles.overlayBg,
          { display: overlay == true ? "flex" : "none" },
        ]}
      ></TouchableOpacity>

      <OverlayDay
        overlay={overlayDay}
        selected={selected}
        array={daySelectedArray}
      />

      <View
        style={[styles.selectDiv, { display: overlaySelect ? "flex" : "none" }]}
      >
        <SelectNewElement pressFunction={typePressed} />
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setOverlay(true);
          setOverlaySelect(true);
        }}
      >
        <Plus fill="#fff" height={30} width={30} />
      </TouchableOpacity>

      {/* Scroll */}
      <ScrollView style={styles.container}>
        <View style={{ marginBottom: 10 }}>
          <PageTitle title="CALENDARIO" />
        </View>

        {/* Month Title */}
        <View style={styles.monthDiv}>
          <TouchableOpacity
            onPress={() => {
              const m = new Date(month[0], month[1], 1);
              m.setMonth(m.getMonth() - 1);
              setMonth([m.getFullYear(), m.getMonth()]);
            }}
            style={styles.monthButton}
          >
            <ChevronSide height={30} rotation={180} fill="#446DC4" width={30} />
          </TouchableOpacity>
          <View style={styles.monthTitleDiv}>
            <Text style={styles.monthTitle}>
              {months[month[1]].large.concat(" ").concat(String(month[0]))}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              const m = new Date(month[0], month[1], 1);
              m.setMonth(m.getMonth() + 1);
              setMonth([m.getFullYear(), m.getMonth()]);
            }}
            style={styles.monthButton}
          >
            <ChevronSide height={30} fill="#446DC4" width={30} />
          </TouchableOpacity>
        </View>

        {/* MAIN */}
        <View style={styles.main}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: 20,
              marginBottom: 5,
            }}
          >
            <View
              style={{
                width: screenWidth / 7,
                alignItems: "center",
                justifyContent: "center",
                height: 20,
                display: firstDaySetting === "monday" ? "none" : "flex",
              }}
            >
              <Text
                style={{
                  color: "#0b0279",
                  fontFamily: "InstrumentSans-Medium",
                  fontSize: 15,
                }}
              >
                {days[0].letter}
              </Text>
            </View>
            {days
              .filter((d) => d.id >= 1)
              .map((d) => (
                <View
                  key={d.id}
                  style={{
                    width: screenWidth / 7,
                    alignItems: "center",
                    justifyContent: "center",
                    height: 20,
                  }}
                >
                  <Text
                    style={{
                      color: "#0b0279",
                      fontFamily: "InstrumentSans-Medium",
                      fontSize: 15,
                    }}
                  >
                    {d.letter}
                  </Text>
                </View>
              ))}
            <View
              style={{
                width: screenWidth / 7,
                alignItems: "center",
                justifyContent: "center",
                height: 20,
                display: firstDaySetting !== "monday" ? "none" : "flex",
              }}
            >
              <Text
                style={{
                  color: "#0b0279",
                  fontFamily: "InstrumentSans-Medium",
                  fontSize: 15,
                }}
              >
                {days[0].letter}
              </Text>
            </View>
          </View>
          {weeksArray.map((w, i) => (
            <View
              style={[
                styles.week,
                { height: ((screenHeight - 80) * 0.65) / weeksArray.length },
              ]}
              key={i}
            >
              {w.map((day, j) =>
                day ? (
                  <Day
                    key={j}
                    subjects={subjects}
                    pressFunction={() => dayPressed(day.date)}
                    month={month}
                    sunday={day.day === 0}
                    isSelected={selected === day.date.toDateString()}
                    events={events}
                    exams={exams}
                    tasks={tasks}
                    date={day.date}
                    weekStartDate={w[0].date} // <- nuevo prop
                    firstDaySetting={firstDaySetting} // <- pasamos setting por si hace falta
                  />
                ) : null
              )}
            </View>
          ))}
        </View>

        {/* Settings of calendar */}
        <View style={styles.buttonsContainer}>
          {/* Today */}
          <TouchableOpacity
            style={styles.othersDiv}
            onPress={() => {
              setMonth([today.getFullYear(), today.getMonth()]);
              setSelected(today.toDateString());
            }}
          >
            <Text style={styles.buttonsTitle}>Hoy</Text>
          </TouchableOpacity>
          {/* Settings */}
          <TouchableOpacity
            style={styles.othersDiv}
            onPress={() => router.push("/")}
          >
            {/* PONER AQUÍ EL ENLACE DE LA PÁGINA DE AJUSTES */}
            <Gear height={25} width={25} fill="#446DC4" />
            <Text style={styles.buttonsTitle}>Ajustes</Text>
          </TouchableOpacity>
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
    zIndex: 40,
    borderRadius: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0b0279",
  },
  selectDiv: {
    position: "absolute",
    height: 155,
    width: 150,
    justifyContent: "space-evenly",
    alignItems: "center",
    borderRadius: 20,
    bottom: 90,
    right: 20,
    zIndex: 50,
  },
  monthDiv: {
    width: screenWidth * 0.9,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    height: 65,
    borderRadius: 20,
    backgroundColor: "rgba(108, 152, 247, 0.21)",
    marginBottom: 20,
  },
  monthTitle: {
    fontFamily: "InstrumentSans-Bold",
    fontSize: 23,
    color: "#0b0279",
  },
  monthTitleDiv: {
    height: 65,
    alignItems: "center",
    justifyContent: "center",
    width: screenWidth * 0.9 * 0.5,
  },
  monthButton: {
    height: 50,
    width: 50,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  main: {
    height: (screenHeight - 80) * 0.65 + 20,
    width: screenWidth,
    position: "relative",
    right: 15,
    // backgroundColor: "#000"
  },
  week: {
    width: "100%",
    flexDirection: "row",
  },
  buttonsContainer: {
    width: screenWidth - 100,
    height:
      screenHeight - 80 - ((screenHeight - 80) * 0.65 + 20) - 55 - 10 - 50 - 50,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
    position: "relative",
    right: 0,
  },
  buttonsTitle: {
    color: "#0b0279",
    fontFamily: "InstrumentSans-Bold",
  },
  othersDiv: {
    height: "55%",
    backgroundColor: "rgba(108, 152, 247, 0.21)",
    borderRadius: 10,
    width: "auto",
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    flexDirection: "row",
  },
});

export default calendar;
