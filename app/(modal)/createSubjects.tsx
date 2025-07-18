import ArrowLeft from "@/assets/icons/arrow-left-solid.svg";
import ChevronDown from "@/assets/icons/chevron-down-solid.svg";
import Save from "@/assets/icons/floppy-disk-solid.svg";
import Pen from "@/assets/icons/pen-solid.svg";
import Teachers from "@/assets/icons/person-chalkboard-solid.svg";
import colors from "@/constants/colors";
import { defaultSubjects, defaultTeachers } from "@/constants/defaultValues";
import icons from "@/constants/icons";
import { subject, teacher } from "@/constants/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Dimensions,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const CreatePage = () => {
  const [overlay, setOverlay] = useState<boolean>(false);

  const [subjects, setSubjects] = useState<subject[]>(defaultSubjects);
  const [prevTeachers, setPrevTeachers] = useState<teacher[]>();

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const subjectsAwait = await AsyncStorage.getItem("subjects");
          const teachersAwait = await AsyncStorage.getItem("teachers");
          const typeFormAwait = await AsyncStorage.getItem("typeSubject");
          const idEditAwait = await AsyncStorage.getItem("idEdit");

          const parsedSubjects: subject[] = subjectsAwait
            ? JSON.parse(subjectsAwait)
            : defaultSubjects;
          const parsedTeachers: teacher[] = teachersAwait
            ? JSON.parse(teachersAwait)
            : defaultTeachers;

          setSubjects(parsedSubjects);
          setPrevTeachers(parsedTeachers);

          const formType = typeFormAwait ?? "create";
          setTypeForm(formType);

          if (formType === "edit" && idEditAwait) {
            const id = Number(idEditAwait);
            setEditId(id);

            const current = parsedSubjects.find((g) => g.id === id);
            if (current) {
              setName(current.name);
              setIcon(current.icon);
              setColor(current.color);
              setTeachers(current.teacher);
            }
          }
        } catch (error) {
          console.error("❌ Error al cargar datos:", error);
        }
      };

      fetchData();
    }, [])
  );

  const [typeSelect, setTypeSelect] = useState<"color" | "icon">();

  const [name, setName] = useState("");
  const [color, setColor] = useState(-1);
  const [icon, setIcon] = useState(-1);
  const [teachers, setTeachers] = useState<number>(-1);

  const [error, setError] = useState<{
    name: boolean;
  }>({
    name: false,
  });

  const [typeForm, setTypeForm] = useState<string>("create");
  const [editId, setEditId] = useState<number | null>(null);

  function checkData() {
    const isNameValid = name !== "";

    setError({
      name: !isNameValid,
    });

    if (icon === -1) {
      const randomNumber = Math.floor(Math.random() * (24 - 0 + 1) + 0);
      setIcon(randomNumber);
    }

    if (color === -1) {
      const randomNumber = Math.floor(Math.random() * (24 - 0 + 1) + 0);
      setColor(randomNumber);
    }

    return isNameValid;
  }

  async function submit() {
    let newSubjects: subject[] = subjects;
    const isValid = checkData();
    const id = subjects.length > 0 ? subjects[subjects.length - 1].id + 1 : 0;

    if (isValid) {
      const newSubject: subject = {
        name: name,
        color: color,
        icon: icon,
        teacher: teachers,
        id: id,
      };
      if (typeForm == "create") {
        newSubjects = [...subjects, newSubject];
      } else {
        newSubjects = subjects.map((sub) =>
          sub.id === editId ? newSubject : sub
        );
      }

      const stringfySubjects = JSON.stringify(newSubjects);
      await AsyncStorage.setItem("subjects", stringfySubjects);

      router.push("/(drawer)/subjects");
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        {/* Overlay */}
        <TouchableOpacity
          onPress={() => setOverlay(false)}
          style={[
            styles.overlay,
            { display: overlay == true ? "flex" : "none" },
          ]}
        ></TouchableOpacity>

        <ScrollView
          style={[
            styles.overlayDiv,
            {
              display: overlay == true ? "flex" : "none",
              height: typeSelect == "icon" ? 325 : "auto",
            },
          ]}
        >
          <View style={styles.colorsOverlayRow}>
            {typeSelect == "color"
              ? colors
                  .filter((col) => col.id <= 4)
                  .map((col) => (
                    <TouchableOpacity
                      onPress={() => {
                        setColor(col.id), setOverlay(false);
                      }}
                      style={[styles.colorsOverlayColorDiv]}
                      key={col.id}
                    >
                      <View
                        style={[
                          styles.colorsOverlayColor,
                          { backgroundColor: col.hex },
                        ]}
                      ></View>
                    </TouchableOpacity>
                  ))
              : icons
                  .filter((i) => i.id <= 4)
                  .map((i) => (
                    <TouchableOpacity
                      onPress={() => {
                        setIcon(i.id), setOverlay(false);
                      }}
                      style={styles.colorsOverlayColorDiv}
                      key={i.id}
                    >
                      {i.icon}
                    </TouchableOpacity>
                  ))}
          </View>
          <View style={styles.colorsOverlayRow}>
            {typeSelect == "color"
              ? colors
                  .filter((col) => col.id <= 9 && col.id > 4)
                  .map((col) => (
                    <TouchableOpacity
                      onPress={() => {
                        setColor(col.id), setOverlay(false);
                      }}
                      style={[styles.colorsOverlayColorDiv]}
                      key={col.id}
                    >
                      <View
                        style={[
                          styles.colorsOverlayColor,
                          { backgroundColor: col.hex },
                        ]}
                      ></View>
                    </TouchableOpacity>
                  ))
              : icons
                  .filter((i) => i.id <= 9 && i.id > 4)
                  .map((i) => (
                    <TouchableOpacity
                      onPress={() => {
                        setIcon(i.id), setOverlay(false);
                      }}
                      style={styles.colorsOverlayColorDiv}
                      key={i.id}
                    >
                      {i.icon}
                    </TouchableOpacity>
                  ))}
          </View>
          <View style={styles.colorsOverlayRow}>
            {typeSelect == "color"
              ? colors
                  .filter((col) => col.id <= 14 && col.id > 9)
                  .map((col) => (
                    <TouchableOpacity
                      onPress={() => {
                        setColor(col.id), setOverlay(false);
                      }}
                      style={[styles.colorsOverlayColorDiv]}
                      key={col.id}
                    >
                      <View
                        style={[
                          styles.colorsOverlayColor,
                          { backgroundColor: col.hex },
                        ]}
                      ></View>
                    </TouchableOpacity>
                  ))
              : icons
                  .filter((i) => i.id <= 14 && i.id > 9)
                  .map((i) => (
                    <TouchableOpacity
                      onPress={() => {
                        setIcon(i.id), setOverlay(false);
                      }}
                      style={styles.colorsOverlayColorDiv}
                      key={i.id}
                    >
                      {i.icon}
                    </TouchableOpacity>
                  ))}
          </View>
          <View style={styles.colorsOverlayRow}>
            {typeSelect == "color"
              ? colors
                  .filter((col) => col.id <= 19 && col.id > 14)
                  .map((col) => (
                    <TouchableOpacity
                      onPress={() => {
                        setColor(col.id), setOverlay(false);
                      }}
                      style={[styles.colorsOverlayColorDiv]}
                      key={col.id}
                    >
                      <View
                        style={[
                          styles.colorsOverlayColor,
                          { backgroundColor: col.hex },
                        ]}
                      ></View>
                    </TouchableOpacity>
                  ))
              : icons
                  .filter((i) => i.id <= 19 && i.id > 14)
                  .map((i) => (
                    <TouchableOpacity
                      onPress={() => {
                        setIcon(i.id), setOverlay(false);
                      }}
                      style={styles.colorsOverlayColorDiv}
                      key={i.id}
                    >
                      {i.icon}
                    </TouchableOpacity>
                  ))}
          </View>
          <View style={styles.colorsOverlayRow}>
            {typeSelect == "color"
              ? colors
                  .filter((col) => col.id > 19)
                  .map((col) => (
                    <TouchableOpacity
                      onPress={() => {
                        setColor(col.id), setOverlay(false);
                      }}
                      style={[styles.colorsOverlayColorDiv]}
                      key={col.id}
                    >
                      <View
                        style={[
                          styles.colorsOverlayColor,
                          { backgroundColor: col.hex },
                        ]}
                      ></View>
                    </TouchableOpacity>
                  ))
              : icons
                  .filter((i) => i.id > 19 && i.id <= 24)
                  .map((i) => (
                    <TouchableOpacity
                      onPress={() => {
                        setIcon(i.id), setOverlay(false);
                      }}
                      style={styles.colorsOverlayColorDiv}
                      key={i.id}
                    >
                      {i.icon}
                    </TouchableOpacity>
                  ))}
          </View>

          {typeSelect == "icon" ? (
            <>
              <View style={styles.colorsOverlayRow}>
                {icons
                  .filter((i) => i.id > 24 && i.id <= 29)
                  .map((i) => (
                    <TouchableOpacity
                      onPress={() => {
                        setIcon(i.id), setOverlay(false);
                      }}
                      style={styles.colorsOverlayColorDiv}
                      key={i.id}
                    >
                      {i.icon}
                    </TouchableOpacity>
                  ))}
              </View>
              <View style={styles.colorsOverlayRow}>
                {icons
                  .filter((i) => i.id > 29 && i.id <= 34)
                  .map((i) => (
                    <TouchableOpacity
                      onPress={() => {
                        setIcon(i.id), setOverlay(false);
                      }}
                      style={styles.colorsOverlayColorDiv}
                      key={i.id}
                    >
                      {i.icon}
                    </TouchableOpacity>
                  ))}
              </View>
              <View style={styles.colorsOverlayRow}>
                {icons
                  .filter((i) => i.id > 34 && i.id <= 39)
                  .map((i) => (
                    <TouchableOpacity
                      onPress={() => {
                        setIcon(i.id), setOverlay(false);
                      }}
                      style={styles.colorsOverlayColorDiv}
                      key={i.id}
                    >
                      {i.icon}
                    </TouchableOpacity>
                  ))}
              </View>
              <View style={styles.colorsOverlayRow}>
                {icons
                  .filter((i) => i.id > 39 && i.id <= 44)
                  .map((i) => (
                    <TouchableOpacity
                      onPress={() => {
                        setIcon(i.id), setOverlay(false);
                      }}
                      style={styles.colorsOverlayColorDiv}
                      key={i.id}
                    >
                      {i.icon}
                    </TouchableOpacity>
                  ))}
              </View>
              <View style={styles.colorsOverlayRow}>
                {icons
                  .filter((i) => i.id > 44 && i.id <= 49)
                  .map((i) => (
                    <TouchableOpacity
                      onPress={() => {
                        setIcon(i.id), setOverlay(false);
                      }}
                      style={styles.colorsOverlayColorDiv}
                      key={i.id}
                    >
                      {i.icon}
                    </TouchableOpacity>
                  ))}
              </View>
            </>
          ) : null}
          {typeSelect == "icon" ? <View style={{ height: 20 }}></View> : null}
        </ScrollView>

        {/* Button exit */}
        <TouchableOpacity
          style={styles.buttonExit}
          onPress={() => router.push("/(drawer)/subjects")}
        >
          <ArrowLeft height={35} width={35} fill={"#6C98F7"} />
        </TouchableOpacity>

        {/* Button submit */}
        <TouchableOpacity onPress={submit} style={styles.buttonAdd}>
          <View
            style={{
              width: "40%",
              height: 50,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Save height={30} width={30} fill={"#fff"} />
          </View>
          <Text style={styles.buttonAddText}>Guardar</Text>
        </TouchableOpacity>

        {/* FORM */}
        <View style={styles.form}>
          <View style={styles.inputsContainer}>
            <View style={styles.label}>
              <View style={styles.iconDiv}>
                <Pen height={35} width={35} fill="#0b0279" />
              </View>
              <TextInput
                style={{
                  minHeight: "100%",
                  width: "75%",
                  borderWidth: 2,
                  borderRadius: 10,
                  padding: 5,
                  paddingHorizontal: 10,
                  borderColor: error.name == true ? "#f00" : "#d3d3d3",
                  fontSize: 18,
                }}
                placeholder="Nombre"
                value={name}
                onChangeText={(e) => setName(e)}
              ></TextInput>
            </View>
          </View>

          <View style={styles.inputsContainer}>
            <View style={styles.labelSelects}>
              <TouchableOpacity
                onPress={() => {
                  setTypeSelect("icon");
                  setOverlay(true);
                  Keyboard.dismiss();
                }}
                style={styles.selectIcon}
              >
                {icons[icon] ? (
                  <MaterialCommunityIcons
                    name={icons[icon].name}
                    size={40}
                    color={"#6C98F7"}
                  />
                ) : null}
                <ChevronDown
                  height={20}
                  fill="#0b0279"
                  width={20}
                ></ChevronDown>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setTypeSelect("color");
                  setOverlay(true);
                  Keyboard.dismiss();
                }}
                style={styles.selectColor}
              >
                {colors[color] ? (
                  <View
                    style={{
                      height: "100%",
                      width: "80%",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <View
                      style={[
                        styles.selectColorBg,
                        { backgroundColor: colors[color].hex },
                      ]}
                    ></View>
                    <Text
                      style={{
                        fontFamily: "InstrumentSans-Medium",
                        fontSize: 17,
                        maxWidth: "50%",
                      }}
                    >
                      {colors[color].name}
                    </Text>
                  </View>
                ) : (
                  <View
                    style={{
                      height: "100%",
                      width: "80%",
                      justifyContent: "center",
                      padding: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "InstrumentSans-Medium",
                        fontSize: 20,
                        color: "#999",
                      }}
                    >
                      Sin color
                    </Text>
                  </View>
                )}
                <View
                  style={{
                    height: "100%",
                    width: "20%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ChevronDown
                    height={20}
                    width={20}
                    fill="#0b0279"
                  ></ChevronDown>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputsContainer}>
            <TouchableOpacity style={styles.label} onPress={Keyboard.dismiss}>
              <View style={styles.iconDiv}>
                <Teachers height={35} width={35} fill="#0b0279" />
              </View>
              <View
                style={{
                  borderColor: "#d3d3d3",
                  borderWidth: 2,
                  width: "75%",
                  borderRadius: 10,
                }}
              >
                <Picker
                  selectedValue={teachers}
                  style={{
                    width: "100%",
                    height: "100%",
                    paddingHorizontal: 10,
                    borderColor: "#d3d3d3",
                    fontSize: 18,
                    fontFamily: "InstrumentSans-Medium",
                  }}
                  onValueChange={(e) => setTeachers(e)}
                >
                  <Picker.Item label={""} value={undefined} />
                  {prevTeachers &&
                    prevTeachers.map((teacher, index) => (
                      <Picker.Item
                        label={teacher.name}
                        key={index}
                        value={teacher.id}
                        fontFamily="InstrumentSans-Medium"
                      />
                    ))}
                </Picker>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CreatePage;

const styles = StyleSheet.create({
  container: {
    padding: 25,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    minHeight: "100%",
    height: screenHeight,
    width: screenWidth,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: screenWidth,
    height: screenHeight,
    backgroundColor: "#0000003d",
    zIndex: 20,
  },
  overlayDiv: {
    position: "absolute",
    zIndex: 25,
    width: "auto",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    display: "flex",
    gap: 15,
    top: "50%",
    left: "50%",
    transform: [{ translateX: "-40%" }, { translateY: "-40%" }],
    paddingBottom: 20,
  },
  colorsOverlayRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    paddingVertical: 10,
  },
  colorsOverlayColorDiv: {
    backgroundColor: "#ececec",
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  colorsOverlayColor: {
    height: 30,
    width: 30,
    borderRadius: "100%",
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
  buttonAdd: {
    height: 50,
    width: 172,
    alignSelf: "flex-end",
    flexDirection: "row",
    padding: 10,
    borderRadius: 15,
    backgroundColor: "#0b0279",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonAddText: {
    width: "60%",
    height: 50,
    lineHeight: 55,
    fontSize: 20,
    color: "#fff",
    fontFamily: "InstrumentSans-SemiBold",
    letterSpacing: 2,
  },
  form: {
    display: "flex",
    gap: 10,
    paddingTop: 35,
  },
  inputsContainer: {
    paddingBottom: 55,
    gap: 10,
  },
  label: {
    height: 65,
    width: "100%",
    flexDirection: "row",
    paddingVertical: 5,
    gap: "5%",
  },
  iconDiv: {
    height: "100%",
    width: "20%",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    height: 35,
    objectFit: "contain",
  },
  input: {
    height: "100%",
    width: "75%",
    borderWidth: 2,
    borderRadius: 10,
    padding: 5,
    paddingHorizontal: 10,
    borderColor: "#d3d3d3",
    fontSize: 18,
  },
  inputText: {
    lineHeight: 50,
  },
  labelSelects: {
    flexDirection: "row",
    height: 65,
    width: "100%",
    justifyContent: "space-between",
  },
  selectIcon: {
    width: "30%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#d3d3d3",
    borderRadius: 10,
  },
  selectColor: {
    width: "65%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#d3d3d3",
    alignItems: "center",
  },
  selectColorBg: {
    height: 40,
    width: 55,
    borderRadius: 10,
  },
});
