import ChevronRight from "@/assets/icons/chevron-right-solid.svg";
import colors from "@/constants/colors";
import { exam, subject } from "@/constants/types";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Exam = ({
  e,
  pressFunction,
  subjects,
  exams,
}: {
  e: exam;
  exams: exam[];
  pressFunction: () => void;
  subjects: subject[];
}) => {
  const [selectedSubject, setSelectedSubject] = useState<subject>();
  useEffect(() => {
    const loadEvents = () => {
      const newSelectedSubject = subjects.find((s) => s.id == e.subject);
      setSelectedSubject(newSelectedSubject);
    };
    loadEvents();
  }, [exams, subjects]);

  return (
    <TouchableOpacity onPress={pressFunction} style={styles.container}>
      <View style={styles.iconDiv}>
        <View
          style={[
            styles.bgDiv,
            { backgroundColor: colors[selectedSubject?.color ?? 0].hex },
          ]}
        >
          <Text
            style={[
              styles.text,
              { color: colors[selectedSubject?.color ?? 0].text },
            ]}
          >
            {e.date.getDate().toString()}
          </Text>
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
        <ChevronRight height={25} width={25} fill="#d3d3d3" />
      </View>
    </TouchableOpacity>
  );
};

export default Exam;

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
  text: {
    fontFamily: "InstrumentSans-Bold",
    fontSize: 20,
  },
  gradeDate: {
    fontSize: 15,
    fontFamily: "InstrumentSans-Medium",
    color: "#afafaf",
    textAlign: "right",
  },
});
