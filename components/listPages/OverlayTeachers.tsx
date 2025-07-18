import AlignLeft from "@/assets/icons/align-left-solid.svg";
import Email from "@/assets/icons/envelope-solid.svg";
import IdCard from "@/assets/icons/id-card-solid.svg";
import Pen from "@/assets/icons/pen-solid.svg";
import Tel from "@/assets/icons/phone-solid.svg";
import Trash from "@/assets/icons/trash-solid.svg";
import User from "@/assets/icons/user-solid.svg";
import VenusMars from "@/assets/icons/venus-mars-solid.svg";
import { teacher } from "@/constants/types";
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

const OverlayTeachers = ({
  selectedTeacher,
  overlay,
  deleteGrade,
}: {
  selectedTeacher: teacher | null;
  overlay: boolean;
  deleteGrade: (id: number) => void;
}) => {
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
            <User height={35} width={35} fill="#0b0279" />
          </View>
          <View style={styles.overlayDataTextDiv}>
            <Text style={styles.overlayDataText}>{selectedTeacher?.name}</Text>
          </View>
        </View>

        {/* Descripcion */}
        <View style={styles.overlayDataContainer}>
          <View style={styles.overlayDataIconDiv}>
            <IdCard height={35} width={35} fill="#0b0279"></IdCard>
          </View>
          <View style={styles.overlayDataTextDiv}>
            <Text style={[styles.overlayDataText]}>
              {selectedTeacher?.surnames}
            </Text>
          </View>
        </View>

        {/* Asignatura */}
        <View style={styles.overlayDataContainer}>
          <View style={styles.overlayDataIconDiv}>
            <Email height={35} width={35} fill="#0b0279"></Email>
          </View>
          <View style={styles.overlayDataTextDiv}>
            <Text
              style={[
                styles.overlayDataText,
                {
                  color:
                    selectedTeacher?.email !== "" && selectedTeacher?.email
                      ? "#000"
                      : "#999",
                },
              ]}
            >
              {selectedTeacher?.email !== "" && selectedTeacher?.email
                ? selectedTeacher?.email
                : "Sin correo electrónico"}
            </Text>
          </View>
        </View>

        {/* Fecha */}
        <View style={styles.overlayDataContainer}>
          <View style={styles.overlayDataIconDiv}>
            <Tel height={35} width={35} fill="#0b0279"></Tel>
          </View>
          <View style={styles.overlayDataTextDiv}>
            <Text
              style={[
                styles.overlayDataText,
                { color: selectedTeacher?.tel !== undefined ? "#000" : "#999" },
              ]}
            >
              {selectedTeacher?.tel !== undefined
                ? selectedTeacher?.tel
                : "Sin teléfono"}
            </Text>
          </View>
        </View>

        {/* Periodo */}
        <View style={styles.overlayDataContainer}>
          <View style={styles.overlayDataIconDiv}>
            <VenusMars height={35} width={35} fill="#0b0279"></VenusMars>
          </View>
          <View style={styles.overlayDataTextDiv}>
            <Text
              style={[
                styles.overlayDataText,
                {
                  color:
                    selectedTeacher?.gender === "male" ||
                    selectedTeacher?.gender === "female"
                      ? "#000"
                      : "#999",
                },
              ]}
            >
              {selectedTeacher?.gender === "male" ||
              selectedTeacher?.gender === "female"
                ? selectedTeacher?.gender == "male"
                  ? "Hombre"
                  : "Mujer"
                : "Sin género"}
            </Text>
          </View>
        </View>

        {/* Tipo */}
        <View style={styles.overlayDataContainer}>
          <View style={styles.overlayDataIconDiv}>
            <AlignLeft height={35} width={35} fill="#453CBC"></AlignLeft>
          </View>
          <View style={styles.overlayDataTextDiv}>
            <Text style={[styles.overlayDataText, { color: "#999" }]}>
              {selectedTeacher?.notes !== "" && selectedTeacher?.notes
                ? selectedTeacher?.notes
                : "Sin notas"}
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
            await AsyncStorage.setItem("typeTeacher", "edit");
            await AsyncStorage.setItem("idEditT", String(selectedTeacher?.id));
            router.push("/(modal)/createTeachers");
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
          onPress={() => deleteGrade(selectedTeacher?.id ?? 0)}
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

export default OverlayTeachers;

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
    maxWidth: "70%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    paddingRight: 20,
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
