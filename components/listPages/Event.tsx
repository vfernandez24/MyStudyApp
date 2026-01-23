import colors from "@/constants/colors";
import { defaultSubjects } from "@/constants/defaultValues";
import icons from "@/constants/icons";
import { event, subject } from "@/constants/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Event = (e: event) => {
  const [selectedSubject, setSelectedSubject] = useState<subject>();
  const [subjects, setSubjects] = useState<subject[]>(defaultSubjects);
  useEffect(() => {
    const loadEvents = async () => {
      const subjectsAwait = await AsyncStorage.getItem("subject");
      const parsedSubjects: subject[] = subjectsAwait
        ? JSON.parse(subjectsAwait)
        : defaultSubjects;
      setSubjects(parsedSubjects);
      const newSelectedSubject = parsedSubjects.find((s) => s.id == e.subject);
      setSelectedSubject(newSelectedSubject);
    };
    loadEvents();
  }, []);

  function pressFunction() {
    router.push("/(drawer)/exams");
  }

  return (
    <TouchableOpacity
      onPress={() => router.push("/(drawer)/exams")}
      style={styles.container}
    >
      <View style={styles.iconDiv}>
        <View style={[styles.bgDiv, { backgroundColor: colors[e.color].hex }]}>
          {icons[selectedSubject ? selectedSubject.icon : 0].icon}
        </View>
      </View>
      <View style={styles.textDiv}>
        <View style={styles.tDiv}>
          <Text style={styles.text1} numberOfLines={1}>
            {e.name}
          </Text>
        </View>
        <View style={styles.tDiv}>
          <Text style={styles.text2}>
            {selectedSubject ? selectedSubject.name : ""}
          </Text>
        </View>
      </View>
      <View style={styles.arrowDiv}>
        <Text style={styles.gradeDate}>{e.startTime.toDateString()}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Event;

const styles = StyleSheet.create({
  container: {
    height: 70,
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
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
    width: "60%",
    height: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
    paddingLeft: 10,
    overflow: "hidden",
  },
  tDiv: {
    height: 35,
  },
  text1: {
    fontSize: 24,
    lineHeight: 20,
    color: "#0b0279",
    fontFamily: "InstrumentSans-Bold",
    wordWrap: "nowrap",
    overflow: "hidden",
    flexWrap: "nowrap",
  },
  text2: {
    fontSize: 20,
    lineHeight: 18,
    fontFamily: "InstrumentSans-Medium",
    color: "#afafaf",
    textAlign: "right",
    overflow: "visible",
  },
  arrowDiv: {
    position: "absolute",
    top: "50%",
    right: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  gradeDate: {
    fontSize: 15,
    fontFamily: "InstrumentSans-Medium",
    color: "#afafaf",
    textAlign: "right",
  },
});
