import ArrowLeft from "@/assets/icons/arrow-left-solid.svg";
import Periods from "@/assets/icons/calendar-days-solid.svg";
import Calendar from "@/assets/icons/calendar-regular.svg";
import ChevronDown from "@/assets/icons/chevron-down-solid.svg";
import Save from "@/assets/icons/floppy-disk-solid.svg";
import Tag from "@/assets/icons/tag-solid.svg";
import Trophy from "@/assets/icons/trophy-solid.svg";
import Weight from "@/assets/icons/weight-hanging-solid.svg";
import DescriptionInput from "@/components/form/inputs/Description";
import SubjectInput from "@/components/form/inputs/Subject";
import Select from "@/components/form/select/Select";
import typeGrades from "@/constants/grades";
import { stylesFormCreate } from "@/constants/styles";
import useGradesForm from "@/hooks/forms/useGradesForm";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const CreateGrade = () => {
  const {
    subjects,
    periods,
    grades,
    error,
    fetchData,
    grade,
    setGrade,
    subject,
    setSubject,
    date,
    setDate,
    period,
    setPeriod,
    weight,
    setWeight,
    type,
    setType,
    description,
    setDescription,
    typeForm,
    submit,
  } = useGradesForm();

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );

  const [show, setShow] = useState(false);
  const onChange = (_event: any, selectedDate?: Date) => {
    setShow(Platform.OS === "ios");
    if (selectedDate) setDate(selectedDate.toISOString().split("T")[0]);
  };

  const [overlay, setOverlay] = useState<boolean>(false);
  const [overlayType, setOverlayType] = useState<
    | "subjects"
    | "grades"
    | "periods"
    | "teachers"
    | "typeGrade"
    | "genders"
    | "notifications"
    | "status"
    | "typeEvents"
    | "colors"
    | "icons"
  >("subjects");

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        {/* Overlay */}
        <TouchableOpacity
          onPress={() => setOverlay(false)}
          style={[
            stylesFormCreate.overlay,
            { display: overlay == true ? "flex" : "none" },
          ]}
        ></TouchableOpacity>

        {/* Select */}
        <Select
          overlay={overlay}
          setOverlay={setOverlay}
          gradeDef={grade ?? -1}
          subjectDef={subject}
          grades={grades}
          setGrade={setGrade}
          setSubject={setSubject}
          periodDef={period}
          setPeriod={setPeriod}
          subjects={subjects}
          typeSelect={overlayType}
          setTypeGrade={setType}
          overlayType={overlayType}
        ></Select>

        <TouchableOpacity
          style={styles.buttonExit}
          onPress={() => router.back()}
        >
          <ArrowLeft height={35} width={35} fill={"#6C98F7"} />
        </TouchableOpacity>

        <TouchableOpacity onPress={submit} style={styles.buttonAdd}>
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
          <Text style={styles.buttonAddText}>Guardar</Text>
        </TouchableOpacity>

        <View style={styles.form}>
          <Text style={styles.formTitle}>
            {typeForm == "create" ? "Crear nota" : "Editar nota"}
          </Text>
          <View style={styles.inputsContainer}>
            <View style={styles.label}>
              <View style={styles.iconDiv}>
                <Trophy height={35} width={35} fill={"#0b0279"} />
              </View>
              <View style={{ width: "100%", position: "relative" }}>
                {/* <NumberInput></NumberInput> */}
                <TextInput
                  // TODO             onChangeText={(e) => setGrade(e)}
                  keyboardType="decimal-pad"
                  defaultValue={String(grade)}
                  style={[
                    styles.input,
                    {
                      borderColor: error.grade == true ? "#f00" : "#d3d3d3",
                    },
                  ]}
                ></TextInput>
              </View>
            </View>

            <DescriptionInput
              description={description}
              setDescription={setDescription}
            />

            <SubjectInput
              error={error.subject}
              setOverlay={setOverlay}
              setOverlaySelect={setOverlay}
              setOverlayType={setOverlayType}
              subject={subject}
              subjects={subjects}
            />
          </View>

          <View style={styles.inputsContainer}>
            <View style={styles.label}>
              <View style={styles.iconDiv}>
                <Calendar height={35} width={35} fill="#0b0279" />
              </View>
              <TouchableOpacity
                style={[styles.input, { justifyContent: "center" }]}
                onPress={() => {
                  setShow(true);
                  Keyboard.dismiss();
                }}
              >
                <Text style={stylesFormCreate.inputText}>{date}</Text>
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
                  mode="date"
                  display="default"
                  onChange={onChange}
                />
              )}
            </View>

            <View style={stylesFormCreate.label}>
              <View style={stylesFormCreate.iconDiv}>
                <Periods height={35} width={35} fill="#0b0279" />
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
                    setOverlayType("periods");
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
                    {periods.find((p) => p.id == period)?.name}
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
                <Tag height={35} width={35} fill="#0b0279" />
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
                    setOverlayType("typeGrade");
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
                    {typeGrades[type].text}
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
        </View>
        <View style={styles.label}>
          <View style={styles.iconDiv}>
            <Weight height={35} width={35} fill="#0b0279" />
          </View>
          <TextInput
            value={weight?.toString()}
            onChangeText={(e) => setWeight(Number(e))}
            keyboardType="decimal-pad"
            placeholder="Peso% (opcional)"
            style={styles.input}
          ></TextInput>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CreateGrade;

const styles = StyleSheet.create({
  container: {
    padding: 25,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    minHeight: "100%",
  },
  buttonExit: {
    position: "absolute",
    top: 25,
    left: 25,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    width: 50,
    borderRadius: "100%",
    zIndex: 10,
  },
  buttonAdd: {
    height: 50,
    width: 172,
    alignSelf: "flex-end",
    flexDirection: "row",
    padding: 10,
    borderRadius: 15,
    backgroundColor: "#0b0279",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonAddText: {
    width: "60%",
    height: 50,
    lineHeight: 55,
    fontSize: 20,
    color: "#fff",
    fontFamily: "InstrumentSans-SemiBold",
    letterSpacing: 2,
  },
  form: {
    display: "flex",
    gap: 10,
    paddingTop: 35,
  },
  formTitle: {
    fontFamily: "InstrumentSans-SemiBold",
    fontSize: 35,
    lineHeight: 40,
    marginBottom: 20,
    color: "#446dc4ff",
  },
  inputsContainer: {
    paddingBottom: 55,
    gap: 10,
  },
  label: {
    height: 65,
    width: "100%",
    flexDirection: "row",
    paddingVertical: 5,
    gap: "5%",
  },
  iconDiv: {
    height: "100%",
    width: "20%",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    height: 35,
    objectFit: "contain",
  },
  input: {
    height: "100%",
    width: "75%",
    borderWidth: 2,
    borderRadius: 10,
    padding: 5,
    paddingHorizontal: 10,
    borderColor: "#d3d3d3",
    fontSize: 18,
    fontFamily: "InstrumentSans-Medium",
    color: "#999",
  },
  inputText: {
    lineHeight: 50,
  },
});
