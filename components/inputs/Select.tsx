import Submit from "@/assets/icons/check-solid-full.svg";
import QuestionCircle from "@/assets/icons/circle-question-regular-full.svg";
import Exit from "@/assets/icons/right-from-bracket-solid-full.svg";
import Trash from "@/assets/icons/trash-solid.svg";
import { defaultPeriods } from "@/constants/defaultValues";
import { grade, period, subject, teacher } from "@/constants/types";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Grade from "../listPages/select/Grade";
import Subject from "../listPages/select/Subject";
import BasicElement from "./BasicElement";
import Gender from "./Gender";
import TypeGrade from "./TypeGrade";

const overlayHeight = 500;
const windowWidth = Dimensions.get("window").width;

type Props = {
  typeSelect:
    | "subjects"
    | "grades"
    | "periods"
    | "teachers"
    | "typeGrade"
    | "genders";
  grades?: grade[];
  subjects?: subject[];
  periods?: period[];
  teachers?: teacher[];
  grade?: number;
  subject?: number;
  period?: number;
  teacher?: number;
  typeGrade?: "write" | "oral" | "practical";
  gender?: "male" | "female";
  setGrade?: (id: number) => void;
  setSubject?: (id: number) => void;
  setPeriod?: (id: number) => void;
  setTeacher?: (id: number) => void;
  setGender?: (id: "male" | "female") => void;
  setTypeGrade?: (id: "write" | "oral" | "practical") => void;
  overlay: boolean;
  setOverlay: (id: boolean) => void;
  overlayType:
    | "subjects"
    | "grades"
    | "periods"
    | "teachers"
    | "typeGrade"
    | "genders";
};

function Select({
  grades = [],
  subjects = [],
  periods = defaultPeriods,
  teachers = [],
  grade = -1,
  subject = -1,
  period = 0,
  teacher = -1,
  typeGrade = "write",
  gender = "male",
  setGrade = () => {},
  setSubject = () => {},
  setPeriod = () => {},
  setTeacher = () => {},
  setGender = () => {},
  setTypeGrade = () => {},
  overlay,
  overlayType,
  setOverlay,
}: Props) {
  const bottomAnim = useRef(new Animated.Value(-overlayHeight)).current;

  const [selected, setSelected] = useState<number | undefined>(-1);
  const [genderSelected, setGenderSelected] = useState<"male" | "female">(
    gender
  );
  const [typeSelected, setTypeSelected] = useState<
    "write" | "oral" | "practical"
  >(typeGrade);
  const [scrollHeight, setScrollHeight] = useState(0);
  const genders: {
    id: number;
    type: "male" | "female";
    text: "Hombre" | "Mujer";
  }[] = [
    { id: 0, type: "male", text: "Hombre" },
    { id: 1, type: "female", text: "Mujer" },
  ];

  const typeGrades: { id: number; type: "write" | "oral" | "practical" }[] = [
    { id: 0, type: "write" },
    { id: 1, type: "oral" },
    { id: 2, type: "practical" },
  ];

  useEffect(() => {
    let containerHeight = 0;
    switch (overlayType) {
      case "periods":
        containerHeight = Math.min(70 * periods.length, 400);
        break;
      case "typeGrade":
        containerHeight = 70 * typeGrades.length;
        break;
      case "genders":
        containerHeight = 140;
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

  useEffect(() => {
    Animated.timing(bottomAnim, {
      toValue: overlay ? 0 : -overlayHeight - 100,
      duration: 300,
      useNativeDriver: false,
    }).start();

    if (overlayType === "subjects") {
      if (subject !== -1) setSelected(subject);
      else setSelected(undefined);
    } else if (overlayType === "grades") {
      if (grade !== -1) setSelected(grade);
      else setSelected(undefined);
    } else if (overlayType === "periods") {
      setSelected(period);
    } else if (overlayType === "teachers") {
      if (teacher !== -1) setSelected(teacher);
      else setSelected(undefined);
    } else {
      setSelected(undefined);
    }
  }, [overlay, overlayType, grade, subject, period, teacher]);

  useEffect(() => {
    if (grades.find((g) => g.id == grade)) {
      if (grades.find((g) => g.id == grade)?.subject !== subject) setGrade(-1);
    }
  }, [subject, grades, grade, setGrade]);

  function submit() {
    switch (overlayType) {
      case "subjects":
        setSubject(selected ?? 0);
        break;
      case "genders":
        setGender(genderSelected);
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
        setTypeGrade(typeSelected);
        break;
    }
    setOverlay(!overlay);
  }

  const pressNumber = (id: number) => {
    setSelected(id);
  };

  const shouldCenter = useMemo(() => {
    return (
      (overlayType === "subjects" && subjects.length === 0) ||
      (overlayType === "grades" &&
        (subject === -1 ||
          grades.length === 0 ||
          grades.filter((g) => g.subject === subject).length === 0))
    );
  }, [overlayType, grades, subjects, subject]);

  return (
    <>
      <Animated.View
        style={[
          styles.overlayContainer,
          { bottom: bottomAnim, height: scrollHeight + 100 },
        ]}
      >
        <ScrollView
          style={[
            styles.elementsContainer,
            {
              height: scrollHeight,
              maxHeight: 400,
            },
          ]}
          contentContainerStyle={{
            minHeight: scrollHeight,
            justifyContent: shouldCenter ? "center" : "flex-start",
            alignItems: "center",
          }}
        >
          {/* SUBJECTS */}
          {overlayType == "subjects" ? (
            subjects.length !== 0 ? (
              subjects.map((s) => (
                <Subject
                  key={s.id}
                  setSubject={setSubject}
                  subject={selected ?? -1}
                  s={s}
                  pressFunction={() => pressNumber(s.id)}
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
                  Sin asignaturas
                </Text>
              </View>
            )
          ) : null}

          {/* GRADES */}
          {overlayType == "grades" ? (
            subject !== -1 ? (
              grades.length !== 0 &&
              grades.filter((g) => g.subject == subject).length !== 0 ? (
                grades
                  .filter((g) => g.subject == subject)
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
                  genderSelected={genderSelected}
                  pressFunction={() => {
                    setGenderSelected(g.type);
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
                  typeSelected={typeSelected}
                  s={t}
                  pressFunction={() => setTypeSelected(t.type)}
                />
              ))
            : null}
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
                  : overlayType === "grades" || overlayType === "teachers"
                  ? "flex"
                  : "none",
              },
            ]}
            onPress={() => {
              if (overlayType === "grades") setGrade(-1);
              else setTeacher(-1);
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
    paddingVertical: 20,
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
