import ArrowLeft from "@/assets/icons/arrow-left-solid.svg";
import Save from "@/assets/icons/floppy-disk-solid.svg";
import Trash from "@/assets/icons/trash-solid.svg";
import EventAllDay from "@/components/form/events/EventAllDay";
import EventColor from "@/components/form/events/EventColor";
import EventEndTime from "@/components/form/events/EventEndTime";
import EventNotifications from "@/components/form/events/EventNotifications";
import EventStartTime from "@/components/form/events/EventStartTime";
import EventSubject from "@/components/form/events/EventSubject";
import EventType from "@/components/form/events/EventType";
import DescriptionInput from "@/components/form/inputs/Description";
import NameInput from "@/components/form/inputs/Name";
import Colors from "@/components/form/select/Colors";
import Select from "@/components/form/select/Select";
import AlertDelete from "@/components/UI/AlertDelete";
import {
  eventsFormStyles as styles,
  stylesFormCreate,
} from "@/constants/styles";
import { useEventFormData, useEventFormUI } from "@/hooks/forms/useEventForm";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import React from "react";
import {
  Keyboard,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const createEvent = () => {
  const {
    name,
    setName,
    subjects,
    editId,
    setIcon,
    allDay,
    setAllDay,
    startTime,
    finishedTime,
    subject,
    setSubject,
    types,
    setTypes,
    color,
    setColor,
    notifications,
    setNotifications,
    description,
    setDescription,
    submit,
    deleteEv,
    typeForm,
  } = useEventFormData();

  const {
    alert,
    buttonDelete,
    error,
    onChange,
    onChangeTime,
    overlay,
    overlayColor,
    overlaySelect,
    overlayType,
    setAlert,
    setError,
    setOverlay,
    setOverlayColor,
    setOverlaySelect,
    setOverlayType,
    setShow,
    setShowT,
    setTypeDate,
    show,
    showT,
    typeDate,
  } = useEventFormUI();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={stylesFormCreate.container}>
        {/* Overlay */}
        <TouchableOpacity
          onPress={() => {
            setOverlay(false);
            setOverlaySelect(false);
            setOverlayColor(false);
          }}
          style={[
            stylesFormCreate.overlay,
            { display: overlay == true ? "flex" : "none" },
          ]}
        ></TouchableOpacity>

        {show && (
          <DateTimePicker
            value={typeDate === "start" ? startTime : finishedTime}
            mode={"date"}
            display="default"
            onChange={onChange}
          />
        )}
        {showT && (
          <DateTimePicker
            value={typeDate === "start" ? startTime : finishedTime}
            mode={"time"}
            display="default"
            onChange={onChangeTime}
          />
        )}

        {/* Color Input */}
        <Colors
          overlayColor={overlayColor}
          setColor={setColor}
          setIcon={setIcon}
          setOverlay={setOverlay}
          setOverlayColor={setOverlayColor}
          typeSelect={"color"}
        />

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
          typeEvents={types}
          setTypeEvents={setTypes}
          personal={false}
        ></Select>

        <AlertDelete
          alert={alert}
          functionDel={deleteEv}
          selectedGrade={editId ?? null}
          setAlert={setAlert}
          setOverlay={setOverlay}
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
            <NameInput name={name} setName={setName} error={error} />

            <EventColor
              setOverlay={setOverlayColor}
              setOverlayColor={setOverlayColor}
              color={color ?? 0}
            />

            <EventType
              types={types}
              setTypes={setTypes}
              setOverlay={setOverlay}
              setOverlaySelect={setOverlaySelect}
              setOverlayType={setOverlayType}
            />

            <EventSubject
              isVisible={types === "school"}
              subjects={subjects}
              subject={subject ?? 0}
              setOverlay={setOverlay}
              setOverlaySelect={setOverlaySelect}
              setOverlayType={setOverlayType}
            />
          </View>

          <View style={stylesFormCreate.inputsContainer}>
            <EventAllDay allDay={allDay} setAllDay={setAllDay} />

            <EventStartTime
              setShow={setShow}
              setTypeDate={setTypeDate}
              startTime={startTime}
              allDay={allDay}
              setShowT={setShowT}
            />

            <EventEndTime
              setShow={setShow}
              setTypeDate={setTypeDate}
              finishedTime={finishedTime}
              allDay={allDay}
              setShowT={setShowT}
            />

            <EventNotifications
              setShow={setShow}
              setShowT={setShowT}
              setTypeDate={setTypeDate}
              finishedTime={finishedTime}
              allDay={allDay}
              notifications={notifications}
              setOverlay={setOverlay}
              setOverlaySelect={setOverlaySelect}
              setOverlayType={setOverlayType}
            />
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

export default createEvent;
