import Past from "@/assets/icons/clock-rotate-left-solid-full.svg";
import Future from "@/assets/icons/clock-solid-full.svg";
import Plus from "@/assets/icons/plus-solid.svg";
import RotatingChevron from "@/components/common/ChevronAnimated";
import PageTitle from "@/components/common/PageTitle";
import AlertDelete from "@/components/listPages/AlertDelete";
import Exam from "@/components/listPages/Exam";
import OverlayExams from "@/components/overlays/OverlayExams";
import {
  defaultExams,
  defaultGrades,
  defaultSubjects,
} from "@/constants/defaultValues";
import months from "@/constants/months";
import { exam, grade, subject } from "@/constants/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
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

const exams = () => {
  const [subjects, setSubjects] = useState<subject[]>([]);
  const [grades, setGrades] = useState<grade[]>([]);
  const [exams, setExams] = useState<exam[]>([]);
  useFocusEffect(
    useCallback(() => {
      const loadEvents = async () => {
        const examsAwait = await AsyncStorage.getItem("exams");
        const parsedExams: exam[] = examsAwait
          ? JSON.parse(examsAwait, (key, value) => {
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

        const subjectsAwait = await AsyncStorage.getItem("subjects");
        const parsedSubjects: subject[] = subjectsAwait
          ? JSON.parse(subjectsAwait)
          : defaultSubjects;
        setSubjects(parsedSubjects);

        const gradesAwait = await AsyncStorage.getItem("grades");
        const parsedGrades: grade[] = gradesAwait
          ? JSON.parse(gradesAwait)
          : defaultGrades;
        setGrades(parsedGrades);
      };
      loadEvents();
    }, [])
  );

  const [pOpen, setPOpen] = useState(false);

  const [overlay, setOverlay] = useState(false);
  const [overlayDiv, setOverlayDiv] = useState(false);
  const [selectedExam, setSelectedExam] = useState<exam | null>(null);
  const [alert, setAlert] = useState(false);

  function examPressed(id: number) {
    setOverlay(true);
    setOverlayDiv(true);
    const selected = exams.find((e) => e.id === id);
    setSelectedExam(selected ? selected : null);
  }

  function closeOverlay() {
    setOverlay(false);
    setOverlayDiv(false);
  }

  function buttonDelete() {
    setAlert(true);
    setOverlayDiv(false);
  }

  async function deleteExam(id: number) {
    const newExams = exams.filter((e) => e.id !== id);
    setExams(newExams);
    const parsed = JSON.stringify(newExams);
    await AsyncStorage.setItem("exams", parsed);
    setSelectedExam(null);
  }

  const now = new Date();
  function splitExamsByDate(exams: exam[]): { past: exam[]; future: exam[] } {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Muy importante: normalizar la fecha actual

    const past: exam[] = [];
    const future: exam[] = [];

    for (const ex of exams) {
      let examDate = new Date(ex.date);
      examDate.setHours(0, 0, 0, 0); // Normalizamos también

      if (examDate < today) {
        past.push(ex);
      } else {
        future.push(ex);
      }
    }

    return { past, future };
  }

  function groupExamsByMonth(
    exams: exam[]
  ): { month: string; exams: exam[] }[] {
    const now = new Date();
    const grouped = new Map<string, exam[]>();

    for (const ex of exams) {
      if (!ex.date) continue;

      const date = new Date(ex.date);
      if (isNaN(date.getTime())) continue;

      const month = date.getMonth(); // 0–11
      const year = date.getFullYear();
      const key = `${month}-${year}`;

      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(ex);
    }

    const result = Array.from(grouped.entries())
      .map(([key, exams]) => ({
        month: key,
        exams: exams.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA.getTime() - dateB.getTime();
        }),
      }))
      .sort((a, b) => {
        const [mA, yA] = a.month.split("-").map(Number);
        const [mB, yB] = b.month.split("-").map(Number);
        return new Date(yA, mA).getTime() - new Date(yB, mB).getTime();
      });

    return result;
  }

  const [pastExams, setPastExams] = useState<exam[]>([]);
  const [futureExams, setFutureExams] = useState<exam[]>([]);

  useEffect(() => {
    const { past, future } = splitExamsByDate(exams);
    setPastExams(past);
    setFutureExams(future);
  }, [exams]);

  interface groupMonth {
    month: string;
    exams: exam[];
  }

  const [pastExamsGroups, setPastExamsGroups] = useState<groupMonth[]>([]);
  const [futureExamsGroups, setFutureExamsGroups] = useState<groupMonth[]>([]);

  useEffect(() => {
    const examsByMonthPast = groupExamsByMonth(pastExams);
    const examsByMonthFuture = groupExamsByMonth(futureExams);

    setPastExamsGroups(examsByMonthPast);
    setFutureExamsGroups(examsByMonthFuture);
  }, [pastExams, futureExams]);

  return (
    <View>
      <TouchableOpacity
        onPress={alert == true ? () => {} : closeOverlay}
        style={[
          styles.overlayBg,
          { display: overlay == true ? "flex" : "none" },
        ]}
      ></TouchableOpacity>

      <OverlayExams
        overlay={overlayDiv}
        subjects={subjects}
        grades={grades}
        selectedExam={selectedExam != null ? selectedExam : null}
        deleteGrade={buttonDelete}
      />

      <AlertDelete
        alert={alert}
        setAlert={setAlert}
        setOverlay={setOverlay}
        functionDel={deleteExam}
        selectedGrade={selectedExam?.id ?? null}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={async () => {
          await AsyncStorage.setItem("typeExam", "create");
          router.push("/(modal)/createExams");
        }}
      >
        <Plus fill="#fff" height={30} width={30} />
      </TouchableOpacity>

      <ScrollView style={styles.container}>
        {/* Title */}
        <View style={styles.containerTitle}>
          <PageTitle title="EXÁMENES"></PageTitle>
        </View>

        {/* Main */}
        <View>
          {/* Pasados */}
          <View style={styles.containerExams}>
            <TouchableOpacity
              onPress={() => setPOpen(!pOpen)}
              style={styles.titleContainerExams}
            >
              <RotatingChevron color="rgba(108, 152, 247, 0.41)" open={pOpen}></RotatingChevron>
              <View style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center"
              }}>
                <Past height={30} width={30} fill="#446DC4" />
                <Text style={styles.titleContainerExamsText}>
                  Ya realizados
                </Text>
              </View>
            </TouchableOpacity>
            <View
              style={[
                styles.containerExamsDivGeneral,
                { display: pOpen == false ? "none" : "flex" },
              ]}
            >
              {pastExamsGroups.map((month) => (
                <View key={month.month} style={styles.containerExamsDivMonth}>
                  <View style={styles.titleMonth}>
                    <Text style={styles.titleMonthText}>
                      {/* Mes */}
                      {months[Number(month.month.split("-")[0])].large}{" "}
                      {/* Año? */}
                      {Number(month.month.split("-")[1]) == now.getFullYear()
                        ? ""
                        : month.month.split("-")[1]}
                    </Text>
                    <View style={styles.titleMonthLine}></View>
                  </View>
                  <View style={styles.containerExamsMonth}>
                    {month.exams.map((e) => (
                      <Exam
                        exams={exams}
                        e={e}
                        subjects={subjects}
                        pressFunction={() => examPressed(e.id)}
                        key={e.id}
                      />
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Próximos */}
          <View style={styles.containerExams}>
            <View style={styles.titleContainerExams}>
              <View></View>
              <View style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center"
              }}>
                <Future height={30} width={30} fill="#446DC4" />
                <Text style={styles.titleContainerExamsText}>Por venir</Text>
              </View>
            </View>
            <View
              style={[styles.containerExamsDivGeneral, { display: "flex" }]}
            >
              {futureExamsGroups.map((month) => (
                <View key={month.month} style={styles.containerExamsDivMonth}>
                  <View style={styles.titleMonth}>
                    <Text style={styles.titleMonthText}>
                      {/* Mes */}
                      {months[Number(month.month.split("-")[0])].large}{" "}
                      {/* Año? */}
                      {Number(month.month.split("-")[1]) == now.getFullYear()
                        ? ""
                        : month.month.split("-")[1]}
                    </Text>
                    <View style={styles.titleMonthLine}></View>
                  </View>
                  <View style={styles.containerExamsMonth}>
                    {month.exams.map((e) => (
                      <Exam
                        exams={exams}
                        e={e}
                        subjects={subjects}
                        pressFunction={() => examPressed(e.id)}
                        key={e.id}
                      />
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={{ height: 100 }}></View>

        <TouchableOpacity
          onPress={async () => {
            await AsyncStorage.removeItem("exams");
            setExams(defaultExams);
          }}
          style={styles.deleteAllButton}
        >
          <Text style={styles.deleteAllButtonText}>
            Eliminar todos los exámenes
          </Text>
        </TouchableOpacity>

        <View style={{ height: 100 }}></View>
      </ScrollView>
    </View>
  );
};

export default exams;

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
  containerTitle: {
    marginBottom: 10,
  },
  containerExams: {
    marginBottom: 50,
  },
  titleContainerExams: {
    height: 60,
    width: "100%",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 10,
    borderBottomWidth: 2,
    borderColor: "#b4b4b4ff",
  },
  titleContainerExamsText: {
    fontFamily: "InstrumentSans-Bold",
    color: "#0b0279",
    fontSize: 30,
  },
  containerExamsDivGeneral: {},
  containerExamsDivMonth: {
    marginBottom: 20,
  },
  titleMonth: {
    flexDirection: "row",
    paddingVertical: 20,
    alignItems: "center",
  },
  titleMonthText: {
    fontFamily: "InstrumentSans-Medium",
    fontSize: 24,
    color: "#555555",
    marginRight: 15,
  },
  titleMonthLine: {
    height: 2,
    backgroundColor: "#888",
    flex: 1,
  },
  containerExamsMonth: {
    gap: 10,
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
  deleteAllButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 20,
    width: "85%",
    alignSelf: "center",
    backgroundColor: "rgba(255, 0, 0, 0.45)",
  },
  deleteAllButtonText: {
    textAlign: "center",
    fontFamily: "InstrumentSans-SemiBold",
    color: "#fff",
    fontSize: 20,
  },
});
