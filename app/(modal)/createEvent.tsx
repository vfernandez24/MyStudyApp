import AlignLeft from "@/assets/icons/align-left-solid.svg";
import ArrowLeft from "@/assets/icons/arrow-left-solid.svg";
import Bell from "@/assets/icons/bell-solid-full.svg";
import Book from "@/assets/icons/book-solid-full.svg";
import Briefcase from "@/assets/icons/briefcase-solid-full.svg";
import Calendar from "@/assets/icons/calendar-regular.svg";
import ChevronDown from "@/assets/icons/chevron-down-solid.svg";
import Others from "@/assets/icons/circle-question-regular-full.svg";
import Save from "@/assets/icons/floppy-disk-solid.svg";
import Cap from "@/assets/icons/graduation-cap-solid.svg";
import Palette from "@/assets/icons/palette-solid-full.svg";
import Shapes from "@/assets/icons/shapes-solid-full.svg";
import Tag from "@/assets/icons/tag-solid.svg";
import Trash from "@/assets/icons/trash-solid.svg";
import User from "@/assets/icons/user-solid.svg";
import Select from "@/components/inputs/Select";
import Time from "@/components/inputs/Time";
import AlertDelete from "@/components/listPages/AlertDelete";
import { defaultEvents } from "@/constants/calendarConstants";
import colors from "@/constants/colors";
import { defaultSubjects } from "@/constants/defaultValues";
import icons from "@/constants/icons";
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
  const [typeDate, setTypeDate] = useState<"start" | "finished">("start");
  const [overlayColor, setOverlayColor] = useState<boolean>(false);
  const [overlayType, setOverlayType] = useState<
    "subjects" | "notifications" | "typeEvents"
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
  const [subject, setSubject] = useState<number | undefined>(-1);
  const [types, setType] = useState<"personal" | "job" | "school" | "other">(
    "school"
  );
  const [color, setColor] = useState<number | undefined>(undefined);
  const [notifications, setNotifications] = useState<notification[]>([]);
  const [description, setDescription] = useState<string | undefined>();

  const [prevStartDate, setPrevStartDate] = useState<string>(
    startTime.toDateString()
  );
  const [prevFinishedDate, setPrevFinishedDate] = useState<string>(
    finishedTime.toDateString()
  );
  const [prevStartTime, setPrevStartTime] = useState<string>(
    `${startTime.getHours()}:${startTime.getMinutes()}`
  );
  const [prevFinishedTime, setPrevFinishedTime] = useState<string>(
    `${finishedTime.getHours()}:${finishedTime.getMinutes()}`
  );

  const [typeForm, setTypeForm] = useState<"create" | "edit">("create");
  const [editId, setEditId] = useState<number | undefined>(undefined);

  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<"time" | "date">("date");
  const onChange = (_event: any, selectedDate?: Date) => {
    setShow(Platform.OS === "ios");
    if (selectedDate)
      switch (typeDate) {
        case "start":
          setPrevStartDate(selectedDate.toDateString());
        case "finished":
          setPrevFinishedDate(selectedDate.toDateString());
      }
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
        color: color ?? 0,
        finishedTime: finishedTime,
        name: name,
        notifications: notifications,
        startTime: startTime,
        type: types,
        description: description,
        subject: subject === -1 ? undefined : subject,
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

  const [alert, setAlert] = useState<boolean>(false);

  function buttonDelete() {
    setAlert(true);
    setOverlay(true);
  }

  async function deleteEv(id: number) {
    if (typeForm === "edit") {
      const newEvents = events.filter((ev) => ev.id !== id);
      setEvents(newEvents);
      const stringfyEvents = JSON.stringify(newEvents);
      await AsyncStorage.setItem("events", stringfyEvents);
    }
    router.back();
  }

  const [typeSelect, setTypeSelect] = useState<"icon" | "color">("color");
  const [icon, setIcon] = useState<number>();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={stylesFormCreate.container}>
        {/* Overlay */}
        <TouchableOpacity
          onPress={() => {
            setOverlay(false);
            setOverlaySelect(false);
            setOverlayTime(false);
            setOverlayColor(false);
          }}
          style={[
            stylesFormCreate.overlay,
            { display: overlay == true ? "flex" : "none" },
          ]}
        ></TouchableOpacity>

        {/* Color Input */}
        <ScrollView
          style={[
            styles.overlayDiv,
            {
              display: overlayColor == true ? "flex" : "none",
              height: typeSelect == "icon" ? 325 : "auto",
            },
          ]}
        >
          <View style={styles.colorsOverlayRow}>
            {typeSelect == "color"
              ? colors
                  .filter((col) => col.id <= 4)
                  .map((col) => (
                    <TouchableOpacity
                      onPress={() => {
                        setColor(col.id), setOverlayColor(false);
                        setOverlay(false);
                      }}
                      style={[styles.colorsOverlayColorDiv]}
                      key={col.id}
                    >
                      <View
                        style={[
                          styles.colorsOverlayColor,
                          { backgroundColor: col.hex },
                        ]}
                      ></View>
                    </TouchableOpacity>
                  ))
              : icons
                  .filter((i) => i.id <= 4)
                  .map((i) => (
                    <TouchableOpacity
                      onPress={() => {
                        setIcon(i.id), setOverlayColor(false);
                        setOverlay(false);
                      }}
                      style={styles.colorsOverlayColorDiv}
                      key={i.id}
                    >
                      {i.icon}
                    </TouchableOpacity>
                  ))}
          </View>
          <View style={styles.colorsOverlayRow}>
            {typeSelect == "color"
              ? colors
                  .filter((col) => col.id <= 9 && col.id > 4)
                  .map((col) => (
                    <TouchableOpacity
                      onPress={() => {
                        setColor(col.id), setOverlayColor(false);
                        setOverlay(false);
                      }}
                      style={[styles.colorsOverlayColorDiv]}
                      key={col.id}
                    >
                      <View
                        style={[
                          styles.colorsOverlayColor,
                          { backgroundColor: col.hex },
                        ]}
                      ></View>
                    </TouchableOpacity>
                  ))
              : icons
                  .filter((i) => i.id <= 9 && i.id > 4)
                  .map((i) => (
                    <TouchableOpacity
                      onPress={() => {
                        setIcon(i.id), setOverlayColor(false);
                        setOverlay(false);
                      }}
                      style={styles.colorsOverlayColorDiv}
                      key={i.id}
                    >
                      {i.icon}
                    </TouchableOpacity>
                  ))}
          </View>
          <View style={styles.colorsOverlayRow}>
            {typeSelect == "color"
              ? colors
                  .filter((col) => col.id <= 14 && col.id > 9)
                  .map((col) => (
                    <TouchableOpacity
                      onPress={() => {
                        setColor(col.id), setOverlayColor(false);
                        setOverlay(false);
                      }}
                      style={[styles.colorsOverlayColorDiv]}
                      key={col.id}
                    >
                      <View
                        style={[
                          styles.colorsOverlayColor,
                          { backgroundColor: col.hex },
                        ]}
                      ></View>
                    </TouchableOpacity>
                  ))
              : icons
                  .filter((i) => i.id <= 14 && i.id > 9)
                  .map((i) => (
                    <TouchableOpacity
                      onPress={() => {
                        setIcon(i.id), setOverlayColor(false);
                        setOverlay(false);
                      }}
                      style={styles.colorsOverlayColorDiv}
                      key={i.id}
                    >
                      {i.icon}
                    </TouchableOpacity>
                  ))}
          </View>
          <View style={styles.colorsOverlayRow}>
            {typeSelect == "color"
              ? colors
                  .filter((col) => col.id <= 19 && col.id > 14)
                  .map((col) => (
                    <TouchableOpacity
                      onPress={() => {
                        setColor(col.id), setOverlayColor(false);
                        setOverlay(false);
                      }}
                      style={[styles.colorsOverlayColorDiv]}
                      key={col.id}
                    >
                      <View
                        style={[
                          styles.colorsOverlayColor,
                          { backgroundColor: col.hex },
                        ]}
                      ></View>
                    </TouchableOpacity>
                  ))
              : icons
                  .filter((i) => i.id <= 19 && i.id > 14)
                  .map((i) => (
                    <TouchableOpacity
                      onPress={() => {
                        setIcon(i.id), setOverlayColor(false);
                        setOverlay(false);
                      }}
                      style={styles.colorsOverlayColorDiv}
                      key={i.id}
                    >
                      {i.icon}
                    </TouchableOpacity>
                  ))}
          </View>
          <View style={styles.colorsOverlayRow}>
            {typeSelect == "color"
              ? colors
                  .filter((col) => col.id > 19)
                  .map((col) => (
                    <TouchableOpacity
                      onPress={() => {
                        setColor(col.id), setOverlayColor(false);
                        setOverlay(false);
                      }}
                      style={[styles.colorsOverlayColorDiv]}
                      key={col.id}
                    >
                      <View
                        style={[
                          styles.colorsOverlayColor,
                          { backgroundColor: col.hex },
                        ]}
                      ></View>
                    </TouchableOpacity>
                  ))
              : icons
                  .filter((i) => i.id > 19 && i.id <= 24)
                  .map((i) => (
                    <TouchableOpacity
                      onPress={() => {
                        setIcon(i.id), setOverlayColor(false);
                        setOverlay(false);
                      }}
                      style={styles.colorsOverlayColorDiv}
                      key={i.id}
                    >
                      {i.icon}
                    </TouchableOpacity>
                  ))}
          </View>

          {typeSelect == "icon" ? (
            <>
              <View style={styles.colorsOverlayRow}>
                {icons
                  .filter((i) => i.id > 24 && i.id <= 29)
                  .map((i) => (
                    <TouchableOpacity
                      onPress={() => {
                        setIcon(i.id), setOverlayColor(false);
                        setOverlay(false);
                      }}
                      style={styles.colorsOverlayColorDiv}
                      key={i.id}
                    >
                      {i.icon}
                    </TouchableOpacity>
                  ))}
              </View>
              <View style={styles.colorsOverlayRow}>
                {icons
                  .filter((i) => i.id > 29 && i.id <= 34)
                  .map((i) => (
                    <TouchableOpacity
                      onPress={() => {
                        setIcon(i.id), setOverlayColor(false);
                        setOverlay(false);
                      }}
                      style={styles.colorsOverlayColorDiv}
                      key={i.id}
                    >
                      {i.icon}
                    </TouchableOpacity>
                  ))}
              </View>
              <View style={styles.colorsOverlayRow}>
                {icons
                  .filter((i) => i.id > 34 && i.id <= 39)
                  .map((i) => (
                    <TouchableOpacity
                      onPress={() => {
                        setIcon(i.id), setOverlayColor(false);
                        setOverlay(false);
                      }}
                      style={styles.colorsOverlayColorDiv}
                      key={i.id}
                    >
                      {i.icon}
                    </TouchableOpacity>
                  ))}
              </View>
              <View style={styles.colorsOverlayRow}>
                {icons
                  .filter((i) => i.id > 39 && i.id <= 44)
                  .map((i) => (
                    <TouchableOpacity
                      onPress={() => {
                        setIcon(i.id), setOverlayColor(false);
                        setOverlay(false);
                      }}
                      style={styles.colorsOverlayColorDiv}
                      key={i.id}
                    >
                      {i.icon}
                    </TouchableOpacity>
                  ))}
              </View>
              <View style={styles.colorsOverlayRow}>
                {icons
                  .filter((i) => i.id > 44 && i.id <= 49)
                  .map((i) => (
                    <TouchableOpacity
                      onPress={() => {
                        setIcon(i.id), setOverlayColor(false);
                        setOverlay(false);
                      }}
                      style={styles.colorsOverlayColorDiv}
                      key={i.id}
                    >
                      {i.icon}
                    </TouchableOpacity>
                  ))}
              </View>
            </>
          ) : null}
          {typeSelect == "icon" ? <View style={{ height: 20 }}></View> : null}
        </ScrollView>

        {/* Select */}
        <Select
          overlay={overlaySelect}
          setOverlay={(id: boolean) => {
            setOverlay(id);
            setOverlaySelect(id);
          }}
          subject={subject}
          subjects={subjects}
          setSubject={setSubject}
          notifications={notifications}
          setNotifications={setNotifications}
          typeSelect={overlayType}
          allDay={allDay}
          overlayType={overlayType}
          personal={false}
        ></Select>

        <AlertDelete
          alert={alert}
          functionDel={deleteEv}
          selectedGrade={editId ?? null}
          setAlert={setAlert}
          setOverlay={setOverlay}
        />

        {/* Time Input */}
        <Time
          allDay={allDay}
          dateExam={date}
          setAllDay={setAllDay}
          finishedTime={(() => {
            const today = new Date();
            const [h, m] = prevFinishedTime.split(":").map(Number);
            return new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate(),
              h,
              m,
              0,
              0
            );
          })()}
          overlay={overlayTime}
          setOverlay={setOverlay}
          setFinishedTime={setFinishedTime}
          setOverlayTime={setOverlayTime}
          setStartTime={setStartTime}
          startTime={(() => {
            const today = new Date();
            const [h, m] = prevStartTime.split(":").map(Number);
            return new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate(),
              h,
              m,
              0,
              0
            );
          })()}
        />

        {/* Button exit */}
        <TouchableOpacity
          style={stylesFormCreate.buttonExit}
          onPress={() => router.back()}
        >
          <ArrowLeft height={35} width={35} fill={"#6C98F7"} />
        </TouchableOpacity>

        {/* Button delete */}
        <TouchableOpacity
          onPress={buttonDelete}
          style={[
            styles.buttonAdd,
            {
              backgroundColor: "rgba(255, 5, 5, 0.27)",
              position: "absolute",
              top: 25,
              right: 122 + 25,
            },
          ]}
        >
          <View
            style={{
              width: 30,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Trash height={22} width={22} fill={"#8B0000"} />
          </View>
          <Text style={[styles.buttonAddText, { color: "#8B0000" }]}>
            Eliminar
          </Text>
        </TouchableOpacity>

        {/* Button submit */}
        <TouchableOpacity onPress={submit} style={styles.buttonAdd}>
          <View
            style={{
              width: 30,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Save height={22} width={22} fill={"#fff"} />
          </View>
          <Text style={styles.buttonAddText}>Guardar</Text>
        </TouchableOpacity>

        {/* FORM */}
        <ScrollView style={stylesFormCreate.form}>
          <Text style={stylesFormCreate.formTitle}>
            {typeForm == "create" ? "Crear evento" : "Editar evento"}
          </Text>

          <View style={styles.inputsContainer}>
            {/* NAME */}
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

            {/* COLOR */}
            <View style={stylesFormCreate.label}>
              <View style={stylesFormCreate.iconDiv}>
                <Palette height={35} width={35} fill="#0b0279" />
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
                    setTypeSelect("color");
                    setOverlayColor(true);
                    setOverlay(true);
                    Keyboard.dismiss();
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingLeft: 0,
                    position: "relative",
                  }}
                >
                  {colors[color ?? -1] ? (
                    <View
                      style={{
                        height: "100%",
                        width: "80%",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        paddingLeft: 10,
                        gap: 10,
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: colors[color ?? -1].hex,
                          width: 25,
                          height: 25,
                          borderRadius: 30,
                        }}
                      ></View>
                      <Text
                        style={{
                          lineHeight: 50,
                          color: "#999",
                          fontSize: 18,
                          fontFamily: "InstrumentSans-Medium",
                          maxWidth: "70%",
                        }}
                        ellipsizeMode="tail"
                        numberOfLines={1}
                      >
                        {colors[color ?? -1].name}
                      </Text>
                    </View>
                  ) : (
                    <View
                      style={{
                        height: "100%",
                        width: "80%",
                        justifyContent: "center",
                        padding: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "InstrumentSans-Medium",
                          fontSize: 18,
                          color: "#999",
                        }}
                      >
                        Selecciona un color
                      </Text>
                    </View>
                  )}
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

            {/* TYPES */}
            <View style={stylesFormCreate.label}>
              <View style={stylesFormCreate.iconDiv}>
                <Shapes height={35} width={35} fill="#0b0279" />
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
                    setOverlayType("typeEvents");
                    Keyboard.dismiss();
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingLeft: 10,
                    position: "relative",
                    gap: 10,
                  }}
                >
                  <View
                    style={{
                      height: 25,
                      width: 25,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {(() => {
                      switch (types) {
                        case "personal":
                          return <User height={30} width={30} fill="#446DC4" />;
                        case "job":
                          return (
                            <Briefcase height={30} width={30} fill="#446DC4" />
                          );
                        case "school":
                          return <Book height={30} width={30} fill="#446DC4" />;
                        case "other":
                          return (
                            <Others height={30} width={30} fill="#446DC4" />
                          );
                      }
                    })()}
                  </View>
                  <Text style={stylesFormCreate.inputText}>
                    {(() => {
                      switch (types) {
                        case "job":
                          return "Trabajo";
                        case "personal":
                          return "Personal";
                        case "school":
                          return "Escuela";
                        case "other":
                          return "Otros";
                      }
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

            {/* SUBJECT? */}
            <View
              style={[
                stylesFormCreate.label,
                { display: types === "school" ? "flex" : "none" },
              ]}
            >
              <View style={stylesFormCreate.iconDiv}>
                <Cap height={35} width={35} fill="#0b0279" />
              </View>
              <View
                style={{
                  borderWidth: 2,
                  borderColor: "#d3d3d3",
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
          </View>

          <View style={stylesFormCreate.inputsContainer}>
            {/* START TIME */}
            <View style={stylesFormCreate.label}>
              <View
                style={[
                  { position: "relative", top: 35 },
                  stylesFormCreate.iconDiv,
                ]}
              >
                <Calendar height={35} width={35} fill="#0b0279" />
              </View>
              <TouchableOpacity
                style={[
                  stylesFormCreate.input,
                  {
                    width: "35%",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                ]}
                onPress={() => {
                  setShow(true);
                  setMode("date");
                  Keyboard.dismiss();
                }}
              >
                <Text style={stylesFormCreate.inputText}>
                  {startTime.toISOString().split("T")[0]}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  stylesFormCreate.input,
                  {
                    width: "35%",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                ]}
                onPress={() => {
                  setOverlay(true);
                  setOverlayTime(true);
                  Keyboard.dismiss();
                }}
              >
                <Text style={stylesFormCreate.inputText}>
                  {allDay
                    ? "Todo el día"
                    : `${startTime
                        .getHours()
                        .toString()
                        .padStart(2, "0")}:${startTime
                        .getMinutes()
                        .toString()
                        .padStart(2, "0")}`}
                </Text>
                <View
                  style={{
                    position: "absolute",
                    right: 10,
                  }}
                ></View>
              </TouchableOpacity>
              {show && (
                <DateTimePicker
                  value={
                    typeDate === "start"
                      ? new Date(`${prevStartDate}T12:00:00:000`)
                      : new Date(`${prevFinishedDate}T12:00:00:000`)
                  }
                  mode={mode}
                  display="default"
                  onChange={onChange}
                />
              )}
            </View>

            {/* FINISH TIME */}
            <TouchableOpacity
              style={stylesFormCreate.label}
              onPress={Keyboard.dismiss}
            >
              <View style={stylesFormCreate.iconDiv}></View>
              <TouchableOpacity
                style={[
                  stylesFormCreate.input,
                  {
                    width: "35%",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                ]}
                onPress={() => {
                  setShow(true);
                  setMode("date");
                  Keyboard.dismiss();
                }}
              >
                <Text style={stylesFormCreate.inputText}>
                  {date.toISOString().split("T")[0]}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  stylesFormCreate.input,
                  {
                    width: "35%",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                ]}
                onPress={() => {
                  setOverlay(true);
                  setOverlayTime(true);
                  Keyboard.dismiss();
                }}
              >
                <Text style={stylesFormCreate.inputText}>
                  {allDay
                    ? "Todo el día"
                    : `${finishedTime
                        .getHours()
                        .toString()
                        .padStart(2, "0")}:${finishedTime
                        .getMinutes()
                        .toString()
                        .padStart(2, "0")}`}
                </Text>
                <View
                  style={{
                    position: "absolute",
                    right: 10,
                  }}
                ></View>
              </TouchableOpacity>
            </TouchableOpacity>

            {/* NOTIFICATIONS */}
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
            {/* DESCRIPTION */}
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

const styles = StyleSheet.create({
  inputsContainer: {
    paddingBottom: 45,
    gap: 10,
  },
  buttonAdd: {
    height: 50,
    width: 122,
    alignSelf: "flex-end",
    flexDirection: "row",
    padding: 10,
    borderRadius: 15,
    backgroundColor: "#0b0279",
    alignItems: "center",
    justifyContent: "space-around",
  },
  buttonAddText: {
    width: "60%",
    height: 50,
    lineHeight: 55,
    fontSize: 17,
    color: "#fff",
    fontFamily: "InstrumentSans-SemiBold",
  },
  overlayDiv: {
    position: "absolute",
    zIndex: 25,
    width: "auto",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    display: "flex",
    gap: 15,
    top: "50%",
    left: "50%",
    transform: [{ translateX: "-40%" }, { translateY: "-40%" }],
    paddingBottom: 20,
  },
  colorsOverlayRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    paddingVertical: 10,
  },
  colorsOverlayColorDiv: {
    backgroundColor: "#ececec",
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  colorsOverlayColor: {
    height: 30,
    width: 30,
    borderRadius: "100%",
  },
});
