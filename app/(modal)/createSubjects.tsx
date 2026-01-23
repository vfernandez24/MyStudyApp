import ArrowLeft from "@/assets/icons/arrow-left-solid.svg";
import ChevronDown from "@/assets/icons/chevron-down-solid.svg";
import Save from "@/assets/icons/floppy-disk-solid.svg";
import Icons from "@/assets/icons/icons-solid-full.svg";
import ColorsSVG from "@/assets/icons/palette-solid-full.svg";
import Teachers from "@/assets/icons/person-chalkboard-solid.svg";
import NameInput from "@/components/form/inputs/Name";
import Select from "@/components/form/select/Select";
import colors from "@/constants/colors";
import { defaultSubjects, defaultTeachers } from "@/constants/defaultValues";
import icons from "@/constants/icons";
import STORAGE_KEYS from "@/constants/storageKeys";
import { stylesFormCreate } from "@/constants/styles";
import { subject, teacher } from "@/constants/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Dimensions,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const CreatePage = () => {
  const [overlay, setOverlay] = useState<boolean>(false);
  const [overlaySelect, setOverlaySelect] = useState<boolean>(false);
  const overlayType = "teachers";

  const [subjects, setSubjects] = useState<subject[]>(defaultSubjects);
  const [prevTeachers, setPrevTeachers] = useState<teacher[]>();

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const subjectsAwait = await AsyncStorage.getItem(
            STORAGE_KEYS.SUBJECTS_KEY,
          );
          const teachersAwait = await AsyncStorage.getItem(
            STORAGE_KEYS.TEACHERS_KEY,
          );
          const typeFormAwait = await AsyncStorage.getItem(
            STORAGE_KEYS.TYPEFORM_KEY,
          );
          const idEditAwait = await AsyncStorage.getItem(
            STORAGE_KEYS.ID_SUBJECT_KEY,
          );

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
    }, []),
  );

  const [typeSelect, setTypeSelect] = useState<"color" | "icon">("color");

  const [name, setName] = useState("");
  const [color, setColor] = useState(-1);
  const [icon, setIcon] = useState(-1);
  const [teachers, setTeachers] = useState<number | undefined>(-1);

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
          sub.id === editId ? newSubject : sub,
        );
      }

      const stringfySubjects = JSON.stringify(newSubjects);
      await AsyncStorage.setItem(STORAGE_KEYS.SUBJECTS_KEY, stringfySubjects);

      router.back();
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        {/* Overlay */}
        <TouchableOpacity
          onPress={() => setOverlay(false)}
          style={[
            stylesFormCreate.overlay,
            { display: overlay == true ? "flex" : "none" },
          ]}
        ></TouchableOpacity>

        {/* Overlay */}
        <TouchableOpacity
          onPress={() => setOverlaySelect(false)}
          style={[
            stylesFormCreate.overlay,
            { display: overlaySelect == true ? "flex" : "none" },
          ]}
        ></TouchableOpacity>

        {/* Select */}
        <Select
          overlay={overlaySelect}
          setOverlay={setOverlaySelect}
          teacherDef={teachers}
          teachers={prevTeachers}
          setTeacher={setTeachers}
          typeSelect={overlayType}
          overlayType={overlayType}
          colorDef={color}
          setColor={setColor}
          iconDef={icon}
          setIcon={setIcon}
        ></Select>

        {/* Button exit */}
        <TouchableOpacity
          style={styles.buttonExit}
          onPress={() => router.back()}
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
          <Text style={styles.formTitle}>
            {typeForm == "create" ? "Crear asignatura" : "Editar asignatura"}
          </Text>

          <View style={styles.inputsContainer}>
            <NameInput name={name} setName={setName} error={error.name} />
          </View>

          <View style={styles.inputsContainer}>
            <View style={styles.label}>
              <View style={styles.iconDiv}>
                <Icons height={35} width={35} fill="#0b0279" />
              </View>
              <TouchableOpacity
                style={{
                  minHeight: "100%",
                  width: "75%",
                  borderWidth: 2,
                  borderRadius: 10,
                  padding: 5,
                  borderColor: "#d3d3d3",
                  paddingHorizontal: 20,
                }}
                onPress={() => {
                  setTypeSelect("icon");
                  setOverlay(true);
                  Keyboard.dismiss();
                }}
              >
                {icons[icon] ? (
                  <MaterialCommunityIcons
                    name={icons[icon].name}
                    size={40}
                    color={"#6C98F7"}
                  />
                ) : (
                  <View
                    style={{
                      height: "100%",
                      flex: 1,
                      justifyContent: "center",
                      padding: 10,
                      position: "relative",
                      right: 20,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "InstrumentSans-Medium",
                        fontSize: 18,
                        color: "#999",
                      }}
                    >
                      Selecciona un icono
                    </Text>
                  </View>
                )}
                <View
                  style={{
                    position: "absolute",
                    right: 10,
                  }}
                >
                  <ChevronDown fill="#6C98F7" height={25} width={25} />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.label}>
              <View style={styles.iconDiv}>
                <ColorsSVG height={35} width={35} fill="#0b0279" />
              </View>
              <View
                style={{
                  borderColor: "#d3d3d3",
                  borderWidth: 2,
                  width: "75%",
                  borderRadius: 10,
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setTypeSelect("color");
                    setOverlay(true);
                    Keyboard.dismiss();
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingLeft: 0,
                    position: "relative",
                  }}
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
                          fontSize: 18,
                          color: "#999",
                        }}
                      >
                        Selecciona un color
                      </Text>
                    </View>
                  )}
                  <View
                    style={{
                      position: "absolute",
                      right: 10,
                    }}
                  >
                    <ChevronDown fill="#6C98F7" height={25} width={25} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.inputsContainer}>
            <View style={stylesFormCreate.label}>
              <View style={stylesFormCreate.iconDiv}>
                <Teachers height={35} width={35} fill="#0b0279" />
              </View>
              <View
                style={{
                  borderColor: "#d3d3d3",
                  borderWidth: 2,
                  width: "75%",
                  borderRadius: 10,
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setOverlaySelect(true);
                    Keyboard.dismiss();
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingLeft: 10,
                    position: "relative",
                  }}
                >
                  <Text style={stylesFormCreate.inputText}>
                    {teachers !== -1 ? (
                      <Text style={stylesFormCreate.inputText}>
                        {prevTeachers?.find((t) => t.id === teachers)?.name +
                          " " +
                          prevTeachers?.find((t) => t.id === teachers)
                            ?.surnames}
                      </Text>
                    ) : (
                      <Text style={stylesFormCreate.inputText}>
                        Selecciona un profesor
                      </Text>
                    )}
                  </Text>
                  <View
                    style={{
                      position: "absolute",
                      right: 10,
                    }}
                  >
                    <ChevronDown fill="#6C98F7" height={25} width={25} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
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
  formTitle: {
    fontFamily: "InstrumentSans-SemiBold",
    fontSize: 35,
    lineHeight: 40,
    marginBottom: 20,
    color: "#446dc4ff",
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
    fontFamily: "InstrumentSans-Medium",
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
