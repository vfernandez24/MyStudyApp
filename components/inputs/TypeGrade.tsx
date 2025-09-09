import Check from "@/assets/icons/check-solid-full.svg";
import Oral from "@/assets/icons/microphone-solid-full.svg";
import Write from "@/assets/icons/pencil-solid-full.svg";
import Practical from "@/assets/icons/person-running-solid-full.svg";
import { defaultTeachers } from "@/constants/defaultValues";
import { teacher } from "@/constants/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  s: { id: number; type: "write" | "oral" | "practical" };
  pressFunction: (id: "write" | "oral" | "practical") => void;
  typeSelected: "write" | "oral" | "practical";
};

function TypeGrade({ s, pressFunction, typeSelected }: Props) {
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
    if (typeSelected == s.type) {
      setIsSelected(true);
    } else {
      setIsSelected(false);
    }
  }, [typeSelected]);

  return (
    <TouchableOpacity
      onPress={() => pressFunction(s.type)}
      style={styles.container}
    >
      <View style={styles.iconDiv}>
        <View style={styles.bgDiv}>
          {s.type == "write" ? (
            <Write height={30} width={30} fill={"#0b0279"}></Write>
          ) : s.type == "oral" ? (
            <Oral height={30} width={30} fill={"#0b0279"}></Oral>
          ) : (
            <Practical height={30} width={30} fill={"#0b0279"}></Practical>
          )}
        </View>
      </View>
      <View style={styles.textDiv}>
        <Text style={styles.text1}>
          {s.type == "write"
            ? "Escrito"
            : s.type == "oral"
            ? "Oral"
            : "Práctico"}
        </Text>
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

export default TypeGrade;

const styles = StyleSheet.create({
  container: {
    maxHeight: 60,
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
    justifyContent: "center",
    paddingLeft: 10,
    overflow: "visible",
  },
  text1: {
    fontSize: 24,
    lineHeight: 32,
    color: "#777",
    overflow: "visible",
    fontFamily: "InstrumentSans-SemiBold",
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
