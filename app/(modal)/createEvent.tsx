import AlignLeft from "@/assets/icons/align-left-solid.svg";
import ArrowLeft from "@/assets/icons/arrow-left-solid.svg";
import Bell from "@/assets/icons/bell-solid-full.svg";
import Calendar from "@/assets/icons/calendar-regular.svg";
import ChevronDown from "@/assets/icons/chevron-down-solid.svg";
import Save from "@/assets/icons/floppy-disk-solid.svg";
import Cap from "@/assets/icons/graduation-cap-solid.svg";
import TimeSand from "@/assets/icons/hourglass-solid.svg";
import Tag from "@/assets/icons/tag-solid.svg";
import Trophy from "@/assets/icons/trophy-solid.svg";
import Select from "@/components/inputs/Select";
import { defaultEvents } from "@/constants/calendarConstants";
import colors from "@/constants/colors";
import { defaultSubjects } from "@/constants/defaultValues";
import { stylesFormCreate } from "@/constants/styles";
import { event, notification, subject } from "@/constants/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

function dateToStore(d?: Date | null) {
  if (!d) return undefined;
  return {
    y: d.getFullYear(),
    m: d.getMonth(),
    d: d.getDate(),
    h: d.getHours(),
    min: d.getMinutes(),
    s: d.getSeconds(),
  };
}

function fromStoredDate(v: any): Date | undefined {
  if (!v) return undefined;

  if (typeof v === "string") {
    const d = new Date(v);
    if (!isNaN(d.getTime())) return d;
  }

  if (
    typeof v === "object" &&
    v.y !== undefined &&
    v.m !== undefined &&
    v.d !== undefined
  ) {
    return new Date(v.y, v.m, v.d, v.h ?? 0, v.min ?? 0, v.s ?? 0);
  }
  return undefined;
}

const createEvent = () => {
  const today = new Date();
  const [subjects, setSubjects] = useState<subject[]>([]);
  const [events, setEvents] = useState<event[]>([]);

  useEffect(() => {
    async function getData() {
      const startTimeDefault = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        12,
        0,
        0,
        0
      );
      const finishedTimeSDefault = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        13,
        0,
        0,
        0
      );

      const eventsAwait = await AsyncStorage.getItem("events");
      const parsedEvents: event[] = eventsAwait
        ? JSON.parse(eventsAwait)
        : defaultEvents;
      const normalizedEvents = parsedEvents.map((event) => ({
        ...event,
        startTime: fromStoredDate(event.startTime) ?? startTimeDefault,
        finishedTime:
          fromStoredDate(event.finishedTime) ?? finishedTimeSDefault,
      }));
      setEvents(normalizedEvents);

      const subjectsAwait = await AsyncStorage.getItem("subjects");
      const parsedSubjects: subject[] = subjectsAwait
        ? JSON.parse(subjectsAwait)
        : defaultSubjects;
      setSubjects(parsedSubjects);

      const typeFormA = await AsyncStorage.getItem("typeEvent");
      const idEditEv = await AsyncStorage.getItem("idEditEv");
      setTypeForm(typeFormA === "create" ? "create" : "edit");
      setEditId(Number(idEditEv));
    }
    getData();
  }, []);

  const [overlay, setOverlay] = useState<boolean>(false);
  const [overlaySelect, setOverlaySelect] = useState<boolean>(false);
  const [overlayTime, setOverlayTime] = useState<boolean>(false);
  const [overlayType, setOverlayType] = useState<
    "subjects" | "grades" | "notifications"
  >("subjects");

  const [error, setError] = useState<{
    name: boolean;
  }>({
    name: false,
  });

  const [name, setName] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [allDay, setAllDay] = useState<boolean>(true);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [finishedTime, setFinishedTime] = useState<Date>(new Date());
  const [subject, setSubject] = useState<number | undefined>(undefined);
  const [types, setType] = useState<"personal" | "job" | number | "other">(
    "personal"
  );
  const [color, setColor] = useState<number>(0);
  const [notifications, setNotifications] = useState<notification[]>([]);
  const [description, setDescription] = useState<string | undefined>();

  const [typeForm, setTypeForm] = useState<"create" | "edit">("create");
  const [editId, setEditId] = useState<number | undefined>(undefined);

  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<"time" | "date">("date");
  const onChange = (_event: any, selectedDate?: Date) => {
    setShow(Platform.OS === "ios");
    if (selectedDate)
      setDate(
        new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate()
        )
      );
  };

  useEffect(() => {
    if (allDay) {
      setNotifications((n) => n.filter((n) => n.time >= 24 * 60 * 60 * 1000));
    }
  }, [allDay]);

  function checkData() {
    const isNameValid = name !== "";

    setError({
      name: !isNameValid,
    });

    return isNameValid;
  }

  async function submit() {
    let newEvents: event[] = events;
    const isValid = checkData();
    let id: number = events.length > 0 ? events[events.length - 1].id + 1 : 0;
    if (typeForm !== "create") {
      id = editId ?? 0;
    }
    if (isValid) {
      const newEvent: event = {
        allDay: allDay,
        color: color,
        finishedTime: finishedTime,
        name: name,
        notifications: notifications,
        startTime: startTime,
        type: types,
        description: description,
        subject: subject,
        id: id,
      };
      if (typeForm == "create") {
        newEvents = [...events, newEvent];
      } else {
        newEvents = events.map((event) =>
          event.id === editId ? newEvent : event
        );
      }

      let today = new Date(startTime || date);
      const oldNotifications = await AsyncStorage.getItem(
        "eventsNotificationsDate"
      );
      const parsedOldNotifications: { date: string; id: number }[] =
        oldNotifications ? JSON.parse(oldNotifications) : [];
      const normalizedNotifications: { date: Date; id: number }[] =
        parsedOldNotifications.map((n) => ({
          ...n,
          date: fromStoredDate(n.date) ?? new Date(),
        }));
      const awaitUserStudyTime = await AsyncStorage.getItem("userStudyTime");
      const userStudyTime = awaitUserStudyTime
        ? JSON.parse(awaitUserStudyTime)
        : [17, 0, 0];
      const newNotifications: { date: Date; id: number }[] = notifications.map(
        (n) => {
          let newNot;
          if (allDay) {
            const newDate = new Date(date.getTime() - n.time);
            newNot = {
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
          } else {
            let newDate = new Date(today.getTime() - n.time);
            if (newDate.getHours() < 6) {
              newDate.setHours(6, 0, 0, 0);
            }
            if (newDate.getHours() >= 22) {
              newDate.setHours(22, 0, 0, 0);
            }
            newNot = {
              date: newDate,
              id: id,
            };
          }
          return newNot;
        }
      );
      let allNotifications = [...normalizedNotifications, ...newNotifications];
      let seen = new Set<string>();
      let filteredNotifications: { date: Date; id: number }[] = [];
      for (let notif of allNotifications) {
        if (!notif?.date) continue;
        let key = notif.id + "_" + notif.date.getTime();
        if (!seen.has(key)) {
          seen.add(key);
          filteredNotifications.push(notif);
        }
      }
      await AsyncStorage.setItem(
        "eventsNotificationsDate",
        JSON.stringify(
          filteredNotifications.map((n) => ({
            id: n.id,
            date: dateToStore(n.date),
          }))
        )
      );

      const stringfyEvents = JSON.stringify(
        newEvents.map((events) => ({
          ...events,
          startTime: events.startTime
            ? dateToStore(events.startTime)
            : undefined,
          finishedTime: events.finishedTime
            ? dateToStore(events.finishedTime)
            : undefined,
        }))
      );
      await AsyncStorage.setItem("events", stringfyEvents);

      router.back();
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={stylesFormCreate.container}>
        {/* Overlay */}
        <TouchableOpacity
          onPress={() => {
            setOverlay(false);
            setOverlaySelect(false);
            setOverlayTime(false);
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
          subject={subject}
          setSubject={setSubject}
          notifications={notifications}
          setNotifications={setNotifications}
          typeSelect="subjects"
          allDay={allDay}
          overlayType={overlayType}
          personal={false}
        ></Select>

        {/* Time Input */}
        {/*<Time
          allDay={allDay}
          dateExam={date}
          setAllDay={setAllDay}
          finishedTime={finishedTime}
          overlay={overlayTime}
          setOverlay={setOverlay}
          setFinishedTime={setFinishedTime}
          setOverlayTime={setOverlayTime}
          setStartTime={setStartTime}
          startTime={startTime}
        />*/}

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
        <ScrollView style={stylesFormCreate.form}>
          <Text style={stylesFormCreate.formTitle}>
            {typeForm == "create" ? "Crear evento" : "Editar evento"}
          </Text>
          <View style={stylesFormCreate.inputsContainer}>
            <View style={stylesFormCreate.label}>
              <View style={stylesFormCreate.iconDiv}>
                <Tag height={35} width={35} fill="#0b0279" />
              </View>
              <TextInput
                style={{
                  minHeight: "100%",
                  width: "75%",
                  borderWidth: 2,
                  borderRadius: 10,
                  padding: 5,
                  paddingHorizontal: 10,
                  fontSize: 18,
                  fontFamily: "InstrumentSans-Medium",
                  color: "#999",
                  borderColor: error.name == true ? "#f00" : "#d3d3d3",
                }}
                placeholder="Nombre"
                value={name}
                onChangeText={(e) => setName(e)}
              ></TextInput>
            </View>

            <View style={stylesFormCreate.label}>
              <View style={stylesFormCreate.iconDiv}>
                <Cap height={35} width={35} fill="#0b0279" />
              </View>
              <View
                style={{
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
                      if (sel) return sel.name;
                      if (subjects.length > 0 || subject === -1)
                        return "Selecciona asignatura";
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

            <View style={stylesFormCreate.label}>
              <View style={stylesFormCreate.iconDiv}>
                <Trophy height={35} width={35} fill="#0b0279" />
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
                    setOverlayType("grades");
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
                    {(() => {
                      const sel = grades.find((g) => g.id == grade);
                      if (sel) return sel.grade;
                      if (grade === -1 || grade === undefined)
                        return "Sin calificación";
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
                style={stylesFormCreate.input}
                onPress={() => {
                  setShow(true);
                  setMode("date");
                  Keyboard.dismiss();
                }}
              >
                <Text style={stylesFormCreate.inputText}>
                  {date.toISOString().split("T")[0]}
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
              {show && (
                <DateTimePicker
                  value={new Date(date)}
                  mode={mode}
                  display="default"
                  onChange={onChange}
                />
              )}
            </View>

            <TouchableOpacity
              style={stylesFormCreate.label}
              onPress={Keyboard.dismiss}
            >
              <View style={stylesFormCreate.iconDiv}>
                <TimeSand height={35} width={35} fill="#0b0279" />
              </View>
              <TouchableOpacity
                style={stylesFormCreate.input}
                onPress={() => {
                  setOverlay(true);
                  setOverlayTime(true);
                  Keyboard.dismiss();
                }}
              >
                <Text style={stylesFormCreate.inputText}>
                  {allDay
                    ? "Todo el día"
                    : startTime && finishedTime
                    ? `${startTime.getHours()}:${startTime
                        .getMinutes()
                        .toString()
                        .padStart(2, "0")}  -  ${finishedTime
                        .getHours()
                        .toString()
                        .padStart(2, "0")}:${finishedTime
                        .getMinutes()
                        .toString()
                        .padStart(2, "0")}`
                    : ""}
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
            </TouchableOpacity>

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
            <View style={stylesFormCreate.label}>
              <View style={stylesFormCreate.iconDiv}>
                <AlignLeft height={35} width={35} fill="#0b0279" />
              </View>
              <TextInput
                style={{
                  minHeight: "100%",
                  width: "75%",
                  borderWidth: 2,
                  borderRadius: 10,
                  padding: 5,
                  paddingHorizontal: 10,
                  borderColor: "#d3d3d3",
                  fontSize: 18,
                  fontFamily: "InstrumentSans-Medium",
                  color: "#999",
                }}
                placeholder="Descripción (Opcional)"
                value={description}
                onChangeText={(e) => setDescription(e)}
              ></TextInput>
            </View>
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default createEvent;

const styles = StyleSheet.create({});
