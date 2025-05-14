import { gradeColors } from "@/constants/colors";
import { defaultSubjects } from "@/constants/defaultValues";
import { grade, subject } from "@/constants/types";
import selectColor from "@/scripts/selectColor";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ColorValue, StyleSheet, Text, View } from "react-native";

const Grade = (g: grade) => {
  const promedioColor: number = selectColor(g.grade);
  const bgColor: ColorValue = gradeColors[promedioColor].color;
  const [subjects, setSubjects] = useState<subject[]>(defaultSubjects);

  useEffect(() => {
    const loadSubjects = async () => {
      const subjectsAwait = await AsyncStorage.getItem("subjects");
      console.log(subjectsAwait);
      const parsedSubjects =
        subjectsAwait != null ? JSON.parse(subjectsAwait) : defaultSubjects;
      console.log(parsedSubjects);
      setSubjects(parsedSubjects);
      console.log(g.description)
      console.log("Grade props:", g);
      console.log("Grade props:", g.description);
      console.log("Grade props:", g.grade);
    };

    loadSubjects();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.gradeDiv}>
        <View style={[styles.gradeBg, { backgroundColor: bgColor }]}>
          <Text style={styles.gradeText}>{g.grade}</Text>
        </View>
      </View>
      <View style={styles.subjectDiv}>
        <Text>{g.description}</Text>
      </View>
    </View>
  );
};

export default Grade;

const styles = StyleSheet.create({
  container: {},
  gradeDiv: {},
  gradeBg: {},
  gradeText: {},
  subjectDiv: {},
  subjectText: {},
});
