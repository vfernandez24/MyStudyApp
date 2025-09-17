import Check from "@/assets/icons/check-solid-full.svg";
import { notification } from "@/constants/types";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  nots: notification[];
  not: notification;
  pressFunction: () => void;
  isSelected: boolean;
};

function Notification({ nots, not, isSelected, pressFunction }: Props) {
  return (
    <TouchableOpacity onPress={() => pressFunction()} style={styles.container}>
      <View style={styles.textDiv}>
        <Text style={styles.text1}>{not.large}</Text>
      </View>

      <View
        style={[
          styles.checkBox,
          {
            borderColor: isSelected ? "#446dc4ff" : "#dedede",
            backgroundColor: isSelected ? "#446dc4ff" : "#fff",
          },
        ]}
      >
        {isSelected && <Check height={20} width={20} fill="#fff" />}
      </View>
    </TouchableOpacity>
  );
}

export default Notification;

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
  textDiv: {
    width: "80%",
    height: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingLeft: 0,
    overflow: "visible",
  },
  tDiv: {
    marginBottom: 4,
    overflow: "visible",
  },
  text1: {
    fontSize: 24,
    lineHeight: 32,
    color: "#777",
    overflow: "visible",
    fontFamily: "InstrumentSans-Medium",
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
