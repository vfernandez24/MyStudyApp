import ArrowLeft from "@/assets/icons/arrow-left-solid.svg";
import Bell from "@/assets/icons/bell-solid-full.svg";
import Calendar from "@/assets/icons/calendar-regular.svg";
import ChevronDown from "@/assets/icons/chevron-down-solid.svg";
import Save from "@/assets/icons/floppy-disk-solid.svg";
import TimeSand from "@/assets/icons/hourglass-solid.svg";
import Trophy from "@/assets/icons/trophy-solid.svg";
import DescriptionInput from "@/components/form/inputs/Description";
import NameInput from "@/components/form/inputs/Name";
import SubjectInput from "@/components/form/inputs/Subject";
import Select from "@/components/form/select/Select";
import Time from "@/components/form/select/Time";
import { stylesFormCreate } from "@/constants/styles";
import useExamForm from "@/hooks/forms/useExamForm";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Keyboard,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const CreatePage = () => {
  const {
    grades,
    error,
    submit,
    subjects,
    loadData,
    typeForm,
    name,
    date,
    allDay,
    startTime,
    finishedTime,
    subject,
    grade,
    notifications,
    setDate,
    description,
    setName,
    setAllDay,
    setSubject,
    setGrade,
    setNotifications,
    setDescription,
    setFinishedTime,
    setStartTime,
  } = useExamForm();

  const [overlay, setOverlay] = useState<boolean>(false);
  const [overlaySelect, setOverlaySelect] = useState<boolean>(false);
  const [overlayTime, setOverlayTime] = useState<boolean>(false);
  const [overlayType, setOverlayType] = useState<
    "subjects" | "grades" | "notifications"
  >("subjects");

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

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
          grade={grade ?? -1}
          subject={subject}
          grades={grades}
          setGrade={setGrade}
          setSubject={setSubject}
          subjects={subjects}
          notifications={notifications}
          setNotifications={setNotifications}
          typeSelect="subjects"
          allDay={allDay}
          overlayType={overlayType}
          personal={false}
        ></Select>

        {/* Time Input */}
        <Time
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
        />

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
            {typeForm == "create" ? "Crear examen" : "Editar examen"}
          </Text>
          <View style={stylesFormCreate.inputsContainer}>
            <NameInput error={error.name} name={name} setName={setName} />

            <SubjectInput
              error={error}
              subject={subject}
              setSubject={setSubject}
              overlay={overlay}
              setOverlay={setOverlay}
              setOverlaySelect={setOverlaySelect}
              setOverlayType={setOverlayType}
              subjects={subjects}
            />

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
            <DescriptionInput
              description={description}
              setDescription={setDescription}
            />
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CreatePage;
