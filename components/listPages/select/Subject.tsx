import Check from "@/assets/icons/check-solid-full.svg";
import colors from "@/constants/colors";
import { defaultTeachers } from "@/constants/defaultValues";
import icons from "@/constants/icons";
import { subject, teacher } from "@/constants/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  s: subject;
  pressFunction: (id: number) => void;
  subject: number;
  setSubject: (id: number) => void;
};

function Subject({ s, pressFunction, setSubject, subject }: Props) {
  const [teachers, setTeachers] = useState<teacher[]>(defaultTeachers);
  useEffect(() => {
    const loadEvents = async () => {
      const teachersAwait = await AsyncStorage.getItem("teachers");
      const parsedTeachers: teacher[] = teachersAwait
        ? JSON.parse(teachersAwait)
        : defaultTeachers;
      setTeachers(parsedTeachers);
    };
    loadEvents();
  }, []);

  const [isSelected, setIsSelected] = useState<boolean>(false);

  useEffect(() => {
    if (subject == s.id) {
      setIsSelected(true);
    } else {
      setIsSelected(false);
    }
  }, [subject]);

  return (
    <TouchableOpacity onPress={() => pressFunction(s.id)} style={styles.container}>
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
            {s.teacher >= 0 && teachers[s.teacher]
              ? teachers[s.teacher].name
              : "Sin profesor"}
          </Text>
        </View>
      </View>
      <View style={styles.arrowDiv}>
        <View
          style={[
            styles.checkBox,
            {
              borderColor: isSelected ? "#446dc4ff" : "#dedede",
              backgroundColor: isSelected ? "#446dc4ff" : "#fff",
            },
          ]}
        >
          <Check height={20} width={20} fill="#fff"></Check>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default Subject;

const styles = StyleSheet.create({
  container: {
    height: 70,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    overflow: "visible",
    alignItems: "center",
    padding: 10,
    zIndex: 5,
    marginBottom: 10,
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
    justifyContent: "space-between",
    paddingLeft: 10,
    overflow: "visible",
  },
  tDiv: {
    marginBottom: 4,
    overflow: "visible",
  },
  text1: {
    fontSize: 24,
    lineHeight: 32,
    color: "#0b0279",
    overflow: "visible",
    fontFamily: "InstrumentSans-Bold",
  },
  text2: {
    fontSize: 20,
    overflow: "visible",
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
  checkBox: {
    height: 30,
    width: 30,
    borderRadius: 30,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
  },
});
