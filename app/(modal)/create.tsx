import { colors } from "@/constants/colors";
import { defaultPeriods, defaultSubjects } from "@/constants/defaultValues";
import { period, subject } from "@/constants/types";
import { saveData } from "@/scripts/data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    const loadData = async () => {
      const subjectsAwait = await AsyncStorage.getItem("subjects");
      const periodsAwait = await AsyncStorage.getItem("periods");
      const parsedSubjects: subject[] = subjectsAwait
        ? JSON.parse(subjectsAwait)
        : defaultSubjects;
      const parsedPeriods: period[] = periodsAwait
        ? JSON.parse(periodsAwait)
        : defaultPeriods;
      setSubjects(parsedSubjects);
      setPeriods(parsedPeriods);
      saveData("subjects", JSON.stringify(parsedSubjects));
      saveData("periods", JSON.stringify(parsedPeriods));
    };
    loadData();
  }, []);

  const today = new Date();

  // const [name, setName] = useState("");
  const [grade, setGrade] = useState(0);
  const [subject, setSubject] = useState(0);
  const [date, setDate] = useState(today);
  const [period, setPeriod] = useState(0);
  const [type, setType] = useState<"write" | "oral" | "practical">("write");
  const [description, setDescription] = useState("");

  const [show, setShow] = useState(false);
  const onChange = (_event: any, selectedDate?: Date) => {
    setShow(Platform.OS === "ios");
    if (selectedDate) setDate(selectedDate);
  };

  function submit() {}

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
        <View style={styles.label}>
          <View style={styles.iconDiv}>
            <Image
              style={styles.icon}
              source={require("@/assets/icons/trophy.png")}
              tintColor="#0b0279"
            ></Image>
          </View>
          <TextInput
            onChangeText={(e) => setGrade(Number(e))}
            keyboardType="decimal-pad"
            style={styles.input}
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
              borderBottomColor: "#d3d3d3",
              borderBottomWidth: 2,
              width: "75%",
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
              {subjects.map((sub, index) => (
                <Picker.Item
                  label={sub.name}
                  key={index}
                  color={String(colors[sub.color])}
                  value={sub.id}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.label}>
          <View style={styles.iconDiv}>
            <Image
              style={styles.icon}
              source={require("@/assets/backgrounds/calendar.png")}
              tintColor={"#0b0279"}
            ></Image>
          </View>
          <TouchableOpacity onPress={() => setShow(true)}>
            <Text>{date.toISOString()}</Text>
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
              borderBottomColor: "#d3d3d3",
              borderBottomWidth: 2,
              width: "75%",
            }}
          >
            <Picker
              selectedValue={period}
              style={{
                width: "100%",
                height: "100%",
                paddingHorizontal: 10,
                borderColor: "#d3d3d3",
                fontSize: 18,
                fontFamily: "InstrumentSans-Medium",
              }}
              onValueChange={(e) => setPeriod(e)}
            >
              {periods.map((per, index) => (
                <Picker.Item label={per.name} key={index} value={per} />
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
              borderBottomColor: "#d3d3d3",
              borderBottomWidth: 2,
              width: "75%",
            }}
          >
            <Picker
              selectedValue={type}
              style={{
                width: "100%",
                height: "100%",
                paddingHorizontal: 10,
                borderColor: "#d3d3d3",
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

        <View style={styles.label}>
          <View style={{}}>
            <Image style={styles.icon}></Image>
          </View>
          <TextInput style={styles.input}></TextInput>
        </View>

        <View style={styles.label}>
          <View style={{}}>
            <Image style={styles.icon}></Image>
          </View>
          <TextInput
            multiline
            numberOfLines={4}
            style={styles.input}
          ></TextInput>
        </View>
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
    paddingTop: 15,
  },
  label: {
    height: 60,
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
    height: 40,
    objectFit: "contain",
  },
  input: {
    height: "100%",
    width: "75%",
    borderBottomWidth: 2,
    padding: 5,
    paddingHorizontal: 10,
    borderColor: "#d3d3d3",
    fontSize: 18,
    fontFamily: "InstrumentSans-Medium",
  },
});
