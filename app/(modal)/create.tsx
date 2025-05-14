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
  Image,
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

      console.log("📚 Subjects:", parsedSubjects);
      console.log("📅 Periods:", parsedPeriods);
      console.log("✅ Grades:", parsedGrades);

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
      loadData();
    }, [])
  );

  const today = new Date();

  // const [name, setName] = useState("");
  const [grade, setGrade] = useState(0);
  const [subject, setSubject] = useState(-1);
  const [date, setDate] = useState(today);
  const [period, setPeriod] = useState(0);
  const [type, setType] = useState<"write" | "oral" | "practical">("write");
  const [description, setDescription] = useState("");

  const [show, setShow] = useState(false);
  const onChange = (_event: any, selectedDate?: Date) => {
    setShow(Platform.OS === "ios");
    if (selectedDate) setDate(selectedDate);
  };

  function checkData() {
    let returnValue: Boolean = false;

    if (grade >= 0 && grade <= 10 && subject !== -1) {
      returnValue = true;
    } else {
      returnValue = false;
      let gradeB = false;
      let subjectB = false;
      if (grade < 0 || grade > 10) {
        gradeB = true;
      }
      if (subject < 0) {
        subjectB = true;
      }

      setError({
        grade: gradeB,
        subject: subjectB,
      });
    }

    return returnValue;
  }

  async function submit() {
    console.log("Boton");
    console.log(grades);
    const isValid = checkData();
    if (isValid) {
      const newGrade: grade = {
        date: date.toISOString().split("T")[0],
        grade: grade,
        id: grades.length + 1,
        period: period,
        subject: subject,
        type: type,
        description: description,
      };

      const newGrades = [...grades, newGrade];
      console.log(newGrades);

      const stringfyGrades = JSON.stringify(newGrades);
      await AsyncStorage.setItem("grades", stringfyGrades);
      console.log("Grades guardadas en AsyncStorage:", stringfyGrades);
      console.log(
        "LocalStorage ('grades'): ",
        await AsyncStorage.getItem("grades")
      );

      router.push("/(drawer)/(grades)/grades");
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.buttonExit}
        onPress={() => router.push("/(drawer)/(grades)/grades")}
      >
        <Image
          tintColor={"#6c98f7"}
          style={styles.buttonExitImg}
          source={require("../../assets/icons/left-arrow.png")}
        />
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
          <Image
            style={styles.buttonAddImg}
            tintColor={"#fff"}
            source={require("@/assets/icons/save.png")}
          ></Image>
        </View>
        <Text style={styles.buttonAddText}>Añadir</Text>
      </TouchableOpacity>

      <View style={styles.form}>
        <View style={styles.inputsContainer}>
          <View style={styles.label}>
            <View style={styles.iconDiv}>
              <Image
                style={styles.icon}
                source={require("@/assets/icons/trophy.png")}
                tintColor="#0b0279"
              ></Image>
            </View>
            <View style={{ width: "100%", position: "relative" }}>
              <TextInput
                onChangeText={(e) => setGrade(Number(e))}
                keyboardType="decimal-pad"
                style={[
                  styles.input,
                  {
                    borderColor: error.grade == true ? "#f00" : "#d3d3d3",
                  },
                ]}
              ></TextInput>
              {!error.grade && (
                <Image
                  source={require("@/assets/icons/info.png")}
                  tintColor={"#f00"}
                  style={{
                    height: 30,
                    width: 30,
                    position: "absolute",
                    top: 0,
                    transform: "translateY(-50%)",
                    right: 10,
                    zIndex: 20,
                  }}
                />
              )}
            </View>
          </View>

          <View style={styles.label}>
            <View style={styles.iconDiv}>
              <Image
                tintColor="#0b0279"
                source={require("@/assets/icons/pages/notes.png")}
                style={styles.icon}
              ></Image>
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
              <Image
                style={styles.icon}
                source={require("@/assets/icons/pages/subjects.png")}
                tintColor="#0b0279"
              ></Image>
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
              {!error.subject && (
                <Image
                  source={require("@/assets/icons/info.png")}
                  tintColor={"#f00"}
                  style={{
                    height: 30,
                    width: 30,
                    position: "absolute",
                    top: 0,
                    transform: "translateY(-50%)",
                    right: 10,
                    zIndex: 20,
                  }}
                />
              )}
            </View>
          </View>
        </View>

        <View style={styles.inputsContainer}>
          <View style={styles.label}>
            <View style={styles.iconDiv}>
              <Image
                style={styles.icon}
                source={require("@/assets/backgrounds/calendar.png")}
                tintColor={"#0b0279"}
              ></Image>
            </View>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShow(true)}
            >
              <Text style={styles.inputText}>
                {date.toISOString().split("T")[0]}
              </Text>
            </TouchableOpacity>
            {show && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onChange}
              />
            )}
          </View>

          <View style={styles.label}>
            <View style={styles.iconDiv}>
              <Image
                style={styles.icon}
                source={require("@/assets/icons/pages/calendar.png")}
                tintColor={"#0b0279"}
              ></Image>
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
              <Image
                style={styles.icon}
                tintColor="#0b0279"
                source={require("@/assets/icons/tag.png")}
              ></Image>
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

        {/* <View style={styles.label}>
          <View style={styles.iconDiv}>
            <Image
              tintColor="#0b0279"
              source={require("@/assets/icons/keys.png")}
              style={styles.icon}
            ></Image>
          </View>
          <TextInput style={styles.input}></TextInput>
        </View> */}
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
  buttonExitImg: {
    height: 30,
    objectFit: "contain",
  },
  buttonAdd: {
    height: 45,
    width: 142,
    alignSelf: "flex-end",
    flexDirection: "row",
    padding: 10,
    borderRadius: 15,
    backgroundColor: "#0b0279",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonAddImg: {
    objectFit: "contain",
    height: 30,
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
    gap: 10
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
