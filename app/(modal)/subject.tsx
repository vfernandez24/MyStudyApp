import ArrowLeft from "@/assets/icons/arrow-left-solid.svg";
import Edit from "@/assets/icons/pen-solid.svg";
import Delete from "@/assets/icons/trash-solid.svg";
import AlertDelete from "@/components/listPages/AlertDelete";
import Grade from "@/components/listPages/Grade";
import { colors } from "@/constants/colors";
import {
  defaultEvents,
  defaultGrades,
  defaultSubjects,
} from "@/constants/defaultValues";
import { icons } from "@/constants/icons";
import { event, grade, subject } from "@/constants/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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

const subjectPage = () => {
  const [subjects, setSubjects] = useState<subject[]>(defaultSubjects);
  const [grades, setGrades] = useState<grade[]>(defaultGrades);
  const [events, setEvents] = useState<event[]>(defaultEvents);
  const [selectedSubject, setSelectedSubject] = useState<subject>();
  useEffect(() => {
    const loadEvents = async () => {
      const subjectsAwait = await AsyncStorage.getItem("subjects");
      const gradesAwait = await AsyncStorage.getItem("grades");
      const eventsAwait = await AsyncStorage.getItem("events");
      const selectedAwait = await AsyncStorage.getItem("idSubject");
      const parsedSubjects: subject[] = subjectsAwait
        ? JSON.parse(subjectsAwait)
        : defaultSubjects;
      const parsedGrades: grade[] = gradesAwait
        ? JSON.parse(gradesAwait)
        : defaultGrades;
      const parsedEvents: event[] = eventsAwait
        ? JSON.parse(eventsAwait)
        : defaultEvents;
      const parsedSelectedSubject =
        parsedSubjects.find((sub) => sub.id === Number(selectedAwait)) ??
        defaultSubjects[0];
      setSubjects(parsedSubjects);
      setGrades(parsedGrades);
      setEvents(parsedEvents);
      setSelectedSubject(parsedSelectedSubject);
    };
    loadEvents();
  }, []);

  const [alert, setAlert] = useState<boolean>(false);
  const [overlay, setOverlay] = useState<boolean>(false);

  function buttonDelete(id: number) {
    setAlert(true);
    setOverlay(true);
  }

  async function deleteGrade(id: number) {
    const newGrades = subjects.filter((sub) => sub.id !== id);
    newGrades.forEach((sub) => {
      if (sub.id > id) {
        sub.id -= 1;
      }
    });
    setSubjects(newGrades);
    console.log(newGrades);
    const parsed = JSON.stringify(newGrades);
    await AsyncStorage.setItem("subjects", parsed);
    const parsedGrades = await AsyncStorage.getItem("subjects");
    console.log(parsedGrades);
    router.push("/(drawer)/subjects");
    console.log("---------------------------------------");
  }

  const subjectPromedio = 0;
  const subjectPromedios = [];

  function deleteSubject(id: number) {}
  return (
    <View>
      {/* Overlay's zone */}
      <View
        style={[
          styles.overlayBg,
          { display: overlay == true ? "flex" : "none" },
        ]}
      ></View>

      <AlertDelete
        alert={alert}
        setAlert={setAlert}
        setOverlay={setOverlay}
        functionDel={deleteGrade}
        selectedGrade={selectedSubject ? selectedSubject.id : 0}
      ></AlertDelete>

      {/* Pages's content */}
      <ScrollView style={styles.container}>
        {/* Top buttons' zone */}
        <TouchableOpacity
          onPress={() => router.push("/(drawer)/subjects")}
          style={styles.buttonExit}
        >
          <ArrowLeft height={30} width={30} fill="#6C98F7" />
        </TouchableOpacity>

        <View style={styles.buttonsTop}>
          <TouchableOpacity style={styles.buttonTop}>
            <Edit
              height={27}
              width={27}
              fill={selectedSubject && colors[selectedSubject.color].text}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              buttonDelete(selectedSubject ? selectedSubject.id : 0)
            }
            style={styles.buttonTop}
          >
            <Delete
              height={27}
              width={27}
              fill={selectedSubject && colors[selectedSubject.color].text}
            ></Delete>
          </TouchableOpacity>
        </View>

        {/* Title's zone */}
        <View
          style={[
            styles.titleDiv,
            {
              backgroundColor:
                selectedSubject && colors[selectedSubject.color].hex,
            },
          ]}
        >
          <View style={styles.iconDiv}>
            {selectedSubject && (
              <MaterialCommunityIcons
                name={
                  icons[selectedSubject.icon]
                    ?.name as keyof typeof MaterialCommunityIcons.glyphMap
                }
                size={65}
              />
            )}
          </View>
          <Text
            style={[
              styles.titleText,
              { color: selectedSubject && colors[selectedSubject.color].text },
            ]}
          >
            {selectedSubject ? selectedSubject.name : ""}
          </Text>
        </View>

        {/* Main */}
        <View>
          <Text style={styles.sectionTitle}>Promedio</Text>
          {/* Promedio */}
          <View style={styles.promedio}>
            <View style={styles.promedioDiv}>
              <View style={styles.promedioBg}>
                <Text style={styles.promedioText}>{subjectPromedio}</Text>
              </View>
            </View>
            <View style={styles.promedioTypesDiv}>
              <View style={styles.promedioType}>
                <Text style={styles.promedioTypeText}>Escrito</Text>
                <Text style={[styles.promedioTypeText, { color: "#888" }]}>
                  9,25
                </Text>
              </View>
              <View style={styles.promedioType}>
                <Text style={styles.promedioTypeText}>Práctico</Text>
                <Text style={[styles.promedioTypeText, { color: "#888" }]}>
                  7,45
                </Text>
              </View>
              <View style={styles.promedioType}>
                <Text style={styles.promedioTypeText}>Oral</Text>
                <Text style={[styles.promedioTypeText, { color: "#888" }]}>
                  3
                </Text>
              </View>
            </View>
          </View>

          {/* Notas */}
          <Text style={styles.sectionTitle}>Notas</Text>
          <View style={styles.gradesContainer}>
            {grades.filter((g) =>
              selectedSubject ? g.subject == selectedSubject.id : g.subject == 0
            ).length !== 0 ? (
              grades
                .filter((g) =>
                  selectedSubject
                    ? g.subject == selectedSubject.id
                    : g.subject == 0
                )
                .map((g) => <Grade g={g} pressFunction={() => {}} key={g.id} />)
            ) : (
              <Text style={styles.gradesNoContentText}>Sin notas</Text>
            )}
          </View>

          {/* Próximos exámenes */}
          <Text style={styles.sectionTitle}>Próximos eventos</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default subjectPage;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: scrollHeight,
    paddingBottom: 200,
  },
  buttonExit: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
  },
  buttonsTop: {
    position: "absolute",
    zIndex: 10,
    top: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "center",
    gap: 40,
    alignItems: "center",
  },
  buttonTop: {
    height: 35,
    width: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  titleDiv: {
    height: 180,
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    padding: 25,
  },
  iconDiv: {
    position: "relative",
    bottom: -35,
    height: 110,
    width: 110,
    backgroundColor: "#fff",
    borderRadius: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {},
  titleText: {
    fontFamily: "InstrumentSans-Bold",
    color: "#000",
    fontSize: 32,
  },
  sectionTitle: {
    padding: 20,
    fontSize: 35,
    color: "#6C98F7",
    textAlign: "left",
    fontFamily: "InstrumentSans-SemiBold",
  },
  promedio: {
    flexDirection: "row",
    height: 120,
    width: "100%",
    alignItems: "center",
  },
  promedioDiv: {
    width: "40%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  promedioBg: {
    width: 85,
    height: 85,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    backgroundColor: "#afafaf",
  },
  promedioText: {
    fontSize: 35,
    fontFamily: "InstrumentSans-Bold",
  },
  promedioTypesDiv: {
    width: "60%",
    height: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  promedioType: {
    height: "33.33%",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingRight: 30,
  },
  promedioTypeText: {
    fontSize: 20,
    fontFamily: "InstrumentSans-SemiBold",
  },
  gradesContainer: {
    padding: 10,
  },
  gradesNoContentText: {
    width: "100%",
    textAlign: "center",
    fontSize: 25,
    fontFamily: "InstrumentSans-SemiBold",
    color: "#999",
  },
  overlayBg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: scrollHeight + 80,
    backgroundColor: "#0000003d",
    zIndex: 20,
  },
});
