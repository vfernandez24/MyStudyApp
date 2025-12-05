import ArrowLeft from "@/assets/icons/arrow-left-solid.svg";
import Status from "@/assets/icons/bars-progress-solid-full.svg";
import Bell from "@/assets/icons/bell-solid-full.svg";
import Calendar from "@/assets/icons/calendar-regular.svg";
import ChevronDown from "@/assets/icons/chevron-down-solid.svg";
import InProcess from "@/assets/icons/circle-half-stroke-solid-full.svg";
import Pending from "@/assets/icons/circle-regular-full.svg";
import Completed from "@/assets/icons/circle-solid-full.svg";
import Save from "@/assets/icons/floppy-disk-solid.svg";
import Cap from "@/assets/icons/graduation-cap-solid.svg";
import Trash from "@/assets/icons/trash-solid.svg";
import DescriptionInput from "@/components/form/inputs/Description";
import NameInput from "@/components/form/inputs/Name";
import Select from "@/components/form/select/Select";
import colors from "@/constants/colors";
import { defaultSubjects, defaultTasks } from "@/constants/defaultValues";
import STORAGE_KEYS from "@/constants/storageKeys";
import { stylesFormCreate } from "@/constants/styles";
import { notification, subject, task } from "@/constants/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const createHomework = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [tasks, setTasks] = useState<task[]>([]);
  const [subjects, setSubjects] = useState<subject[]>([]);

  const [name, setName] = useState<string>("");
  const [finishedDate, setFinishedDate] = useState<Date | undefined>(tomorrow);
  const [status, setStatus] = useState<"pending" | "inProgress" | "completed">(
    "pending"
  );
  const [subject, setSubject] = useState<number | "personal">("personal");
  function changeSubject(id: number) {
    if (id === subjects.length + 1) {
      setSubject("personal");
    } else {
      setSubject(id);
    }
  }
  const [notifications, setNotifications] = useState<notification[]>([]);
  const [description, setDescription] = useState<string | undefined>();

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const tasksAwait = await AsyncStorage.getItem(STORAGE_KEYS.TASKS_KEY);
          const subjectsAwait = await AsyncStorage.getItem(
            STORAGE_KEYS.SUBJECTS_KEY
          );
          const typeFormAwait = await AsyncStorage.getItem(
            STORAGE_KEYS.TYPEFORM_KEY
          );
          const idEditAwait = await AsyncStorage.getItem(
            STORAGE_KEYS.ID_TASK_KEY
          );

          const parsedTasks: task[] = tasksAwait
            ? JSON.parse(tasksAwait)
            : defaultTasks;

          const normalizedExams = parsedTasks.map((task) => ({
            ...task,
            finishedDate: task.finishedDate
              ? new Date(task.finishedDate)
              : undefined,
          }));

          const parsedSubjects: subject[] = subjectsAwait
            ? JSON.parse(subjectsAwait)
            : defaultSubjects;

          setTasks(normalizedExams);
          setSubjects(parsedSubjects);

          const formType = typeFormAwait ?? "create";
          setTypeForm(formType);

          if (formType === "edit" && idEditAwait) {
            const id = Number(idEditAwait);
            setEditId(id);

            const current = normalizedExams.find((exam) => exam.id === id); // 👈 cambio aquí
            if (current) {
              setName(current.name);
              setFinishedDate(current.finishedDate);
              setSubject(
                current.subject === "personal" ? "personal" : current.subject
              );
              setDescription(current.description);
            }
          }
        } catch (error) {
          console.error("❌ Error al cargar datos:", error);
        }
      };

      fetchData();
    }, [])
  );

  // Date Input
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<"time" | "date">("date");
  const onChange = (_event: any, selectedDate?: Date) => {
    setShow(Platform.OS === "ios");
    if (selectedDate)
      setFinishedDate(
        new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          12,
          0,
          0
        )
      );
  };

  const [typeForm, setTypeForm] = useState<string>("create");
  const [editId, setEditId] = useState<number | null>(null);

  // Check & Submit
  const [error, setError] = useState<{
    name: boolean;
    subject: boolean;
  }>({
    name: false,
    subject: false,
  });
  function checkData() {
    const isNameValid = name !== "";
    const isSubjectValid = subject !== -1;

    setError({
      name: !isNameValid,
      subject: !isSubjectValid,
    });

    return isNameValid && isSubjectValid;
  }
  async function submit() {
    let newTasks: task[] = tasks;
    const isValid = checkData();
    let id: number = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 0;
    if (typeForm !== "create") {
      id = editId ?? 0;
    }
    if (isValid) {
      const newTask: task = {
        name: name,
        subject: subject,
        description: description,
        notifications: notifications,
        status: status,
        finishedDate: finishedDate,
        id: id,
      };
      if (typeForm == "create") {
        newTasks = [...tasks, newTask];
      } else {
        newTasks = tasks.map((task) => (task.id === editId ? newTask : task));
      }

      if (finishedDate) {
        let today = new Date(finishedDate);
        const oldNotifications = await AsyncStorage.getItem(
          STORAGE_KEYS.TNOTIFICATIONS_KEY
        );
        let parsedOldNotifications: { date: Date; id: number }[] = [];
        if (oldNotifications) {
          try {
            parsedOldNotifications = JSON.parse(oldNotifications);
          } catch (e) {
            console.warn(
              "Error al parsear taskNotificationsDate:",
              oldNotifications
            );
            parsedOldNotifications = [];
          }
        }

        const normalizedNotifications: { date: Date; id: number }[] =
          parsedOldNotifications.map((n) => ({
            ...n,
            date: new Date(n.date),
          }));
        const awaitUserStudyTime = await AsyncStorage.getItem(
          STORAGE_KEYS.USER_STUDYTIME_KEY
        );
        const userStudyTime = awaitUserStudyTime
          ? JSON.parse(awaitUserStudyTime)
          : [17, 0, 0];
        const newNotifications: { date: Date; id: number }[] =
          notifications.map((n) => {
            const newDate = new Date(today.getTime() - n.time);
            const newNot = {
              date: new Date(
                newDate.getFullYear(),
                newDate.getMonth(),
                newDate.getDate(),
                userStudyTime[0],
                userStudyTime[1],
                userStudyTime[2]
              ),
              id: id,
            };
            return newNot;
          });
        let dateNotifications: { date: Date; id: number }[] = [
          ...normalizedNotifications,
          ...newNotifications,
        ];
        const stringfyDates = JSON.stringify(dateNotifications);
        await AsyncStorage.setItem(
          STORAGE_KEYS.TNOTIFICATIONS_KEY,
          stringfyDates
        );
      }

      const stringfyTasks = JSON.stringify(
        newTasks.map((task) => ({
          ...task,
          finishedDate:
            task.finishedDate instanceof Date
              ? task.finishedDate.toISOString()
              : task.finishedDate ?? undefined,
        }))
      );

      await AsyncStorage.setItem(STORAGE_KEYS.TASKS_KEY, stringfyTasks);

      router.back();
    }
  }

  const [overlay, setOverlay] = useState<boolean>(false);
  const [overlayType, setOverlayType] = useState<
    "subjects" | "status" | "notifications"
  >("subjects");
  const [overlaySelect, setOverlaySelect] = useState<boolean>(false);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={stylesFormCreate.container}>
        {/* Overlay */}
        <TouchableOpacity
          onPress={() => {
            setOverlay(false);
            setOverlaySelect(false);
          }}
          style={[
            stylesFormCreate.overlay,
            { display: overlay == true ? "flex" : "none" },
          ]}
        ></TouchableOpacity>

        {/* Select */}
        <Select
          overlay={overlaySelect}
          setOverlay={(id: boolean) => {
            setOverlay(id);
            setOverlaySelect(id);
          }}
          subject={subject === "personal" ? subjects.length + 1 : subject}
          setSubject={changeSubject}
          subjects={subjects}
          personal={true}
          setStatus={setStatus}
          status={status}
          notifications={notifications}
          setNotifications={setNotifications}
          typeSelect="subjects"
          overlayType={overlayType}
          allDay={true}
        ></Select>

        {/* Button exit */}
        <TouchableOpacity
          style={stylesFormCreate.buttonExit}
          onPress={() => router.back()}
        >
          <ArrowLeft height={35} width={35} fill={"#6C98F7"} />
        </TouchableOpacity>

        {/* Button submit */}
        <TouchableOpacity onPress={submit} style={stylesFormCreate.buttonAdd}>
          <View
            style={{
              width: "40%",
              height: 50,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Save height={30} width={30} fill={"#fff"} />
          </View>
          <Text style={stylesFormCreate.buttonAddText}>Guardar</Text>
        </TouchableOpacity>

        {/* FORM */}
        <View style={stylesFormCreate.form}>
          <Text style={stylesFormCreate.formTitle}>
            {typeForm == "create" ? "Crear tarea" : "Editar tarea"}
          </Text>
          <View style={stylesFormCreate.inputsContainer}>
            <NameInput error={error.name} name={name} setName={setName} />

            <View style={stylesFormCreate.label}>
              <View style={stylesFormCreate.iconDiv}>
                <Cap height={35} width={35} fill="#0b0279" />
              </View>
              <View
                style={{
                  borderColor: error.subject == true ? "#f00" : "#d3d3d3",
                  borderWidth: 2,
                  width: "75%",
                  borderRadius: 10,
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setOverlay(true);
                    setOverlaySelect(true);
                    setOverlayType("subjects");
                    Keyboard.dismiss();
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingLeft: 10,
                    position: "relative",
                  }}
                >
                  <View
                    style={{
                      borderRadius: 12.5,
                      backgroundColor: (() => {
                        const sel = subjects.find((s) => s.id == subject);
                        if (sel) return colors[sel.color].hex;
                        if (subject === "personal") return colors[9].hex;
                        if (subjects.length > 0)
                          return colors[subjects[0].color].hex;
                        return "#d3d3d3";
                      })(),
                      height: 25,
                      width: 25,
                      marginRight: 10,
                      display: subject === -1 ? "none" : "flex",
                    }}
                  ></View>
                  <Text style={stylesFormCreate.inputText}>
                    {(() => {
                      const sel = subjects.find((s) => s.id == subject);

                      if (subject === "personal") return "Personal";
                      if (sel) return sel.name;

                      return "Selecciona asignatura";
                    })()}
                  </Text>
                  <View
                    style={{
                      position: "absolute",
                      right: 10,
                    }}
                  >
                    <ChevronDown fill="#6C98F7" height={25} width={25} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={stylesFormCreate.inputsContainer}>
            <View style={stylesFormCreate.label}>
              <View style={stylesFormCreate.iconDiv}>
                <Calendar height={35} width={35} fill="#0b0279" />
              </View>
              <TouchableOpacity
                style={[stylesFormCreate.input, { width: "55%" }]}
                onPress={() => {
                  setShow(true);
                  setMode("date");
                  Keyboard.dismiss();
                }}
              >
                <Text style={stylesFormCreate.inputText}>
                  {finishedDate
                    ? finishedDate?.toISOString().split("T")[0]
                    : "Sin caducidad"}
                </Text>
                <View
                  style={{
                    position: "absolute",
                    right: 10,
                  }}
                >
                  <ChevronDown fill="#6C98F7" height={25} width={25} />
                </View>
              </TouchableOpacity>
              <View
                style={{
                  height: "100%",
                  width: "12.5%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => setFinishedDate(undefined)}
                  style={{}}
                >
                  <Trash height={30} width={30} fill="#446DC4" />
                </TouchableOpacity>
              </View>
              {show && (
                <DateTimePicker
                  value={new Date(finishedDate ?? tomorrow)}
                  mode={mode}
                  display="default"
                  onChange={onChange}
                />
              )}
            </View>

            <View style={stylesFormCreate.label}>
              <View style={stylesFormCreate.iconDiv}>
                <Status height={35} width={35} fill="#0b0279" />
              </View>
              <View
                style={{
                  borderColor: "#d3d3d3",
                  borderWidth: 2,
                  width: "75%",
                  borderRadius: 10,
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setOverlay(true);
                    setOverlaySelect(true);
                    setOverlayType("status");
                    Keyboard.dismiss();
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingLeft: 10,
                    position: "relative",
                  }}
                >
                  {status == "pending" ? (
                    <Pending height={30} width={25} fill="#555" />
                  ) : status == "inProgress" ? (
                    <InProcess height={30} width={25} fill="#0b0279" />
                  ) : (
                    <Completed height={30} width={25} fill="#078829" />
                  )}
                  <Text
                    style={[stylesFormCreate.inputText, { marginLeft: 10 }]}
                  >
                    {status == "pending"
                      ? "Pendiente"
                      : status == "inProgress"
                      ? "En proceso"
                      : "Completada"}
                  </Text>
                  <View
                    style={{
                      position: "absolute",
                      right: 10,
                    }}
                  >
                    <ChevronDown fill="#6C98F7" height={25} width={25} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={stylesFormCreate.label}>
              <View style={stylesFormCreate.iconDiv}>
                <Bell height={35} width={35} fill="#0b0279" />
              </View>
              <View
                style={{
                  borderColor: "#d3d3d3",
                  borderWidth: 2,
                  width: "75%",
                  borderRadius: 10,
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setOverlay(true);
                    setOverlaySelect(true);
                    setOverlayType("notifications");
                    Keyboard.dismiss();
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingLeft: 10,
                    position: "relative",
                  }}
                >
                  <Text style={stylesFormCreate.inputText}>
                    {`${
                      notifications.length !== 0
                        ? String(notifications.length)
                        : "Sin"
                    } ${
                      notifications.length !== 1
                        ? "notificaciones"
                        : "notificación"
                    }`}
                  </Text>
                  <View
                    style={{
                      position: "absolute",
                      right: 10,
                    }}
                  >
                    <ChevronDown fill="#6C98F7" height={25} width={25} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={stylesFormCreate.inputsContainer}>
            <DescriptionInput
              description={description}
              setDescription={setDescription}
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default createHomework;

const styles = StyleSheet.create({});
