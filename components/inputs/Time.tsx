import Check from "@/assets/icons/check-solid-full.svg";
import XMark from "@/assets/icons/xmark-solid.svg";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const windowWidth = Dimensions.get("window").width;

type Props = {
  startTime: Date | undefined;
  setStartTime: (id: Date | undefined) => void;
  finishedTime: Date | undefined;
  setFinishedTime: (id: Date | undefined) => void;
  allDay: boolean;
  setAllDay: (id: boolean) => void;
  overlay: boolean;
  setOverlay: (id: boolean) => void;
  setOverlayTime: (id: boolean) => void;
  dateExam: Date;
};

const Time = ({
  allDay,
  setAllDay,
  finishedTime,
  setFinishedTime,
  setStartTime,
  startTime,
  overlay,
  dateExam,
  setOverlay,
  setOverlayTime,
}: Props) => {
  const date = new Date();

  // Datos provisionales dentro del formulario
  const [stime, setStime] = useState<Date>(
    new Date(startTime ?? date.setHours(date.getHours() + 1, 0, 0, 0))
  ); // Start Time
  const [ftime, setFtime] = useState<Date>(
    new Date(finishedTime ?? date.setHours(date.getHours() + 2, 0, 0, 0))
  ); // Finish Time
  const [day, setDay] = useState(allDay); // AllDay

  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<"finish" | "start">("start");

  function combineDates(baseDate: Date, time: Date) {
    return new Date(
      baseDate.getFullYear(),
      baseDate.getMonth(),
      baseDate.getDate(),
      time.getHours(),
      time.getMinutes(),
      time.getSeconds(),
      time.getMilliseconds()
    );
  }

  const onChange = (_event: any, selectedDate?: Date) => {
    setShow(Platform.OS === "ios");

    if (selectedDate) {
      const combined = combineDates(dateExam, selectedDate);

      if (mode === "start") {
        if (combined > ftime) {
          const newF = new Date(combined);
          newF.setHours(newF.getHours() + 1);
          setFtime(newF);
        }
        setStime(combined);
      } else {
        setFtime(combined);
      }
    }
  };

  function submit() {
    if (day) {
      setStartTime(undefined);
      setFinishedTime(undefined);
    } else {
      setStartTime(stime);
      setFinishedTime(ftime);
    }
    setAllDay(day);
    setOverlay(false);
    setOverlayTime(false);
  }

  return (
    <>
      {/* Input (Overlay) */}
      {show && (
        <DateTimePicker
          value={mode === "start" ? stime : ftime}
          onChange={onChange}
          mode="time"
          is24Hour={true}
        />
      )}

      <View style={[styles.container, { display: overlay ? "flex" : "none" }]}>
        <View style={styles.titleDiv}>
          <Text style={styles.title}>DURACION</Text>

          <TouchableOpacity
            onPress={() => {
              setOverlay(false);
              setOverlayTime(false);
            }}
            style={styles.exitButton}
          >
            <XMark height={35} width={35} fill="#0b0279" />
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.allDayDiv}>
            <Text style={styles.allDayDivText}>Todo el día</Text>
            <TouchableOpacity
              onPress={() => {
                setDay(!day);
              }}
              style={[
                styles.allDayDivCheckBox,
                {
                  justifyContent: day ? "flex-end" : "flex-start",
                  backgroundColor: day ? "#23198d27" : "#ececec",
                },
              ]}
            >
              <View
                style={[
                  styles.allDayDivCheckBoxCircle,
                  {
                    backgroundColor: day ? "#0b0279" : "#777",
                  },
                ]}
              ></View>
            </TouchableOpacity>
          </View>

          <View style={styles.timeDiv}>
            <Text style={styles.timeTitle}>Inicio</Text>

            <View style={styles.timeButtonContainer}>
              <TouchableOpacity
                style={[
                  styles.timeButton,
                  {
                    backgroundColor: day ? "#ececec" : "#ffffff",
                    borderColor: day ? "#ececec" : "#b8cfffff",
                  },
                ]}
                onPress={() => {
                  setMode("start");
                  setShow(true);
                }}
              >
                <Text
                  style={[
                    styles.timeButtonText,
                    {
                      display: !day ? "flex" : "none",
                    },
                  ]}
                >{`${stime.getHours()}`}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.timeButton,
                  {
                    backgroundColor: day ? "#ececec" : "#ffffff",
                    borderColor: day ? "#ececec" : "#b8cfffff",
                  },
                ]}
                onPress={() => {
                  setMode("start");
                  setShow(true);
                }}
              >
                <Text
                  style={[
                    styles.timeButtonText,
                    {
                      display: !day ? "flex" : "none",
                    },
                  ]}
                >{`${stime.getMinutes()}`}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.timeDiv}>
            <Text style={styles.timeTitle}>Final</Text>

            <View style={styles.timeButtonContainer}>
              <TouchableOpacity
                style={[
                  styles.timeButton,
                  {
                    backgroundColor: day ? "#ececec" : "#ffffff",
                    borderColor: day ? "#ececec" : "#b8cfffff",
                  },
                ]}
                onPress={() => {
                  setMode("finish");
                  setShow(true);
                }}
              >
                <Text
                  style={[
                    styles.timeButtonText,
                    {
                      display: !day ? "flex" : "none",
                    },
                  ]}
                >{`${ftime.getHours()}`}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.timeButton,
                  {
                    backgroundColor: day ? "#ececec" : "#ffffff",
                    borderColor: day ? "#ececec" : "#b8cfffff",
                  },
                ]}
                onPress={() => {
                  setMode("finish");
                  setShow(true);
                }}
              >
                <Text
                  style={[
                    styles.timeButtonText,
                    {
                      display: !day ? "flex" : "none",
                    },
                  ]}
                >{`${ftime.getMinutes()}`}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View
          style={{
            flex: 1,
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={[
              styles.submitButton,
              {
                backgroundColor: "#0b0279",
                width: (windowWidth * 0.7 - 40) * 0.4,
              },
            ]}
            onPress={submit}
          >
            <Check height={35} width={35} fill="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default Time;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    transitionProperty: "bottom",
    transitionDuration: "0.3s",
    top: "50%",
    left: "50%",
    transform: [{ translateX: "-40%" }, { translateY: "-40%" }],
    backgroundColor: "#fff",
    gap: 10,
    height: 450,
    width: windowWidth * 0.8,
    zIndex: 21,
    borderRadius: 40,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  titleDiv: {
    height: 70,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  exitButton: {
    height: 45,
    width: 45,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 65,
  },
  form: {},
  title: {
    fontSize: 30,
    color: "#6C98F7",
    textAlign: "left",
    fontFamily: "InstrumentSans-Bold",
    letterSpacing: 5,
  },
  allDayDiv: {
    height: 60,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 20,
  },
  allDayDivText: {
    fontFamily: "InstrumentSans-Bold",
    fontSize: 30,
  },
  allDayDivCheckBox: {
    height: 40,
    width: 80,
    borderRadius: 40,
    padding: 12.5,
    flexDirection: "row",
    alignItems: "center",
  },
  allDayDivCheckBoxCircle: {
    height: 25,
    width: 25,
    borderRadius: 25,
  },
  timeDiv: {
    height: 100,
    width: "100%",
    justifyContent: "space-evenly",
  },
  timeTitle: {
    fontSize: 20,
    fontFamily: "InstrumentSans-Medium",
  },
  timeButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  timeButton: {
    height: 60,
    width: 80,
    borderWidth: 2.5,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButton: {
    height: 60,
    width: (windowWidth * 0.7 - 40) * 0.4,
    borderWidth: 2.5,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  timeButtonText: {
    fontSize: 30,
    fontFamily: "InstrumentSans-SemiBold",
    color: "#0b0279",
  },
});
