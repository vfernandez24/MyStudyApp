import ArrowLeft from "@/assets/icons/arrow-left-solid.svg";
import Periods from "@/assets/icons/calendar-days-solid.svg";
import Calendar from "@/assets/icons/calendar-regular.svg";
import Save from "@/assets/icons/floppy-disk-solid.svg";
import Cap from "@/assets/icons/graduation-cap-solid.svg";
import Pen from "@/assets/icons/pen-solid.svg";
import Tag from "@/assets/icons/tag-solid.svg";
import Trophy from "@/assets/icons/trophy-solid.svg";
import Weight from "@/assets/icons/weight-hanging-solid.svg";
import { colors } from "@/constants/colors";
import {
  defaultGrades,
  defaultPeriods,
  defaultSubjects,
} from "@/constants/defaultValues";
import { grade, period, subject } from "@/constants/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const CreatePage = () => {
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
          // Carga subjects, periods y grades
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

    if (isValid) {
      const newGrade: grade = {
        date: date,
        grade: grade,
        id: grades.length + 1,
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

      router.push("/(drawer)/(grades)/grades");
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.buttonExit}
        onPress={() => router.push("/(drawer)/(grades)/grades")}
      >
        <ArrowLeft height={45} width={45} fill={"#6C98F7"} />
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
              }}
              placeholder="Descripcion (opcional)"
              value={description}
              onChangeText={(e) => setDescription(e)}
            ></TextInput>
          </View>

          <View style={styles.label}>
            <View style={styles.iconDiv}>
              <Cap height={35} width={35} fill="#0b0279" />
            </View>
            <View
              style={{
                borderColor: error.subject == true ? "#f00" : "#d3d3d3",
                borderWidth: 2,
                width: "75%",
                borderRadius: 10,
              }}
            >
              <Picker
                selectedValue={subject}
                style={{
                  width: "100%",
                  height: "100%",
                  paddingHorizontal: 10,
                  borderColor: "#d3d3d3",
                  fontSize: 18,
                  fontFamily: "InstrumentSans-Medium",
                }}
                onValueChange={(e) => setSubject(e)}
              >
                <Picker.Item label={""} value={-1} />
                {subjects.map((sub, index) => (
                  <Picker.Item
                    label={sub.name}
                    key={index}
                    color={String(colors[sub.color])}
                    value={sub.id}
                    fontFamily="InstrumentSans-Medium"
                  />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        <View style={styles.inputsContainer}>
          <View style={styles.label}>
            <View style={styles.iconDiv}>
              <Calendar height={35} width={35} fill="#0b0279" />
            </View>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShow(true)}
            >
              <Text style={styles.inputText}>{date}</Text>
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

          <View style={styles.label}>
            <View style={styles.iconDiv}>
              <Periods height={35} width={35} fill="#0b0279" />
            </View>
            <View
              style={{
                borderColor: "#d3d3d3",
                borderWidth: 2,
                borderRadius: 10,
                width: "75%",
                padding: 0,
                overflow: "visible",
              }}
            >
              <Picker
                selectedValue={period}
                style={{
                  width: "100%",
                  height: "100%",
                  paddingHorizontal: 10,
                  borderColor: "#d3d3d3",
                  overflow: "visible",
                  fontSize: 18,
                  fontFamily: "InstrumentSans-Medium",
                }}
                onValueChange={(e) => setPeriod(e)}
              >
                {periods.map((per, index) => (
                  <Picker.Item label={per.name} key={index} value={per.id} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.label}>
            <View style={styles.iconDiv}>
              <Tag height={35} width={35} fill="#0b0279" />
            </View>
            <View
              style={{
                borderColor: "#d3d3d3",
                borderWidth: 2,
                borderRadius: 10,
                width: "75%",
              }}
            >
              <Picker
                selectedValue={type}
                style={{
                  width: "100%",
                  height: "100%",
                  paddingHorizontal: 10,
                  fontSize: 18,
                  fontFamily: "InstrumentSans-Medium",
                }}
                onValueChange={(e) => setType(e)}
              >
                <Picker.Item label={"Escrito"} value={"write"} />
                <Picker.Item label={"Oral"} value={"oral"} />
                <Picker.Item label={"Práctico"} value={"practical"} />
              </Picker>
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
  );
};

export default CreatePage;

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
  },
  inputText: {
    lineHeight: 50,
  },
});
