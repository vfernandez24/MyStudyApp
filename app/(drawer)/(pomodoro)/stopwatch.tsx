import PageTitle from "@/components/common/PageTitle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const screenHeight = Dimensions.get("window").height;
const scrollHeight = screenHeight - 80;

const stopwatch = () => {
  const [numberPomodoro, setNumberPomodoro] = useState(0);
  const [durationPomodoro, setDurationPomodoro] = useState(0);
  const [durationBreak, setDurationBreak] = useState(0);
  const [pomodoroTimeInitial, setPomodoroTimeInitial] = useState(20);
  const [pomodoroTime, setPomodoroTime] = useState(20);

  useEffect(() => {
    async function getData() {
      const awaitNumberPomodoros = Number(
        await AsyncStorage.getItem("numberPomodoros")
      );
      const awaitDurationPomodoros = Number(
        await AsyncStorage.getItem("durationPomodoro")
      );
      const awaitDurationBreak = Number(
        await AsyncStorage.getItem("durationBreaks")
      );

      setNumberPomodoro(awaitNumberPomodoros);
      setDurationPomodoro(awaitDurationPomodoros);
      setDurationBreak(awaitDurationBreak);

      const durationTotal =
        awaitNumberPomodoros * awaitDurationPomodoros +
        awaitDurationBreak * (awaitDurationPomodoros - 1);
      setPomodoroTimeInitial(durationTotal);
    }
    getData();
  }, []);

  useEffect(() => {
    setPomodoroTime(pomodoroTimeInitial);
  }, [pomodoroTimeInitial]);

  const [timeType, setTimeType] = useState("pomodoro");
  return (
    <View style={styles.container}>
      <View style={styles.titleDiv}>
        <PageTitle title="TEMPORIZADOR"></PageTitle>
      </View>

      <View style={styles.containerButtons}>
        <TouchableOpacity
          style={[styles.buttonPeriod, { backgroundColor: "#0b0279" }]}
        >
          <Text
            style={[
              styles.buttonPeriodText,
              {
                fontFamily:
                  timeType == "pomodoro"
                    ? "InstrumentSans-Medium"
                    : "InstrumentSans-Regular",
                color: "#fff",
              },
            ]}
          >
            pomodoro
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttonPeriod, { backgroundColor: "#6C98F7" }]}
        >
          <Text
            style={[
              styles.buttonPeriodText,
              {
                fontFamily:
                  timeType == "sbreak"
                    ? "InstrumentSans-Medium"
                    : "InstrumentSans-Regular",
              },
            ]}
          >
            short break
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttonPeriod, { backgroundColor: "#d9d9d9" }]}
        >
          <Text
            style={[
              styles.buttonPeriodText,
              {
                fontFamily:
                  timeType == "lbreak"
                    ? "InstrumentSans-Medium"
                    : "InstrumentSans-Regular",
              },
            ]}
          >
            long break
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.timerContainer}>
        <View style={styles.timer}>
          <Text style={styles.timerText}></Text>
        </View>
        <View style={styles.checkboxDiv}>
          <Text style={styles.checkboxText}></Text>
          <Switch style={styles.checkbox}></Switch>
        </View>
      </View>

      <View style={styles.comingNextDiv}>
        <Text style={styles.comingNextText}></Text>
      </View>
      <View style={styles.containerButtonsFinal}>
        <TouchableOpacity style={[styles.buttonFinal, {}]}>
          <Text style={styles.buttonFinalText}></Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.buttonFinal, {}]}>
          <Text style={styles.buttonFinalText}></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default stopwatch;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: scrollHeight,
    padding: 15,
    alignItems: "center",
  },
  titleDiv: {
    marginBottom: 10,
  },
  containerButtons: {
    height: 60,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  buttonPeriod: {
    height: 45,
    borderRadius: 15,
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPeriodText: {
    fontSize: 15,
  },
  timerContainer: {
    marginVertical: 15,
    height: 400,
    width: "100%",
    justifyContent: "space-between",
  },
  timer: {
    height: 300,
    width: "100%",
    backgroundColor: "#ddd",
    borderRadius: 15,
  },
  timerText: {},
  checkboxDiv: {},
  checkboxText: {},
  checkbox: {},
  comingNextDiv: {},
  comingNextText: {},
  containerButtonsFinal: {},
  buttonFinal: {},
  buttonFinalText: {},
});
