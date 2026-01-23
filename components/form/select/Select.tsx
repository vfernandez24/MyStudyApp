import Submit from "@/assets/icons/check-solid-full.svg";
import { default as QuestionCircle } from "@/assets/icons/circle-question-regular-full.svg";
import Exit from "@/assets/icons/right-from-bracket-solid-full.svg";
import Trash from "@/assets/icons/trash-solid.svg";
import colors from "@/constants/colors";
import { defaultPeriods } from "@/constants/defaultValues";
import eventsType from "@/constants/eventsType";
import genders from "@/constants/genders";
import typeGrades from "@/constants/grades";
import icons from "@/constants/icons";
import statusType from "@/constants/status";
import {
  grade,
  notification,
  period,
  subject,
  teacher,
} from "@/constants/types";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  BackHandler,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BasicElement from "./BasicElement";
import EventType from "./EventType";
import Gender from "./Gender";
import Grade from "./Grade";
import Notification from "./Notification";
import Status from "./Status";
import Subject from "./Subject";
import TypeGrade from "./TypeGrade";
//TODO      import Colors from "./ColorsIconsInput";

const overlayHeight = 550;
const windowWidth = Dimensions.get("window").width;

export type Props = {
  typeSelect:
    | "subjects"
    | "grades"
    | "periods"
    | "teachers"
    | "typeGrade"
    | "genders"
    | "notifications"
    | "status"
    | "typeEvents"
    | "colors"
    | "icons";
  grades?: grade[];
  subjects?: subject[];
  periods?: period[];
  teachers?: teacher[];
  gradeDef?: number;
  subjectDef?: number;
  periodDef?: number;
  teacherDef?: number;
  allDayDef?: boolean;
  typeEventsDef?: number;
  statusDef?: number;
  typeGradeDef?: number;
  genderDef?: number;
  iconDef?: number;
  colorDef?: number;
  notificationsDef?: notification[];
  setGrade?: (id: number) => void;
  setSubject?: (id: number) => void;
  setTypeEvents?: (id: number) => void;
  setColor?: (id: number) => void;
  setPeriod?: (id: number) => void;
  setTeacher?: (id: number) => void;
  setIcon?: (id: number) => void;
  setGender?: (id: number) => void;
  setStatus?: (id: number) => void;
  setTypeGrade?: (id: number) => void;
  setNotifications?: (id: notification[]) => void;
  overlay: boolean;
  setOverlay: (id: boolean) => void;
  overlayType:
    | "subjects"
    | "grades"
    | "periods"
    | "teachers"
    | "typeGrade"
    | "genders"
    | "notifications"
    | "status"
    | "typeEvents"
    | "colors"
    | "icons";
  isPersonal?: boolean;
};

function Select({
  grades = [],
  subjects = [],
  periods = defaultPeriods,
  teachers = [],
  gradeDef = -1,
  subjectDef = -1,
  periodDef = 0,
  teacherDef = -1,
  isPersonal = false,
  notificationsDef = [],
  allDayDef = false,
  typeGradeDef = 0,
  iconDef = 0,
  colorDef = 0,
  statusDef = 0,
  genderDef = 0,
  typeEventsDef = 0,
  setGrade = () => {},
  setSubject = () => {},
  setPeriod = () => {},
  setTypeEvents = () => {},
  setTeacher = () => {},
  setColor = () => {},
  setIcon = () => {},
  setGender = () => {},
  setStatus = () => {},
  setNotifications = () => {},
  setTypeGrade = () => {},
  overlay,
  overlayType,
  setOverlay,
}: Props) {
  //??      VISUAL THINGS      ??//
  const bottomAnim = useRef(new Animated.Value(-overlayHeight)).current;
  useEffect(() => {
    const backAction = () => {
      if (overlay) {
        setOverlay(false);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    return () => backHandler.remove();
  }, [overlay]);

  useEffect(() => {
    Animated.timing(bottomAnim, {
      toValue: overlay ? 0 : -overlayHeight - 100,
      duration: 300,
      useNativeDriver: false,
    }).start();

    if (!overlay) return;

    switch (overlayType) {
      case "subjects":
        if (subjectDef !== -1) setSelected(subjectDef);
        else setSelected(undefined);
        break;
      case "grades":
        if (gradeDef !== -1) setSelected(gradeDef);
        else setSelected(undefined);
        break;
      case "periods":
        setSelected(periodDef);
        break;
      case "teachers":
        if (teacherDef !== -1) setSelected(teacherDef);
        else setSelected(undefined);
        break;
      case "notifications":
        setNotificationsSelected(notificationsDef);
        break;
      case "typeEvents":
        setSelected(typeEventsDef);
        break;
      case "genders":
        setSelected(genderDef);
        break;
      case "status":
        setSelected(statusDef);
        break;
      case "typeGrade":
        setSelected(typeGradeDef);
        break;
      default:
        break;
    }
  }, [overlay, overlayType]);

  const shouldCenter = useMemo(() => {
    return (
      (overlayType === "subjects" && subjects.length === 0) ||
      (overlayType === "grades" &&
        (subjectDef === -1 ||
          grades.length === 0 ||
          grades.filter((g) => g.subject === subjectDef).length === 0))
    );
  }, [overlayType, grades, subjects, subjectDef]);

  const overlayLabel = useMemo(() => {
    switch (overlayType) {
      case "subjects":
        return "Seleccionar asignatura";
      case "grades":
        return "Seleccionar calificación";
      case "periods":
        return "Seleccionar periodo";
      case "teachers":
        return "Seleccionar profesor";
      case "typeGrade":
        return "Seleccionar tipo de calificación";
      case "genders":
        return "Seleccionar género";
      case "notifications":
        return "Seleccionar avisos";
      case "status":
        return "Seleccionar estado";
      case "typeEvents":
        return "Seleccionar tipo de evento";
      default:
        return "";
    }
  }, [overlayType]);

  useEffect(() => {
    let containerHeight = 0;
    switch (overlayType) {
      case "periods":
        containerHeight = Math.min(70 * periods.length, 400);
        break;
      case "typeGrade":
        containerHeight = 70 * typeGrades.length;
        break;
      case "typeEvents":
        containerHeight = 70 * eventsType.length;
        break;
      case "status":
        containerHeight = 70 * typeGrades.length;
        break;
      case "genders":
        containerHeight = 140;
        break;
      case "notifications":
        containerHeight = 60 * 3.5;
        break;
      default:
        containerHeight = 400;
    }
    overlayType === "periods"
      ? Math.min(70 * periods.length, 400)
      : overlayType === "typeGrade"
        ? Math.min(70 * 3, 400)
        : 400;
    setScrollHeight(containerHeight);
  }, [overlayType]);

  //!!      LOGIC TO HOOK      !!//
  const [selected, setSelected] = useState<number | undefined>(-1);
  const [notificationsSelected, setNotificationsSelected] =
    useState<notification[]>(notificationsDef);
  const [scrollHeight, setScrollHeight] = useState(0);

  useEffect(() => {
    if (grades.find((g) => g.id == gradeDef)) {
      if (grades.find((g) => g.id == gradeDef)?.subject !== subjectDef)
        setGrade(-1);
    }
  }, [subjectDef, grades, gradeDef, setGrade]);

  function submit() {
    switch (overlayType) {
      case "subjects":
        setSubject(selected ?? 0);
        break;
      case "genders":
        setGender(selected ?? 0);
        break;
      case "grades":
        setGrade(selected ?? 0);
        break;
      case "periods":
        setPeriod(selected ?? 0);
        break;
      case "teachers":
        setTeacher(selected ?? 0);
        break;
      case "typeGrade":
        setTypeGrade(selected ?? 0);
        break;
      case "status":
        setStatus(selected ?? 0);
        break;
      case "typeEvents":
        setTypeEvents(selected ?? 0);
        break;
      case "notifications":
        setNotifications(notificationsSelected);
        break;
    }
    setOverlay(!overlay);
  }

  const pressNumber = (id: number) => {
    setSelected(id);
  };

  return (
    <>
      <Animated.View
        style={[
          styles.overlayContainer,
          { bottom: bottomAnim, height: scrollHeight + 150 },
        ]}
      >
        <View
          style={{
            height: 50,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: "#0b0279",
              fontFamily: "InstrumentSans-SemiBold",
            }}
          >
            {overlayLabel}
          </Text>
        </View>
        <ScrollView
          style={[
            styles.elementsContainer,
            {
              height: scrollHeight,
              maxHeight: 400,
              paddingVertical:
                overlayType === "notifications" && allDayDef ? 0 : 20,
            },
          ]}
          contentContainerStyle={{
            minHeight: scrollHeight,
            justifyContent:
              overlayType === "notifications" && allDayDef
                ? "flex-start"
                : shouldCenter
                  ? "center"
                  : "flex-start",
            alignItems: "center",
          }}
        >
          {/* SUBJECTS */}
          {overlayType == "subjects" ? (
            subjects.length !== 0 ? (
              <>
                {isPersonal && (
                  <Subject
                    setSubject={setSubject}
                    subject={selected ?? subjects.length + 1}
                    s={{
                      color: 9,
                      icon: 50,
                      id: subjects.length + 1,
                      name: "Personal",
                      teacher: undefined,
                    }}
                    pressFunction={() => pressNumber(subjects.length + 1)}
                  />
                )}
                {subjects.map((s) => (
                  <Subject
                    key={s.id}
                    setSubject={setSubject}
                    subject={selected ?? subjects.length + 1}
                    s={s}
                    pressFunction={() => pressNumber(s.id)}
                  />
                ))}
              </>
            ) : (
              <View style={{ gap: 20, alignItems: "center" }}>
                <QuestionCircle height={50} width={60} fill="#999" />
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 35,
                    color: "#999",
                    fontFamily: "InstrumentSans-SemiBold",
                  }}
                >
                  Sin asignaturas
                </Text>
              </View>
            )
          ) : null}

          {/* GRADES */}
          {overlayType == "grades" ? (
            subjectDef !== -1 ? (
              grades.length !== 0 &&
              grades.filter((g) => g.subject == subjectDef).length !== 0 ? (
                grades
                  .filter((g) => g.subject == subjectDef)
                  .map((g) => (
                    <Grade
                      key={g.id}
                      setGrade={setGrade}
                      grade={selected ?? -1}
                      g={g}
                      pressFunction={() => pressNumber(g.id)}
                    />
                  ))
              ) : (
                <View style={{ gap: 20, alignItems: "center" }}>
                  <QuestionCircle height={50} width={60} fill="#999" />
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 35,
                      color: "#999",
                      fontFamily: "InstrumentSans-SemiBold",
                    }}
                  >
                    Sin calificaciones
                  </Text>
                </View>
              )
            ) : (
              <View style={{ gap: 20, alignItems: "center" }}>
                <QuestionCircle height={50} width={60} fill="#999" />
                <Text
                  style={{
                    fontSize: 35,
                    textAlign: "center",
                    color: "#999",
                    fontFamily: "InstrumentSans-SemiBold",
                  }}
                >
                  Selecciona una asignatura para poder seleccionar una
                  calificación
                </Text>
              </View>
            )
          ) : null}

          {/* GENDERS */}
          {overlayType == "genders"
            ? genders.map((g) => (
                <Gender
                  key={g.id}
                  s={g}
                  genderSelected={selected ?? 0}
                  pressFunction={() => {
                    setSelected(g.id);
                  }}
                />
              ))
            : null}

          {/* TEACHERS */}
          {overlayType == "teachers"
            ? teachers.map((t) => (
                <BasicElement
                  key={t.id}
                  element={t}
                  overlayType="teachers"
                  teacher={selected}
                  pressFunction={() => pressNumber(t.id)}
                />
              ))
            : null}

          {/* PERIODS */}
          {overlayType == "periods"
            ? periods.map((p) => (
                <BasicElement
                  key={p.id}
                  element={p}
                  overlayType="periods"
                  period={selected}
                  pressFunction={() => pressNumber(p.id)}
                />
              ))
            : null}

          {/* TYPES GRADE */}
          {overlayType == "typeGrade"
            ? typeGrades.map((t) => (
                <TypeGrade
                  key={t.id}
                  typeSelected={selected ?? 0}
                  s={t}
                  pressFunction={() => setSelected(t.id)}
                />
              ))
            : null}

          {/* STATUS */}
          {overlayType == "status"
            ? statusType.map((t) => (
                <Status
                  key={t.id}
                  typeSelected={selected ?? 0}
                  s={t}
                  pressFunction={() => setSelected(t.id)}
                />
              ))
            : null}

          {/* TYPE EVENT */}
          {overlayType == "typeEvents"
            ? eventsType.map((type) => (
                <EventType
                  pressFunction={() => setSelected(type.id)}
                  t={type}
                  typeSelected={selected ?? 0}
                  key={type.value}
                />
              ))
            : null}

          {/* NOTIFICATIONS */}
          {overlayType == "notifications"
            ? allDayDef
              ? notificationsDef
                  .filter((t) => t.time >= 1 * 24 * 60 * 60 * 1000)
                  .map((t) => (
                    <Notification
                      key={t.id}
                      isSelected={notificationsSelected.some(
                        (n) => n.id === t.id,
                      )}
                      not={t}
                      pressFunction={() => {
                        let newNotifications;
                        if (notificationsSelected.includes(t)) {
                          newNotifications = notificationsSelected.filter(
                            (n) => n.id !== t.id,
                          );
                        } else {
                          newNotifications = [...notificationsSelected, t];
                        }
                        setNotificationsSelected(newNotifications);
                      }}
                    />
                  ))
              : notificationsDef.map((t) => (
                  <Notification
                    key={t.id}
                    isSelected={notificationsSelected.some(
                      (n) => n.id === t.id,
                    )}
                    not={t}
                    pressFunction={() => {
                      let newNotifications;
                      if (notificationsSelected.includes(t)) {
                        newNotifications = notificationsSelected.filter(
                          (n) => n.id !== t.id,
                        );
                      } else {
                        newNotifications = [...notificationsSelected, t];
                      }
                      setNotificationsSelected(newNotifications);
                    }}
                  />
                ))
            : null}

          {/* COLORS */}
          {overlayType === "colors" ? (
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: Dimensions.get("window").width * (1 / 11),
                paddingHorizontal: Dimensions.get("window").width * (1 / 11),
                paddingVertical: Dimensions.get("window").width * (1 / 11),
                rowGap: Dimensions.get("window").width * (1 / 11),
              }}
            >
              {colors.map((color) => (
                <View
                  style={{
                    width: Dimensions.get("window").width * (1 / 11),
                    height: Dimensions.get("window").width * (1 / 11),
                    backgroundColor: color.hex,
                    borderRadius: 100,
                  }}
                ></View>
              ))}
            </View>
          ) : null}

          {/* ICONS */}
          {overlayType === "colors" ? (
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: Dimensions.get("window").width * (1 / 11),
                paddingHorizontal: Dimensions.get("window").width * (1 / 11),
                paddingVertical: Dimensions.get("window").width * (1 / 11),
                rowGap: Dimensions.get("window").width * (1 / 11),
              }}
            >
              {icons.map((icon) => (
                <View
                  style={{
                    width: Dimensions.get("window").width * (1 / 11),
                    height: Dimensions.get("window").width * (1 / 11),
                    backgroundColor: "#dcdcdcff",
                    borderRadius: 100,
                  }}
                >
                  {icon.icon}
                </View>
              ))}
            </View>
          ) : null}

          <View style={{ height: 50 }} />
        </ScrollView>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: "rgba(255, 0, 0, 0.45)",
                display: shouldCenter
                  ? "none"
                  : overlayType === "grades" ||
                      overlayType === "teachers" ||
                      overlayType === "notifications"
                    ? "flex"
                    : "none",
              },
            ]}
            onPress={() => {
              if (overlayType === "grades") {
                setGrade(-1);
              } else if (overlayType === "teachers") {
                setTeacher(-1);
              } else {
                setNotifications([]);
              }
              setOverlay(!overlay);
            }}
          >
            <Trash height={30} width={30} fill={"#fff"} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: "#0b0279",
                display: shouldCenter ? "none" : "flex",
              },
            ]}
            onPress={submit}
          >
            <Submit height={30} width={30} fill={"#fff"} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: "#0b0279",
                display: shouldCenter ? "flex" : "none",
              },
            ]}
            onPress={() => setOverlay(!overlay)}
          >
            <Exit height={30} width={30} fill={"#fff"} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
}

export default Select;

const styles = StyleSheet.create({
  overlayContainer: {
    position: "absolute",
    transitionProperty: "bottom",
    transitionDuration: "0.3s",
    left: 0,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    gap: 0,
    height: 500,
    width: windowWidth,
    zIndex: 21,
    borderTopEndRadius: 40,
    borderTopStartRadius: 40,
  },
  elementsContainer: {
    height: 400,
    width: windowWidth,
    gap: 20,
    flexDirection: "column",
    paddingHorizontal: 10,
  },
  buttonsContainer: {
    height: 100,
    width: windowWidth,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  button: {
    height: 60,
    width: windowWidth * 0.4,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
});
