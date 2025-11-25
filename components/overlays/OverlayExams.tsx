import AlignLeft from "@/assets/icons/align-left-solid.svg";
import Calendar from "@/assets/icons/calendar-regular.svg";
import Cap from "@/assets/icons/graduation-cap-solid.svg";
import HourGlass from "@/assets/icons/hourglass-solid.svg";
import Pen from "@/assets/icons/pen-solid.svg";
import Tag from "@/assets/icons/tag-solid.svg";
import Trash from "@/assets/icons/trash-solid.svg";
import Trophy from "@/assets/icons/trophy-solid.svg";
import STORAGE_KEYS from "@/constants/storageKeys";
import { exam, grade, subject } from "@/constants/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const screenHeight = Dimensions.get("window").height;
const scrollHeight = screenHeight - 80;

const OverlayExams = ({
  selectedExam,
  overlay,
  subjects,
  grades,
  deleteGrade,
}: {
  selectedExam: exam | null;
  overlay: boolean;
  subjects: subject[];
  grades: grade[];
  deleteGrade: (id: number) => void;
}) => {
  const [subject, setSubject] = useState<subject | undefined>();
  const [grade, setGrade] = useState<grade | undefined>();
  useEffect(() => {
    const subjectU = subjects.find((sub) => sub.id === selectedExam?.subject);
    const gradeU = grades.find((g) => g.id === selectedExam?.grade);

    setSubject(subjectU);
    setGrade(gradeU);
  }, [selectedExam]);

  const bottomAnim = useRef(new Animated.Value(-500)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(bottomAnim, {
        toValue: overlay ? 0 : -500,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  }, [overlay]);

  return (
    <Animated.View style={[styles.overlay, { bottom: bottomAnim }]}>
      <View style={styles.overlayContainer}>
        {/* FECHA */}
        <TouchableOpacity
          onPress={() => router.push("/(drawer)/calendar")}
          style={styles.overlayDataContainer}
        >
          <View style={styles.overlayDataIconDiv}>
            <Calendar height={35} width={35} fill="#0b0279"></Calendar>
          </View>
          <View style={styles.overlayDataTextDiv}>
            <Text style={styles.overlayDataText}>
              {selectedExam?.date.toISOString().split("T")[0]}
            </Text>
          </View>
        </TouchableOpacity>

        {/* DURACIÓN */}
        <View style={styles.overlayDataContainer}>
          <View style={styles.overlayDataIconDiv}>
            <HourGlass height={35} width={35} fill="#0b0279"></HourGlass>
          </View>
          <View style={styles.overlayDataTextDiv}>
            <Text style={[styles.overlayDataText]}>
              {selectedExam?.allDay
                ? "Todo el día"
                : selectedExam?.startTime && selectedExam?.finishedTime
                ? `${selectedExam.startTime.getHours()}:${selectedExam.startTime
                    .getMinutes()
                    .toString()
                    .padStart(2, "0")}  -  ${selectedExam.finishedTime
                    .getHours()
                    .toString()
                    .padStart(2, "0")}:${selectedExam.finishedTime
                    .getMinutes()
                    .toString()
                    .padStart(2, "0")}`
                : "Sin hora"}
            </Text>
          </View>
        </View>

        {/* NOMBRE */}
        <View style={styles.overlayDataContainer}>
          <View style={styles.overlayDataIconDiv}>
            <Tag height={35} width={35} fill="#0b0279"></Tag>
          </View>
          <View style={styles.overlayDataTextDiv}>
            <Text style={styles.overlayDataText}>{selectedExam?.name}</Text>
          </View>
        </View>

        {/* ASIGNATURA */}
        <TouchableOpacity
          onPress={async () => {
            await AsyncStorage.setItem(STORAGE_KEYS.ID_SUBJECT_KEY, JSON.stringify(subject));
            router.push("/(modal)/subject");
          }}
          style={styles.overlayDataContainer}
        >
          <View style={styles.overlayDataIconDiv}>
            <Cap height={35} width={35} fill="#0b0279"></Cap>
          </View>
          <View style={styles.overlayDataTextDiv}>
            <Text style={styles.overlayDataText}>{subject?.name}</Text>
          </View>
        </TouchableOpacity>

        {/* NOTA */}
        <TouchableOpacity
          onPress={() => router.push("/(drawer)/(grades)/grades")}
          style={styles.overlayDataContainer}
        >
          <View style={styles.overlayDataIconDiv}>
            <Trophy
              height={35}
              width={35}
              fill={grade?.grade ? "#0b0279" : "#446dc4ff"}
            ></Trophy>
          </View>
          <View style={styles.overlayDataTextDiv}>
            <Text
              style={[
                styles.overlayDataText,
                {
                  color: grade?.grade ? "#444" : "#777",
                },
              ]}
            >
              {grade?.grade ?? "Sin nota"}
            </Text>
          </View>
        </TouchableOpacity>

        {/* DESCRIPCIÓN */}
        <View style={styles.overlayDataContainer}>
          <View style={styles.overlayDataIconDiv}>
            <AlignLeft
              height={35}
              width={35}
              fill={selectedExam?.description ? "#0b0279" : "#453CBC"}
            ></AlignLeft>
          </View>
          <View style={styles.overlayDataTextDiv}>
            <Text
              style={[
                styles.overlayDataText,
                { color: selectedExam?.description ? "#555" : "#777" },
              ]}
            >
              {selectedExam?.description === "" ||
              selectedExam?.description === undefined
                ? "Sin descripción"
                : selectedExam?.description}
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          height: 3,
          borderRadius: 20,
          width: "80%",
          backgroundColor: "#d3d3d3",
          position: "relative",
          bottom: 30,
        }}
      ></View>

      {/* Botones */}
      <View style={styles.overlayButtonContainer}>
        {/* Editar */}
        <TouchableOpacity
          onPress={async () => {
            await AsyncStorage.setItem(STORAGE_KEYS.TYPEFORM_KEY, "edit");
            await AsyncStorage.setItem(STORAGE_KEYS.ID_EXAM_KEY, String(selectedExam?.id));
            router.push("/(modal)/createExams");
          }}
          style={[styles.overlayButton, { backgroundColor: "#f7f7f7" }]}
        >
          <View style={styles.overlayButtonIconDiv}>
            <Pen height={30} width={30} fill="#0b0279"></Pen>
          </View>
          <View style={styles.overlayButtonTextDiv}>
            <Text style={[styles.overlayButtonText, { color: "#6C98F7" }]}>
              Editar
            </Text>
          </View>
        </TouchableOpacity>

        {/* Eliminar */}
        <TouchableOpacity
          style={[
            styles.overlayButton,
            { backgroundColor: "rgba(255, 0, 0, 0.45)" },
          ]}
          onPress={() => deleteGrade(selectedExam?.id ?? 0)}
        >
          <View style={styles.overlayButtonIconDiv}>
            <Trash height={30} width={30} fill={"#fff"}></Trash>
          </View>
          <View style={styles.overlayButtonTextDiv}>
            <Text style={[styles.overlayButtonText, { color: "#fff" }]}>
              Eliminar
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default OverlayExams;

const styles = StyleSheet.create({
  overlayBg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: scrollHeight,
    backgroundColor: "#0000003d",
    zIndex: 20,
  },
  overlay: {
    position: "absolute",
    transitionProperty: "bottom",
    transitionDuration: "0.8s",
    left: 0,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    gap: 0,
    height: 500,
    width: "100%",
    zIndex: 21,
    borderTopEndRadius: 40,
    borderTopStartRadius: 40,
  },
  overlayContainer: {
    height: 400,
    width: "100%",
    gap: 10,
  },
  overlayDataContainer: {
    height: 50,
    flexDirection: "row",
  },
  overlayDataIconDiv: {
    width: "30%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  overlayDataIconImg: {
    height: 35,
    objectFit: "contain",
  },
  overlayDataTextDiv: {
    width: "70%",
    height: 50,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  overlayDataText: {
    fontFamily: "InstrumentSans-Medium",
    fontSize: 21,
    color: "#555",
  },
  overlayButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 30,
    paddingHorizontal: 30,
  },
  overlayButton: {
    height: 50,
    width: "50%",
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  overlayButtonIconDiv: {
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  overlayButtonTextDiv: {},
  overlayButtonText: {
    fontFamily: "InstrumentSans-SemiBold",
    fontSize: 17,
    letterSpacing: 1,
    width: "auto",
  },
});
