import Event from "@/components/calendar/Event";
import { defaultEvents } from "@/constants/defaultValues";
import { event } from "@/constants/types";
import { saveData } from "@/scripts/data";
import selectColor from "@/scripts/selectColor";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PageTitle from "../../components/common/PageTitle";
import { gradeColors } from "../../constants/colors";

// Dev's values

export default function Index() {
  const [events, setEvents] = useState<event[]>(defaultEvents);
  const [promedio, setPromedio] = useState<number>(0);
  const [promedioBg, setPromedioBg] = useState<number>(0);

  useEffect(() => {
    const loadEvents = async () => {
      const eventsAwait = await AsyncStorage.getItem("events");
      const parsedEvents: event[] = eventsAwait
        ? JSON.parse(eventsAwait)
        : defaultEvents;
      setEvents(parsedEvents);
      saveData("categories", JSON.stringify(parsedEvents));
    };
    loadEvents();
    const loadPromedio = async () => {
      const promedioAwait = await AsyncStorage.getItem("promedio");
      const parsedPromedio: number = promedioAwait
        ? JSON.parse(promedioAwait)
        : 0;
        setPromedio(Number(parsedPromedio.toFixed(2)));
        const bg = selectColor(promedio);
        setPromedioBg(bg);
    }
    loadPromedio();
    console.log("promedio: "+promedio);
  }, []);

  const [fontsLoaded] = useFonts({
    "InstrumentSans-Regular": require("../../assets/fonts/InstrumentSans-Medium.ttf"),
    "InstrumentSans-Bold": require("../../assets/fonts/InstrumentSans-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  const months = [
    "ENE",
    "FEB",
    "MAR",
    "ABR",
    "MAY",
    "JUN",
    "JUL",
    "AGO",
    "SEP",
    "OCT",
    "NOV",
    "DIC",
  ];
  const fecha: Date = new Date();
  const year = fecha.getFullYear();
  const dia: number = fecha.getDate();
  const mes: number = fecha.getMonth();

  return (
    <View style={styles.container}>
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
              <Text style={styles.calendarMonth}>{months[Number(mes)]}</Text>
              <Text style={styles.calendarDay}>{dia}</Text>
            </View>
          </ImageBackground>
        </View>
        <TouchableOpacity
          style={styles.agenda}
          onPress={() => router.push("/(drawer)/calendar")}
        >
          {events.map((e, index) => {
            if (index < 3 && e.date == `${year}-${Number(mes + 1)}-${dia}`) {
              return <Event key={e.name} e={e} />;
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
        style={[styles.promedioDiv, { backgroundColor: gradeColors[promedioBg].color }]}
        onPress={() => router.push("/(drawer)/(grades)/grades")}
      >
        <Text style={[styles.promedioTitle, { color: gradeColors[promedioBg].text}]}>TU PROMEDIO</Text>
        <Text style={[styles.promedio, { color: gradeColors[promedioBg].text}]}>{promedio}</Text>
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
