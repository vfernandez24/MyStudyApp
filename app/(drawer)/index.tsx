import Event from "@/components/calendar/Event";
import { defaultEvents, defaultGrades } from "@/constants/defaultValues";
import months from "@/constants/months";
import { event, grade } from "@/constants/types";
import selectColor from "@/helpers/selectColor";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PageTitle from "../../components/UI/PageTitle";
import { gradeColors } from "../../constants/colors";

export default function Index() {
  const [events, setEvents] = useState<event[]>(defaultEvents);
  const [promedio, setPromedio] = useState<number>(0);
  const [grades, setGrades] = useState<grade[]>(defaultGrades);
  const [promedioBg, setPromedioBg] = useState<number>(0);

  useEffect(() => {
    const loadEvents = async () => {
      const gradesAwait = await AsyncStorage.getItem("grades");
      const eventsAwait = await AsyncStorage.getItem("events");
      const parsedEvents: event[] = eventsAwait
        ? JSON.parse(eventsAwait)
        : defaultEvents;
      const parsedGrades: grade[] = gradesAwait
        ? JSON.parse(gradesAwait)
        : defaultGrades;
      setEvents(parsedEvents);
      setGrades(parsedGrades);
    };
    loadEvents();
  }, []);

  useEffect(() => {
    if (grades.length === 0) return;

    const avg = grades.reduce((sum, g) => sum + g.grade, 0) / grades.length;
    const rounded = Number(avg.toFixed(2));

    setPromedio(rounded);
    setPromedioBg(selectColor(rounded));
  }, [grades]);

  const fecha: Date = new Date();
  const year = fecha.getFullYear();
  const dia: number = fecha.getDate();
  const mes: number = fecha.getMonth();

  return (
    <View style={styles.container}>
      <Redirect href="/(drawer)/calendar" />

      <PageTitle title="INICIO" />

      {/* Today's zone */}
      <View style={styles.todayDiv}>
        <View style={styles.calendar}>
          <ImageBackground
            source={require("../../assets/backgrounds/calendar.png")}
            tintColor={"#0B0279"}
            imageStyle={{
              height: 145,
              objectFit: "contain",
              alignSelf: "center",
            }}
          >
            <View style={styles.calendarDiv}>
              <Text style={styles.calendarMonth}>
                {months[Number(mes)].litle}
              </Text>
              <Text style={styles.calendarDay}>{dia}</Text>
            </View>
          </ImageBackground>
        </View>
        <TouchableOpacity
          style={styles.agenda}
          onPress={() => router.push("/(drawer)/calendar")}

          // Funcion para eliminar todos los datos del AsyncStorage en desarrollo
          // onPress={async () => {
          //   await AsyncStorage.removeItem("exams");
          // }}
        >
          {events.map((e, index) => {
            if (index < 3 && e.date == `${year}-${Number(mes + 1)}-${dia}`) {
              return <Event key={e.name} e={e} date={new Date()} />;
            }
          })}
          <Text
            style={{
              color: "#6C98F7",
              textAlign: "center",
              fontFamily: "InstrumentSans-Medium",
              lineHeight: 30,
            }}
          >
            Ver más
          </Text>
        </TouchableOpacity>
      </View>

      {/* Promedio's zone */}
      <TouchableOpacity
        style={[
          styles.promedioDiv,
          { backgroundColor: gradeColors[promedioBg].color },
        ]}
        onPress={() => {
          router.push("/(drawer)/(grades)/grades");
        }}
      >
        <Text
          style={[
            styles.promedioTitle,
            { color: gradeColors[promedioBg].text },
          ]}
        >
          TU PROMEDIO
        </Text>
        <Text
          style={[styles.promedio, { color: gradeColors[promedioBg].text }]}
        >
          {promedio}
        </Text>
      </TouchableOpacity>

      {/* Timetable's zone */}
      <TouchableOpacity
        style={styles.horarioDiv}
        onPress={() => router.push("/(drawer)/timetable")}
      >
        <Text style={styles.promedioTitle}>HORARIO DE HOY</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    gap: 10,
  },
  todayDiv: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    height: 145,
    width: "100%",
  },
  calendar: {
    height: 145,
    width: "50%",
  },
  calendarDiv: {
    marginTop: 43.5,
    display: "flex",
    width: "100%",
    height: 105,
    gap: 2,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  calendarMonth: {
    fontFamily: "InstrumentSans-Medium",
    letterSpacing: 2,
    color: "#6C98F7",
    fontSize: 24,
    lineHeight: 24,
  },
  calendarDay: {
    fontFamily: "InstrumentSans-Bold",
    color: "#6C98F7",
    fontSize: 50,
    lineHeight: 50,
  },
  agenda: {
    width: "50%",
    height: 145,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#D3D3D3",
    padding: 10,
    gap: 4,
  },
  promedioDiv: {
    height: 110,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0,
    borderRadius: 20,
  },
  promedioTitle: {
    position: "absolute",
    top: 10,
    left: 20,
    fontSize: 20,
    width: "100%",
    letterSpacing: 2,
    fontFamily: "InstrumentSans-Bold",
    color: "#0b0279",
  },
  promedio: {
    fontSize: 40,
    fontFamily: "InstrumentSans-Bold",
    letterSpacing: 5,
    paddingTop: 20,
  },
  horarioDiv: {
    height: "50%",
    width: "100%",
    borderWidth: 3,
    borderColor: "#d3d3d3",
    borderRadius: 18,
  },
});
