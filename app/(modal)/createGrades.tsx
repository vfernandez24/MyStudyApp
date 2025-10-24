import ArrowLeft from "@/assets/icons/arrow-left-solid.svg";
import Periods from "@/assets/icons/calendar-days-solid.svg";
import Calendar from "@/assets/icons/calendar-regular.svg";
import ChevronDown from "@/assets/icons/chevron-down-solid.svg";
import Save from "@/assets/icons/floppy-disk-solid.svg";
import Cap from "@/assets/icons/graduation-cap-solid.svg";
import Pen from "@/assets/icons/pen-solid.svg";
import Tag from "@/assets/icons/tag-solid.svg";
import Trophy from "@/assets/icons/trophy-solid.svg";
import Weight from "@/assets/icons/weight-hanging-solid.svg";
import Select from "@/components/inputs/Select";
import colors from "@/constants/colors";
import {
  defaultGrades,
  defaultPeriods,
  defaultSubjects,
} from "@/constants/defaultValues";
import { stylesFormCreate } from "@/constants/styles";
import { grade, period, subject } from "@/constants/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  const [subjects, setSubjects] = useState<subject[]>(defaultSubjects);
  const [periods, setPeriods] = useState<period[]>(defaultPeriods);
  const [grades, setGrades] = useState<grade[]>(defaultGrades);
  const loadData = useCallback(async () => {
    try {
      const subjectsAwait = await AsyncStorage.getItem("subjects");
      const periodsAwait = await AsyncStorage.getItem("periods");
      const gradesAwait = await AsyncStorage.getItem("grades");

      const parsedSubjects: subject[] = subjectsAwait
        ? JSON.parse(subjectsAwait)
        : defaultSubjects;
      const parsedPeriods: period[] = periodsAwait
        ? JSON.parse(periodsAwait)
        : defaultPeriods;
      const parsedGrades: grade[] = gradesAwait
        ? JSON.parse(gradesAwait)
        : defaultGrades;

      setSubjects(parsedSubjects);
      setPeriods(parsedPeriods);
      setGrades(parsedGrades);
    } catch (error) {
      console.error("❌ Error al cargar datos:", error);
    }
  }, []);

  const [error, setError] = useState<{
    grade: boolean;
    subject: boolean;
  }>({
    grade: false,
    subject: false,
  });

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const subjectsAwait = await AsyncStorage.getItem("subjects");
          const periodsAwait = await AsyncStorage.getItem("periods");
          const gradesAwait = await AsyncStorage.getItem("grades");
          const typeFormAwait = await AsyncStorage.getItem("typeGrade");
          const idEditAwait = await AsyncStorage.getItem("idEdit");

          const parsedSubjects: subject[] = subjectsAwait
            ? JSON.parse(subjectsAwait)
            : defaultSubjects;
          const parsedPeriods: period[] = periodsAwait
            ? JSON.parse(periodsAwait)
            : defaultPeriods;
          const parsedGrades: grade[] = gradesAwait
            ? JSON.parse(gradesAwait)
            : defaultGrades;

          setSubjects(parsedSubjects);
          setPeriods(parsedPeriods);
          setGrades(parsedGrades);

          function currentPeriod() {
            const now = new Date();
            let currentPeriod: period | null = null;

            for (const p of periods) {
              if (p.startTime && p.finishTime) {
                if (now >= p.startTime && now <= p.finishTime) {
                  currentPeriod = p;
                  break;
                }
              }
            }
            return currentPeriod?.id;
          }

          setPeriod(currentPeriod() ?? period);

          const formType = typeFormAwait ?? "create";
          setTypeForm(formType);

          if (formType === "edit" && idEditAwait) {
            const id = Number(idEditAwait);
            setEditId(id);

            const current = parsedGrades.find((g) => g.id === id);
            if (current) {
              setGrade(current.grade);
              setSubject(current.subject);
              setDate(current.date);
              setPeriod(current.period);
              setWeight(current.weight ?? null);
              setType(current.type);
              setDescription(current.description ?? "");
            }
          }
        } catch (error) {
          console.error("❌ Error al cargar datos:", error);
        }
      };

      fetchData();
    }, [])
  );

  const today = new Date();
  const [grade, setGrade] = useState(0);
  const [subject, setSubject] = useState(-1);
  const [date, setDate] = useState<string>(today.toISOString().split("T")[0]);
  const [period, setPeriod] = useState(0);
  const [weight, setWeight] = useState<number | null>(null);
  const [type, setType] = useState<"write" | "oral" | "practical">("write");
  const [description, setDescription] = useState("");

  const [typeForm, setTypeForm] = useState<string>("create");
  const [editId, setEditId] = useState<number | null>(null);

  const [show, setShow] = useState(false);
  const onChange = (_event: any, selectedDate?: Date) => {
    setShow(Platform.OS === "ios");
    if (selectedDate) setDate(selectedDate.toISOString().split("T")[0]);
  };

  function currentPeriod() {
    const now = new Date();
    let currentPeriod: period | null = null;

    for (const p of periods) {
      if (p.startTime && p.finishTime) {
        if (now >= p.startTime && now <= p.finishTime) {
          currentPeriod = p;
          break;
        }
      }
    }
    return currentPeriod;
  }

  function checkData() {
    const isGradeValid = grade >= 0 && grade <= 10;
    const isSubjectValid = subject !== -1;

    setError({
      grade: !isGradeValid,
      subject: !isSubjectValid,
    });

    return isGradeValid && isSubjectValid;
  }

  async function submit() {
    let newGrades: grade[] = grades;

    const isValid = checkData();
    const id = grades.length > 0 ? grades[grades.length - 1].id + 1 : 0;

    if (isValid) {
      const newGrade: grade = {
        date: date,
        grade: grade,
        id: id,
        period: period,
        subject: subject,
        type: type,
        description: description,
        weight: weight,
      };
      if (typeForm == "create") {
        newGrades = [...grades, newGrade];
      } else {
        newGrades = grades.map((g) => (g.id === editId ? newGrade : g));
      }

      const stringfyGrades = JSON.stringify(newGrades);
      await AsyncStorage.setItem("grades", stringfyGrades);

      router.back();
    }
  }

  const [overlay, setOverlay] = useState<boolean>(false);
  const [overlayType, setOverlayType] = useState<
    "subjects" | "periods" | "typeGrade"
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
          grade={grade ?? -1}
          subject={subject}
          grades={grades}
          setGrade={setGrade}
          setSubject={setSubject}
          period={period}
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
                <TextInput
                  onChangeText={(e) => setGrade(Number(e))}
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

            <View style={styles.label}>
              <View style={styles.iconDiv}>
                <Pen height={35} width={35} fill="#0b0279" />
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
                placeholder="Descripcion (opcional)"
                value={description}
                onChangeText={(e) => setDescription(e)}
              ></TextInput>
            </View>

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
                    {type == "write"
                      ? "Escrito"
                      : type == "oral"
                      ? "Oral"
                      : "Práctico"}
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
