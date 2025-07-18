import Gear from "@/assets/icons/gear-line.svg";
import React, { Dispatch, SetStateAction } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const screenHeight = Dimensions.get("window").height;
const scrollHeight = screenHeight - 80;

type Props = {
  page: string;
  setPage: Dispatch<SetStateAction<"home" | "pomodoro" | "config">>;
};

const Index = ({ page, setPage }: Props) => {
  return (
    <View style={[styles.container, { zIndex: page == "home" ? 200 : 0 }]}>
      <TouchableOpacity
        onPress={() => setPage("config")}
        style={styles.buttonConfig}
      >
        <Gear fill="#6C98F7" height={40} width={40}></Gear>
      </TouchableOpacity>

      <Image
        source={require("@/assets/images/pomodoro-technique (1).png")}
        style={styles.image}
      ></Image>
      <View style={{ alignItems: "center" }}>
        <Text style={styles.title1}>TEMPORIZADOR</Text>
        <Text style={styles.title2}>pomodoro</Text>
      </View>
      <Text style={styles.description}>
        Maximiza tu concentración con la mejor técnica
      </Text>

      <TouchableOpacity
        onPress={() => setPage("pomodoro")}
        style={styles.buttonIniciar}
      >
        <Text style={styles.textButton}>INICIAR</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: scrollHeight,
    padding: 15,
    paddingBottom: 80,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  buttonConfig: {
    position: "absolute",
    top: 10,
    right: 10,
    justifyContent: "center",
    alignItems: "center",
    height: 55,
    width: 55,
  },
  image: {
    height: 135,
    objectFit: "contain",
  },
  title1: {
    color: "#6C98F7",
    fontFamily: "InstrumentSans-Bold",
    fontSize: 45,
    lineHeight: 45,
  },
  title2: {
    color: "#0b0279",
    letterSpacing: 3,
    fontSize: 45,
    lineHeight: 45,
    fontFamily: "InstrumentSans-SemiBold",
  },
  description: {
    fontFamily: "Inter-Italic",
    fontWeight: "ultralight",
    fontSize: 20,
    textAlign: "center",
  },
  buttonIniciar: {
    height: 60,
    width: 200,
    backgroundColor: "#0b0279",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  textButton: {
    color: "#fff",
    fontFamily: "InstrumentSans-SemiBold",
    fontSize: 24,
    letterSpacing: 2,
  },
});
