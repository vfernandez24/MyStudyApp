import ArrowLeft from "@/assets/icons/arrow-left-solid.svg";
import PageTitle from "@/components/UI/PageTitle";
import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import ConfigPage from "./config";
import Index from "./homePomodoro";

const screenHeight = Dimensions.get("window").height;
const scrollHeight = screenHeight - 80;

const stopwatch = () => {
  const [page, setPage] = useState<"home" | "pomodoro" | "config">("home");

  const [timeLimit, setTimeLimit] = useState(1500);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isRunning, setIsRunning] = useState(false);

  const [activeSelector, setActiveSelector] = useState("pomodoro");

  const [isShowing, setIsShowing] = useState(false);

  const [pomodoro, setPomodoro] = useState(1500);
  const [shortBreak, setShortBreak] = useState(300);
  const [longBreak, setLongBreak] = useState(900);

  const [font, setFont] = useState("sans");
  const [themeColor, setThemeColor] = useState("redOrange");

  const defaultModalSettings = {
    pomodoro,
    shortBreak,
    longBreak,
    font,
    themeColor,
  };

  const applySettings = (settings: any) => {
    setPomodoro(settings.pomodoroSetting);
    setShortBreak(settings.shortBreakSetting);
    setLongBreak(settings.longBreakSetting);
    setFont(settings.fontSetting);
    setThemeColor(settings.colorSetting);

    setIsShowing(false);
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const tID = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => {
        clearTimeout(tID);
      };
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
    }
  });

  useEffect(() => {
    if (activeSelector === "pomodoro") {
      setTimeLimit(pomodoro);
    } else if (activeSelector === "shortBreak") {
      setTimeLimit(shortBreak);
    } else if (activeSelector === "longBreak") {
      setTimeLimit(longBreak);
    }
  }, [activeSelector, pomodoro, shortBreak, longBreak]);

  useEffect(() => {
    setIsRunning(false);
    setTimeLeft(timeLimit);
  }, [timeLimit]);

  const handleClick = () => {
    if (timeLeft === 0) {
      setTimeLeft(timeLimit);
    }
    setIsRunning(!isRunning);
  };

  const [timeType, setTimeType] = useState("pomodoro");
  return (
    <View style={styles.App}>
      <View
        style={[styles.container, { zIndex: page == "pomodoro" ? 200 : 0 }]}
      >
        <TouchableOpacity
          style={styles.buttonExit}
          onPress={() => setPage("home")}
        >
          <ArrowLeft height={35} width={35} fill={"#6C98F7"} />
        </TouchableOpacity>

        <View style={styles.titleDiv}>
          <PageTitle title="TEMPORIZADOR"></PageTitle>
        </View>
      </View>

      <Index page={page} setPage={setPage} />
      <ConfigPage />
    </View>
  );
};

export default stopwatch;

const styles = StyleSheet.create({
  App: {},
  container: {
    width: "100%",
    height: scrollHeight,
    padding: 15,
    alignItems: "center",
  },
  titleDiv: {
    marginBottom: 10,
  },
  buttonExit: {
    position: "absolute",
    top: 25,
    left: 25,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    width: 50,
    borderRadius: "100%",
    zIndex: 10,
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
