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
import {
  stylesFormCreate as styles,
  stylesFormCreate,
} from "@/constants/styles";
import useGradesForm from "@/hooks/forms/useGradesForm";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Keyboard,
  Platform,
  ScrollView,
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
      <ScrollView style={styles.container}>
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
          gradeDef={Number(grade) ?? -1}
          subjectDef={subject}
          grades={grades}
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
            <View
              style={[
                styles.inputContainer,
                grade.length <= 0 ? { height: 90 } : { height: 105 },
              ]}
            >
              <Text
                style={[
                  styles.labelText,
                  grade.length <= 0 ? { display: "none" } : { display: "flex" },
                ]}
              >
                Calificación
              </Text>
              <View style={[styles.label, { height: 90 }]}>
                <View style={styles.iconDiv}>
                  <Trophy height={35} width={35} fill={"#0b0279"} />
                </View>
                <View style={{ width: "100%", position: "relative" }}>
                  <TextInput
                    keyboardType="decimal-pad"
                    defaultValue={String(grade)}
                    onChangeText={(e) => setGrade(e)}
                    placeholder="Calificación"
                    style={[
                      styles.input,
                      {
                        fontSize: grade.length <= 0 ? 25 : 35,
                        letterSpacing: grade.length <= 0 ? 1 : 4,
                        fontFamily: "InstrumentSans-Bold",
                        borderColor: error.grade == true ? "#f00" : "#d3d3d3",
                      },
                    ]}
                  ></TextInput>
                </View>
              </View>
            </View>
            <View
              style={
                error.grade == true &&
                (grade.length == 0 || Number(grade) < 0 || Number(grade) > 10)
                  ? { display: "flex", width: "100%" }
                  : { display: "none" }
              }
            >
              <Text style={styles.errorText}>
                {Number(grade) < 0 || Number(grade) > 10
                  ? "El valor debe estar entre 0 y 10"
                  : grade.length == 0
                    ? "Debe introducir un valor"
                    : ""}
              </Text>
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
        <View style={{ height: 200 }}></View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default CreateGrade;
