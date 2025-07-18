import ArrowDown from "@/assets/icons/arrowDown.svg";
import ArrowUp from "@/assets/icons/arrowUp.svg";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  children: string;
  state: number;
  setState: (state: number) => void;
};

const Input = ({ children, state, setState }: Props) => {
  const ONE_MINUTE = 60;
  return (
    <View>
      <Text style={styles.label}>{children}</Text>
      <View style={styles.inputBox}>
        <Text>{state / ONE_MINUTE}</Text>
        <View style={styles.buttons}>
          <TouchableOpacity onPress={() => setState(state + ONE_MINUTE)}>
            <ArrowUp />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setState(state - ONE_MINUTE)}>
            <ArrowDown />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  label: {
    color: "#0b0279",
    opacity: 0.4,
  },
  inputBox: {
    display: "flex",
    alignItems: "center",
    width: 135,
    marginTop: 8,
    padding: 16,
    borderRadius: 10,
    backgroundColor: "#eff1fa",
  },
  buttons: {
    position: "absolute",
    transform: "translate(94px, 0)",
  },
});
