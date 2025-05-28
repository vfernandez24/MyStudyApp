import ChevronRight from "@/assets/icons/chevron-right-solid.svg";
import colors from "@/constants/colors";
import { defaultTeachers } from "@/constants/defaultValues";
import icons from "@/constants/icons";
import { subject, teacher } from "@/constants/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Subject = (s: subject) => {
  const [teachers, setTeachers] = useState<teacher[]>(defaultTeachers);
  const [teacher, setTeacher] = useState<teacher>();
  useEffect(() => {
    const loadEvents = async () => {
      const gradesAwait = await AsyncStorage.getItem("teachers");
      const parsedSubjects: teacher[] = gradesAwait
        ? JSON.parse(gradesAwait)
        : defaultTeachers;
      console.log(parsedSubjects);
      setTeachers(parsedSubjects);
      console.log("Profe: " + s.teacher);
      console.log("Nombre: " + s.name);
      const teacherSub: teacher =
        parsedSubjects.find((t) => s.teacher === t.id) ?? parsedSubjects[0];
      setTeacher(teacherSub);
    };
    loadEvents();
  }, []);

  async function pressFunction() {
    await AsyncStorage.setItem("idSubject", JSON.stringify(s));
    console.log(await AsyncStorage.getItem("idSubject"));
    router.push("/(modal)/subject");
  }

  return (
    <TouchableOpacity onPress={pressFunction} style={styles.container}>
      <View style={styles.iconDiv}>
        <View style={[styles.bgDiv, { backgroundColor: colors[s.color].hex }]}>
          {icons[s.icon].icon}
        </View>
      </View>
      <View style={styles.textDiv}>
        <View style={styles.tDiv}>
          <Text style={styles.text1}>{s.name}</Text>
        </View>
        <View style={styles.tDiv}>
          <Text style={styles.text2}>
            {teachers.length !== 0 && teacher ? teacher.name : "Sin profesor"}
          </Text>
        </View>
      </View>
      <View style={styles.arrowDiv}>
        <ChevronRight height={25} width={25} fill="#d3d3d3" />
      </View>
    </TouchableOpacity>
  );
};

export default Subject;

const styles = StyleSheet.create({
  container: {
    height: 70,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    zIndex: 5,
  },
  iconDiv: {
    width: "20%",
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  bgDiv: {
    width: 55,
    height: 55,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
  textDiv: {
    width: "80%",
    height: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
    paddingLeft: 10,
  },
  tDiv: {
    height: 35,
  },
  text1: {
    fontSize: 24,
    lineHeight: 20,
    color: "#0b0279",
    fontFamily: "InstrumentSans-Bold",
  },
  text2: {
    fontSize: 20,
    lineHeight: 18,
    fontFamily: "InstrumentSans-Medium",
    color: "#afafaf",
    textAlign: "right",
  },
  arrowDiv: {
    position: "absolute",
    top: "50%",
    right: 15,
    alignItems: "center",
    justifyContent: "center",
  },
});
