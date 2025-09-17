import ArrowLeft from "@/assets/icons/arrow-left-solid.svg";
import Edit from "@/assets/icons/pen-solid.svg";
import Delete from "@/assets/icons/trash-solid.svg";
import AlertDelete from "@/components/listPages/AlertDelete";
import Exam from "@/components/listPages/Exam";
import Grade from "@/components/listPages/Grade";
import Teacher from "@/components/listPages/Teacher";
import colors, { gradeColors } from "@/constants/colors";
import {
  defaultExams,
  defaultGrades,
  defaultSubjects,
  defaultTeachers,
} from "@/constants/defaultValues";
import icons from "@/constants/icons";
import { exam, grade, subject, teacher } from "@/constants/types";
import selectColor from "@/scripts/selectColor";
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
  const [subjectGrades, setSubjectGrades] = useState<grade[]>(defaultGrades);
  const [exams, setExams] = useState<exam[]>(defaultExams);
  const [selectedSubject, setSelectedSubject] = useState<subject>();
  const [teachers, setTeachers] = useState<teacher[]>(defaultTeachers);

  useEffect(() => {
    const loadEvents = async () => {
      const subjectsAwait = await AsyncStorage.getItem("subjects");
      const gradesAwait = await AsyncStorage.getItem("grades");
      const examsAwait = await AsyncStorage.getItem("exams");
      const selectedAwait = await AsyncStorage.getItem("idSubject");
      const teachersAwait = await AsyncStorage.getItem("teachers");
      const parsedSubjects: subject[] = subjectsAwait
        ? JSON.parse(subjectsAwait)
        : defaultSubjects;
      const parsedGrades: grade[] = gradesAwait
        ? JSON.parse(gradesAwait)
        : defaultGrades;
      const parsedExams: exam[] = examsAwait
        ? JSON.parse(examsAwait)
        : defaultExams;
      const parsedSelectedSubject = selectedAwait
        ? JSON.parse(selectedAwait)
        : defaultSubjects[0];
      const parsedTeachers = teachersAwait
        ? JSON.parse(teachersAwait)
        : defaultTeachers;
      const newSubjectGrades = parsedSelectedSubject
        ? parsedGrades.filter((g) => g.subject == parsedSelectedSubject.id)
        : [];
      setSubjects(parsedSubjects);
      setGrades(parsedGrades);
      setExams(parsedExams);
      setSelectedSubject(parsedSelectedSubject);
      setSubjectGrades(newSubjectGrades);
      setTeachers(parsedTeachers);
    };
    loadEvents();
  }, []);

  const [subjectGradesGroups, setSubjectGradesGroups] = useState<grade[][]>([]);
  const [promedio, setPromedio] = useState<number | null>(null);
  const [promedioGroup, setPromedioGroup] = useState<number[]>([]);
  const [promedioGroupBg, setPromedioGroupBg] = useState<number[]>([]);
  const [promedioBg, setPromedioBg] = useState<number>(0);

  const safeColorKey = (val: any) => (val in gradeColors ? val : "default");

  useEffect(() => {
    if (subjectGrades.length === 0) return;

    const avg =
      subjectGrades.reduce((sum, g) => sum + g.grade, 0) / subjectGrades.length;

    const gradesWriten = subjectGrades
      ? subjectGrades.filter((g) => g.type == "write")
      : [];
    const promedioEscrito =
      gradesWriten.length > 0 && gradesWriten !== undefined
        ? gradesWriten.reduce((sum, g) => sum + g.grade, 0) /
          gradesWriten.length
        : 0;

    const gradesOral = subjectGrades
      ? subjectGrades.filter((g) => g.type == "oral")
      : [];
    const promedioOral =
      gradesOral.length > 0 && gradesOral !== undefined
        ? gradesOral.reduce((sum, g) => sum + g.grade, 0) / gradesOral.length
        : 0;

    const gradesPractical = subjectGrades
      ? subjectGrades.filter((g) => g.type == "practical")
      : [];
    const promedioPractical =
      gradesPractical.length > 0 && gradesPractical !== undefined
        ? gradesPractical.reduce((sum, g) => sum + g.grade, 0) /
          gradesPractical.length
        : 0;

    const newSubjectGradesGroups = [gradesWriten, gradesOral, gradesPractical];
    const newPromedios = [promedioEscrito, promedioOral, promedioPractical];
    const newPromediosBg = [
      safeColorKey(selectColor(Number(promedioEscrito.toFixed(2)))),
      safeColorKey(selectColor(Number(promedioOral.toFixed(2)))),
      safeColorKey(selectColor(Number(promedioPractical.toFixed(2)))),
    ];

    setSubjectGradesGroups(newSubjectGradesGroups);
    setPromedio(Number(avg.toFixed(2)));
    setPromedioBg(selectColor(Number(avg.toFixed(2))));
    setPromedioGroup(newPromedios);
    setPromedioGroupBg(newPromediosBg);
  }, [subjectGrades]);

  const [alert, setAlert] = useState<boolean>(false);
  const [overlay, setOverlay] = useState<boolean>(false);

  function buttonDelete(id: number) {
    setAlert(true);
    setOverlay(true);
  }

  function deleteSubjectGrades() {
    const toRemoveIds = new Set(subjectGrades.map((obj) => obj.id));

    const filtered = grades.filter((obj) => !toRemoveIds.has(obj.id));

    return filtered;
  }

  async function deleteSubject(id: number) {
    const newGrades = deleteSubjectGrades();

    const newSubjects = subjects.filter((sub) => sub.id !== id);
    setGrades(newGrades);
    await AsyncStorage.setItem("grades", JSON.stringify(newGrades));
    const avg = grades.reduce((sum, g) => sum + g.grade, 0) / grades.length;
    const rounded = Number(avg.toFixed(2));
    await AsyncStorage.setItem("promedio", String(rounded));
    setSubjects(newSubjects);
    const parsed = JSON.stringify(newSubjects);
    await AsyncStorage.setItem("subjects", parsed);
    router.push("/(drawer)/subjects");
  }
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
        functionDel={deleteSubject}
        selectedGrade={selectedSubject ? selectedSubject.id : 0}
      ></AlertDelete>

      {/* Pages's content */}
      <ScrollView style={styles.container}>
        {/* Top buttons' zone */}
        <TouchableOpacity
          onPress={() => router.push("/(drawer)/subjects")}
          style={styles.buttonExit}
        >
          <ArrowLeft
            height={30}
            width={30}
            fill={selectedSubject && colors[selectedSubject.color].text}
          />
        </TouchableOpacity>

        <View style={styles.buttonsTop}>
          <TouchableOpacity
            onPress={async () => {
              await AsyncStorage.setItem("typeSubject", "edit");
              await AsyncStorage.setItem("idEdit", String(selectedSubject?.id));
              router.push("/(modal)/createSubjects");
            }}
            style={styles.buttonTop}
          >
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
              <View
                style={[
                  styles.promedioBg,
                  {
                    backgroundColor:
                      subjectGrades.length > 0
                        ? gradeColors[promedioBg].color
                        : "#d3d3d3",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.promedioText,
                    {
                      color:
                        subjectGrades.length > 0
                          ? gradeColors[promedioBg].text
                          : "#000",
                    },
                  ]}
                >
                  {subjectGrades.length > 0 ? promedio : "-"}
                </Text>
              </View>
            </View>

            <View style={styles.promedioTypesDiv}>
              <View
                style={[
                  styles.promedioType,
                  {
                    borderRadius: 10,
                    backgroundColor:
                      subjectGradesGroups[0]?.length == 0 ||
                      subjectGrades.length == 0
                        ? "#d3d3d3"
                        : gradeColors[promedioGroupBg[0]]?.color,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.promedioTypeText,
                    {
                      color:
                        subjectGradesGroups[0]?.length == 0 ||
                        subjectGrades.length == 0
                          ? "#000"
                          : gradeColors[promedioGroupBg[0]]?.text,
                    },
                  ]}
                >
                  Escrito
                </Text>
                <Text
                  style={[
                    styles.promedioTypeText,
                    {
                      color:
                        subjectGradesGroups[0]?.length == 0 ||
                        subjectGrades.length == 0
                          ? "#000"
                          : gradeColors[promedioGroupBg[0]]?.text,
                    },
                  ]}
                >
                  {subjectGradesGroups[0]?.length !== 0 &&
                  subjectGrades.length > 0
                    ? promedioGroup[0]
                    : "-"}
                </Text>
              </View>
              <View
                style={[
                  styles.promedioType,
                  {
                    borderRadius: 10,
                    backgroundColor:
                      subjectGradesGroups[1]?.length == 0 ||
                      subjectGrades.length == 0
                        ? "#d3d3d3"
                        : gradeColors[promedioGroupBg[1]]?.color,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.promedioTypeText,
                    {
                      color:
                        subjectGradesGroups[1]?.length == 0 ||
                        subjectGrades.length == 0
                          ? "#000"
                          : gradeColors[promedioGroupBg[1]]?.text,
                    },
                  ]}
                >
                  Práctico
                </Text>
                <Text
                  style={[
                    styles.promedioTypeText,
                    {
                      color:
                        subjectGradesGroups[1]?.length == 0 ||
                        subjectGrades.length == 0
                          ? "#000"
                          : gradeColors[promedioGroupBg[1]]?.text,
                    },
                  ]}
                >
                  {subjectGradesGroups[1]?.length !== 0 &&
                  subjectGrades.length > 0
                    ? promedioGroup[1]
                    : "-"}
                </Text>
              </View>
              <View
                style={[
                  styles.promedioType,
                  {
                    borderRadius: 10,
                    backgroundColor:
                      subjectGradesGroups[2]?.length == 0 ||
                      subjectGrades.length == 0
                        ? "#d3d3d3"
                        : gradeColors[promedioGroupBg[2]]?.color,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.promedioTypeText,
                    {
                      color:
                        subjectGradesGroups[2]?.length == 0 ||
                        subjectGrades.length == 0
                          ? "#000"
                          : gradeColors[promedioGroupBg[2]]?.text,
                    },
                  ]}
                >
                  Oral
                </Text>
                <Text
                  style={[
                    styles.promedioTypeText,
                    {
                      color:
                        subjectGradesGroups[2]?.length == 0 ||
                        subjectGrades.length == 0
                          ? "#000"
                          : gradeColors[promedioGroupBg[2]]?.text,
                    },
                  ]}
                >
                  {subjectGradesGroups[2]?.length !== 0 &&
                  subjectGrades.length > 0
                    ? promedioGroup[2]
                    : "-"}
                </Text>
              </View>
            </View>
          </View>

          {/* Profesor/a */}
          <Text style={styles.sectionTitle}>Profesor/a</Text>
          <View>
            <Teacher
              pressFunction={() => router.push("/(drawer)/teachers")}
              t={teachers[selectedSubject?.teacher || 0]}
            ></Teacher>
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
                .map((g) => (
                  <Grade
                    g={g}
                    pressFunction={() =>
                      router.push("/(drawer)/(grades)/grades")
                    }
                    key={g.id}
                  />
                ))
            ) : (
              <Text style={styles.gradesNoContentText}>Sin notas</Text>
            )}
          </View>

          {/* Próximos exámenes */}
          <Text style={styles.sectionTitle}>Próximos eventos</Text>
          <View>
            {exams.filter(
              (e) => selectedSubject && e.subject === selectedSubject.id
            ).length <= 0 ? (
              <Text style={styles.gradesNoContentText}>Sin eventos</Text>
            ) : (
              exams
                .filter(
                  (e) => selectedSubject && e.subject === selectedSubject.id
                )
                .map((e) => (
                  <Exam
                    key={e.id}
                    e={e}
                    exams={exams}
                    subjects={subjects}
                    pressFunction={() => {
                      router.push("/(drawer)/exams");
                    }}
                  />
                ))
            )}
          </View>
        </View>

        <View style={{ height: 100 }}></View>
      </ScrollView>
    </View>
  );
};

export default subjectPage;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: screenHeight,
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
    paddingRight: 20,
    height: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  promedioType: {
    height: "30%",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 10,
    overflow: "hidden",
  },
  promedioTypeText: {
    fontSize: 20,
    backgroundColor: "transparent",
    fontFamily: "InstrumentSans-SemiBold",
  },
  gradesContainer: {
    padding: 10,
    gap: 10,
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
