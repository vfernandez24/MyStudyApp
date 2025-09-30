import AlignLeft from "@/assets/icons/align-left-solid.svg";
import Status from "@/assets/icons/bars-progress-solid-full.svg";
import Calendar from "@/assets/icons/calendar-regular.svg";
import CalendarXMark from "@/assets/icons/calendar-xmark-solid-full.svg";
import InProcess from "@/assets/icons/circle-half-stroke-solid-full.svg";
import Pending from "@/assets/icons/circle-regular-full.svg";
import Completed from "@/assets/icons/circle-solid-full.svg";
import Cap from "@/assets/icons/graduation-cap-solid.svg";
import Pen from "@/assets/icons/pen-solid.svg";
import Tag from "@/assets/icons/tag-solid.svg";
import Trash from "@/assets/icons/trash-solid.svg";
import { subject, task } from "@/constants/types";
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

const OverlayHomework = ({
  selectedTask,
  overlay,
  subjects,
  tasks,
  deleteGrade,
}: {
  selectedTask: task | null;
  overlay: boolean;
  subjects: subject[];
  tasks: task[];
  deleteGrade: (id: number) => void;
}) => {
  function dateDiffStatus(targetDate: Date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);

    const diffMs = target.getTime() - today.getTime();
    const past = diffMs < 0;

    let diffDays = Math.abs(Math.floor(diffMs / (1000 * 60 * 60 * 24)));

    const years = Math.floor(diffDays / 365);
    diffDays -= years * 365;
    const months = Math.floor(diffDays / 30);
    diffDays -= months * 30;

    let diffStr = "";
    if (years > 0) diffStr += `${years} año${years > 1 ? "s" : ""}, `;
    if (months > 0) diffStr += `${months} mes${months > 1 ? "es" : ""}, `;
    diffStr += `${diffDays} día${diffDays !== 1 ? "s" : ""}`;

    return {
      status: !past,
      diff: diffStr,
    };
  }

  const [subject, setSubject] = useState<subject | undefined>();
  const [days, setDays] = useState<string | undefined>();
  const [isValid, setIsValid] = useState<boolean>(true);

  useEffect(() => {
    const subjectU = subjects.find((sub) => sub.id === selectedTask?.subject);
    setSubject(subjectU);

    const { status, diff } = dateDiffStatus(
      selectedTask?.finishedDate ?? new Date()
    );
    setDays(diff);
    setIsValid(status);
  }, [selectedTask]);

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
    <Animated.View
      style={[
        styles.overlay,
        { bottom: bottomAnim, height: selectedTask?.finishedDate ? 500 : 440 },
      ]}
    >
      <View style={styles.overlayContainer}>
        {/* NOMBRE */}
        <View style={styles.overlayDataContainer}>
          <View style={styles.overlayDataIconDiv}>
            <Tag height={35} width={35} fill="#0b0279"></Tag>
          </View>
          <View style={styles.overlayDataTextDiv}>
            <Text style={styles.overlayDataText}>{selectedTask?.name}</Text>
          </View>
        </View>

        {/* ASIGNATURA */}
        <TouchableOpacity
          onPress={async () => {
            if (selectedTask?.subject !== "personal") {
              await AsyncStorage.setItem("idSubject", JSON.stringify(subject));
              router.push("/(modal)/subject");
            }
          }}
          style={styles.overlayDataContainer}
        >
          <View style={styles.overlayDataIconDiv}>
            <Cap height={35} width={35} fill="#0b0279"></Cap>
          </View>
          <View style={styles.overlayDataTextDiv}>
            <Text style={styles.overlayDataText}>
              {selectedTask?.subject !== "personal"
                ? subject?.name
                : "Personal"}
            </Text>
          </View>
        </TouchableOpacity>

        {/* ESTADO */}
        <View style={styles.overlayDataContainer}>
          <View style={styles.overlayDataIconDiv}>
            <Status height={35} width={35} fill="#0b0279" />
          </View>
          <View style={[styles.overlayDataTextDiv, { gap: 10 }]}>
            {selectedTask?.status === "completed" ? (
              <Completed height={30} width={30} fill="#446DC4" />
            ) : selectedTask?.status === "inProgress" ? (
              <InProcess height={30} width={30} fill="#446DC4" />
            ) : (
              <Pending height={30} width={30} fill="#446DC4" />
            )}
            <Text style={styles.overlayDataText}>
              {selectedTask?.status === "completed"
                ? "Completada"
                : selectedTask?.status === "inProgress"
                  ? "En proceso"
                  : "Pendiente"}
            </Text>
          </View>
        </View>

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
              {selectedTask?.finishedDate
                ? selectedTask?.finishedDate?.toISOString().split("T")[0]
                : "Sin fecha de expiración"}
            </Text>
          </View>
        </TouchableOpacity>

        {/* ¿ CADUCADA ? */}
        <View
          style={[
            styles.overlayDataContainer,
            { display: selectedTask?.finishedDate ? "flex" : "none" },
          ]}
        >
          <View style={styles.overlayDataIconDiv}>
            <CalendarXMark
              height={35}
              width={35}
              fill={selectedTask?.finishedDate ? "#0b0279" : "#446dc4ff"}
            />
          </View>
          <View style={styles.overlayDataTextDiv}>
            <View
              style={{
                height: 20,
                width: 20,
                borderRadius: 20,
                backgroundColor:
                  isValid || selectedTask?.status === "completed"
                    ? "#40d868ff"
                    : "#e73939ff",
                marginRight: 10,
              }}
            ></View>
            <Text style={[styles.overlayDataText]}>
              {selectedTask?.status === "completed"
                ? "Completada"
                : isValid
                  ? `Vigente (${days})`
                  : `Vencida (${days})`}
            </Text>
          </View>
        </View>

        {/* DESCRIPCIÓN */}
        <View style={styles.overlayDataContainer}>
          <View style={styles.overlayDataIconDiv}>
            <AlignLeft
              height={35}
              width={35}
              fill={selectedTask?.description ? "#0b0279" : "#453CBC"}
            ></AlignLeft>
          </View>
          <View style={styles.overlayDataTextDiv}>
            <Text
              style={[
                styles.overlayDataText,
                { color: selectedTask?.description ? "#555" : "#777" },
              ]}
            >
              {selectedTask?.description === "" ||
                selectedTask?.description === undefined
                ? "Sin descripción"
                : selectedTask?.description}
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
            console.log(`SUBJECT: ${selectedTask?.subject},    NAME: ${selectedTask?.name}`);
            await AsyncStorage.setItem("typeHomework", "edit");
            await AsyncStorage.setItem("idEditH", String(selectedTask?.id));
            router.push("/(modal)/createHomework");
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
          onPress={() => deleteGrade(selectedTask?.id ?? 0)}
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

export default OverlayHomework;

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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
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
