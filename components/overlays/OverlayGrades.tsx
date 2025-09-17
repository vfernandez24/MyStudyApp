import Periods from "@/assets/icons/calendar-days-solid.svg";
import Calendar from "@/assets/icons/calendar-regular.svg";
import Cap from "@/assets/icons/graduation-cap-solid.svg";
import Pen from "@/assets/icons/pen-solid.svg";
import Tag from "@/assets/icons/tag-solid.svg";
import Trash from "@/assets/icons/trash-solid.svg";
import Trophy from "@/assets/icons/trophy-solid.svg";
import { grade, period, subject } from "@/constants/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
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

const OverlayGrades = ({
  selectedGrade,
  overlay,
  subjects,
  periods,
  deleteGrade,
}: {
  selectedGrade: grade | null;
  overlay: boolean;
  subjects: subject[];
  periods: period[];
  deleteGrade: (id: number) => void;
}) => {
  const subject = subjects.find((sub) => sub.id === selectedGrade?.subject);
  const period = periods.find((sub) => sub.id === selectedGrade?.period);

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
        {/* Nota */}
        <View style={styles.overlayDataContainer}>
          <View style={styles.overlayDataIconDiv}>
            <Trophy height={35} width={35} fill="#0b0279"></Trophy>
          </View>
          <View style={styles.overlayDataTextDiv}>
            <Text style={styles.overlayDataText}>{selectedGrade?.grade}</Text>
          </View>
        </View>

        {/* Descripcion */}
        <View style={styles.overlayDataContainer}>
          <View style={styles.overlayDataIconDiv}>
            <Pen height={35} width={35} fill="#0b0279"></Pen>
          </View>
          <View style={styles.overlayDataTextDiv}>
            <Text
              style={[
                styles.overlayDataText,
                { color: selectedGrade?.description !== "" ? "#000" : "#999" },
              ]}
            >
              {selectedGrade?.description !== ""
                ? selectedGrade?.description
                : "Sin descripción"}
            </Text>
          </View>
        </View>

        {/* Asignatura */}
        <View style={styles.overlayDataContainer}>
          <View style={styles.overlayDataIconDiv}>
            <Cap height={35} width={35} fill="#0b0279"></Cap>
          </View>
          <View style={styles.overlayDataTextDiv}>
            <Text style={styles.overlayDataText}>{subject?.name}</Text>
          </View>
        </View>

        {/* Fecha */}
        <View style={styles.overlayDataContainer}>
          <View style={styles.overlayDataIconDiv}>
            <Calendar height={35} width={35} fill="#0b0279"></Calendar>
          </View>
          <View style={styles.overlayDataTextDiv}>
            <Text style={styles.overlayDataText}>{selectedGrade?.date}</Text>
          </View>
        </View>

        {/* Periodo */}
        <View style={styles.overlayDataContainer}>
          <View style={styles.overlayDataIconDiv}>
            <Periods height={35} width={35} fill="#0b0279"></Periods>
          </View>
          <View style={styles.overlayDataTextDiv}>
            <Text style={styles.overlayDataText}>{period?.name}</Text>
          </View>
        </View>

        {/* Tipo */}
        <View style={styles.overlayDataContainer}>
          <View style={styles.overlayDataIconDiv}>
            <Tag height={35} width={35} fill="#0b0279"></Tag>
          </View>
          <View style={styles.overlayDataTextDiv}>
            <Text style={styles.overlayDataText}>
              {selectedGrade?.type == "write"
                ? "Escrito"
                : selectedGrade?.type == "oral"
                ? "Oral"
                : "Práctico"}
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
            await AsyncStorage.setItem("typeGrade", "edit");
            await AsyncStorage.setItem("idEdit", String(selectedGrade?.id));
            router.push("/(modal)/create");
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
          onPress={() => deleteGrade(selectedGrade?.id ?? 0)}
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

export default OverlayGrades;

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
    fontSize: 18,
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
