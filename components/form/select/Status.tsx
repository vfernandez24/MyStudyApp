import Check from "@/assets/icons/check-solid-full.svg";
import InProgress from "@/assets/icons/circle-half-stroke-solid-full.svg";
import Pending from "@/assets/icons/circle-regular-full.svg";
import Completed from "@/assets/icons/circle-solid-full.svg";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  s: { id: number; status: "pending" | "inProgress" | "completed" };
  pressFunction: (id: "pending" | "inProgress" | "completed") => void;
  typeSelected: "pending" | "inProgress" | "completed";
};

function Status({ s, pressFunction, typeSelected }: Props) {

  const [isSelected, setIsSelected] = useState<boolean>(false);

  useEffect(() => {
    if (typeSelected === s.status) {
      setIsSelected(true);
    } else {
      setIsSelected(false);
    }
  }, [typeSelected]);

  return (
    <TouchableOpacity
      onPress={() => pressFunction(s.status)}
      style={styles.container}
    >
      <View style={styles.iconDiv}>
        <View style={styles.bgDiv}>
          {s.status == "pending" ? (
            <Pending height={30} width={30} fill={"#0b0279"}></Pending>
          ) : s.status == "inProgress" ? (
            <InProgress height={30} width={30} fill={"#0b0279"}></InProgress>
          ) : (
            <Completed height={30} width={30} fill={"#0b0279"}></Completed>
          )}
        </View>
      </View>
      <View style={styles.textDiv}>
        <Text style={styles.text1}>
          {s.status === "pending"
            ? "Pendiente"
            : s.status === "inProgress"
              ? "En proceso"
              : "Completada"}
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

export default Status;

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
