import InProcess from "@/assets/icons/circle-half-stroke-solid-full.svg";
import Pending from "@/assets/icons/circle-regular-full.svg";
import Completed from "@/assets/icons/circle-solid-full.svg";
import Exclamation from "@/assets/icons/exclamation-solid-full.svg";
import Plus from "@/assets/icons/plus-solid.svg";
import RotatingChevron from "@/components/common/ChevronAnimated";
import PageTitle from "@/components/common/PageTitle";
import Task from "@/components/listPages/Task";
import OverlayHomework from "@/components/overlays/OverlayHomework";
import { defaultSubjects, defaultTasks } from "@/constants/defaultValues";
import { subject, task } from "@/constants/types";
import { splitAndSortTasks } from "@/scripts/splitTasks";
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
const screenWidth = Dimensions.get("window").width;
const scrollHeight = screenHeight - 80;

const homework = () => {
  const [tasks, setTasks] = useState<task[]>([]);
  const [subjects, setSubjects] = useState<subject[]>([]);

  useEffect(() => {
    async function getData() {
      const awaitTasks = await AsyncStorage.getItem("homework");
      const parsedTasks: task[] = awaitTasks
        ? JSON.parse(awaitTasks, (key, value) => {
            if (key === "finishedDate") {
              return value ? new Date(value) : undefined;
            }
            return value;
          })
        : defaultTasks;
      setTasks(parsedTasks);

      if (parsedTasks.filter((t) => t.status === "inProgress").length !== 0)
        setIOpen(true);

      const subjectsAwait = await AsyncStorage.getItem("subjects");
      const parsedSubjects: subject[] = subjectsAwait
        ? JSON.parse(subjectsAwait)
        : defaultSubjects;
      setSubjects(parsedSubjects);
    }
    getData();
  }, []);

  const { pendingUrgent, pendingNormal, inProgressUrgent, inProgressNormal } =
    React.useMemo(() => splitAndSortTasks(tasks), [tasks]);

  const [pOpen, setPOpen] = useState(true);
  const [iOpen, setIOpen] = useState(false);
  const [cOpen, setCOpen] = useState(false);

  const [alert, setAlert] = useState(false);
  const [overlay, setOverlay] = useState(false);
  const [overlayDiv, setOverlayDiv] = useState(false);
  const [selectedTask, setSelectedTask] = useState<task | null>(null);

  function taskPressed(id: number) {
    setOverlay(true);
    setOverlayDiv(true);
    const selected = tasks.find((e) => e.id === id);
    setSelectedTask(selected ? selected : null);
  }

  function closeOverlay() {
    setOverlay(false);
    setOverlayDiv(false);
  }

  function deleteTask(id: number) {}
  return (
    <View>
      <TouchableOpacity
        onPress={alert == true ? () => {} : closeOverlay}
        style={[
          styles.overlayBg,
          { display: overlay == true ? "flex" : "none" },
        ]}
      ></TouchableOpacity>

      <TouchableOpacity
        style={styles.addButton}
        onPress={async () => {
          await AsyncStorage.setItem("typeHomework", "create");
          router.push("/(modal)/createHomework");
        }}
      >
        <Plus fill="#fff" height={30} width={30} />
      </TouchableOpacity>

      <OverlayHomework
        overlay={overlayDiv}
        deleteGrade={deleteTask}
        tasks={tasks}
        selectedTask={selectedTask}
        subjects={subjects}
      />

      <ScrollView style={styles.container}>
        {/* Title */}
        <View style={styles.containerTitle}>
          <PageTitle title="TAREAS"></PageTitle>
        </View>

        {/* Main */}
        <View>
          <View style={{ marginBottom: 30 }}>
            <TouchableOpacity
              onPress={() => setPOpen(!pOpen)}
              style={[styles.statusTitleDiv, { backgroundColor: "#ececec" }]}
            >
              <View
                style={{ flexDirection: "row", gap: 24, alignItems: "center" }}
              >
                <Pending height={35} width={35} fill="#555555" />
                <Text style={[styles.statusTitleText, { color: "#555555" }]}>
                  Pendientes
                </Text>
              </View>
              <RotatingChevron color="#555555" open={pOpen}></RotatingChevron>
            </TouchableOpacity>
            <View
              style={[
                styles.statusContainer,
                { display: pOpen ? "flex" : "none" },
              ]}
            >
              <View style={{ marginBottom: 40 }}>
                <View style={styles.titleMonth}>
                  <Exclamation height={35} width={30} fill="#555" />
                  <Text style={styles.titleMonthText}>Urgente</Text>
                  <View style={styles.titleMonthLine}></View>
                </View>
                <View style={styles.containerExamsMonth}>
                  {pendingUrgent.map((task) => (
                    <Task
                      subjects={subjects}
                      pressFunction={() => taskPressed(task.id)}
                      key={task.id}
                      task={task}
                    />
                  ))}
                </View>
              </View>
              {pendingNormal.map((task) => (
                <Task
                  subjects={subjects}
                  pressFunction={() => taskPressed(task.id)}
                  key={task.id}
                  task={task}
                />
              ))}
            </View>
          </View>

          <View style={{ marginBottom: 40 }}>
            <TouchableOpacity
              onPress={() => setIOpen(!iOpen)}
              style={[
                styles.statusTitleDiv,
                { backgroundColor: "rgba(108, 152, 247, 0.36)" },
              ]}
            >
              <View
                style={{ flexDirection: "row", gap: 24, alignItems: "center" }}
              >
                <InProcess height={35} width={35} fill="#0b0279" />
                <Text style={[styles.statusTitleText, { color: "#0b0279" }]}>
                  En proceso
                </Text>
              </View>
              <RotatingChevron color="#0b0279" open={iOpen}></RotatingChevron>
            </TouchableOpacity>
            <View
              style={[
                styles.statusContainer,
                { display: iOpen ? "flex" : "none" },
              ]}
            >
              <View style={{ marginBottom: 30 }}>
                <View style={styles.titleMonth}>
                  <Exclamation height={35} width={35} fill="#555" />
                  <Text style={styles.titleMonthText}>Urgente</Text>
                  <View style={styles.titleMonthLine}></View>
                </View>
                <View style={styles.containerExamsMonth}>
                  {inProgressUrgent.map((task) => (
                    <Task
                      subjects={subjects}
                      pressFunction={() => taskPressed(task.id)}
                      key={task.id}
                      task={task}
                    />
                  ))}
                </View>
              </View>
              {inProgressNormal.map((task) => (
                <Task
                  subjects={subjects}
                  pressFunction={() => taskPressed(task.id)}
                  key={task.id}
                  task={task}
                />
              ))}
            </View>
          </View>

          <View style={{ marginBottom: 30 }}>
            <TouchableOpacity
              onPress={() => setCOpen(!cOpen)}
              style={[
                styles.statusTitleDiv,
                { backgroundColor: "rgba(95, 201, 123, 0.24)" },
              ]}
            >
              <View
                style={{ flexDirection: "row", gap: 24, alignItems: "center" }}
              >
                <Completed height={35} width={35} fill="#078829" />
                <Text style={[styles.statusTitleText, { color: "#078829" }]}>
                  Completadas
                </Text>
              </View>
              <RotatingChevron color="#078829" open={cOpen}></RotatingChevron>
            </TouchableOpacity>
            <View
              style={[
                styles.statusContainer,
                { display: cOpen ? "flex" : "none" },
              ]}
            >
              {tasks.map((task) =>
                task.status === "completed" ? (
                  <Task
                    subjects={subjects}
                    pressFunction={() => taskPressed(task.id)}
                    key={task.id}
                    task={task}
                  />
                ) : null
              )}
            </View>
          </View>
        </View>

        <View style={{ height: 100, width: "100%" }}></View>
      </ScrollView>
    </View>
  );
};

export default homework;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: scrollHeight,
    padding: 15,
    paddingBottom: 200,
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
  statusTitleDiv: {
    height: 60,
    borderRadius: 10,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    flexDirection: "row",
  },
  statusTitleText: {
    fontSize: 24,
    fontFamily: "InstrumentSans-SemiBold",
  },
  statusContainer: { gap: 15, marginVertical: 15 },
  titleMonth: {
    flexDirection: "row",
    paddingVertical: 20,
    alignItems: "center",
    paddingLeft: 10,
  },
  titleMonthText: {
    fontFamily: "InstrumentSans-Medium",
    fontSize: 24,
    color: "#555555",
    marginRight: 15,
    marginLeft: 5,
  },
  titleMonthLine: {
    height: 2,
    backgroundColor: "#888",
    flex: 1,
  },
  containerExamsMonth: {
    gap: 10,
  },
});
