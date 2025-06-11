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
  const [timeLimit, setTimeLimit] = useState(1500)
  const [timeLeft, setTimeLeft] = useState(timeLimit)
  const [isRunning, setIsRunning] = useState(false)

  const [activeSelector, setActiveSelector] = useState('pomodoro')

  const [isShowing, setIsShowing] = useState(false)

  const [pomodoro, setPomodoro] = useState(1500)
  const [shortBreak, setShortBreak] = useState(300)
  const [longBreak, setLongBreak] = useState(900)

  const [font, setFont] = useState('sans')
  const [themeColor, setThemeColor] = useState('redOrange')

  const defaultModalSettings = {
    pomodoro,
    shortBreak,
    longBreak,
    font,
    themeColor,
  }

  const applySettings = (settings: any) => {
    setPomodoro(settings.pomodoroSetting)
    setShortBreak(settings.shortBreakSetting)
    setLongBreak(settings.longBreakSetting)
    setFont(settings.fontSetting)
    setThemeColor(settings.colorSetting)

    setIsShowing(false)
  }

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const tID = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => {
        clearTimeout(tID)
      }
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false)
    }
  })

  useEffect(() => {
    if (activeSelector === 'pomodoro') {
      setTimeLimit(pomodoro)
    } else if (activeSelector === 'shortBreak') {
      setTimeLimit(shortBreak)
    } else if (activeSelector === 'longBreak') {
      setTimeLimit(longBreak)
    }
  }, [activeSelector, pomodoro, shortBreak, longBreak])

  useEffect(() => {
    setIsRunning(false)
    setTimeLeft(timeLimit)
  }, [timeLimit])

  const handleClick = () => {
    if (timeLeft === 0) {
      setTimeLeft(timeLimit)
    }
    setIsRunning(!isRunning)
  } 

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
