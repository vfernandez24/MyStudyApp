import { gradeColors } from "@/constants/colors";
import { defaultSubjects } from "@/constants/defaultValues";
import { grade, subject } from "@/constants/types";
import selectColor from "@/scripts/selectColor";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  ColorValue,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Grade = ({
  g,
  pressFunction,
}: {
  g: grade;
  pressFunction: () => void;
}) => {
  const promedioColor: number = selectColor(g.grade);
  const bgColor: ColorValue = gradeColors[promedioColor].color;
  const [subjects, setSubjects] = useState<subject[]>(defaultSubjects);

  useEffect(() => {
    const loadSubjects = async () => {
      const subjectsAwait = await AsyncStorage.getItem("subjects");
      const parsedSubjects =
        subjectsAwait != null ? JSON.parse(subjectsAwait) : defaultSubjects;
      setSubjects(parsedSubjects);
    };

    loadSubjects();
  }, []);

  return (
    <TouchableOpacity onPress={pressFunction} style={styles.container}>
      <View style={styles.gradeDiv}>
        <View style={[styles.gradeBg, { backgroundColor: bgColor }]}>
          <Text
            style={[
              styles.gradeText,
              { color: gradeColors[promedioColor].text },
            ]}
          >
            {g.grade}
          </Text>
        </View>
      </View>
      <View style={styles.subjectDiv}>
        <Text style={styles.subjectText}>
          {g.description ? g.description : subjects[g.subject].name}
        </Text>
        <Text style={styles.gradeDate}>{g.date}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Grade;

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    zIndex: 5,
  },
  gradeDiv: {
    width: "20%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  gradeBg: {
    width: 55,
    height: 55,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
  gradeText: {
    fontSize: 24,
    fontFamily: "InstrumentSans-SemiBold",
  },
  subjectDiv: {
    width: "80%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 10,
  },
  subjectText: {
    fontSize: 20,
    fontFamily: "InstrumentSans-SemiBold",
  },
  gradeDate: {
    fontSize: 15,
    fontFamily: "InstrumentSans-Medium",
    color: "#afafaf",
    textAlign: "right",
  },
});
