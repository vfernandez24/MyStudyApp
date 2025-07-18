import AlignLeft from "@/assets/icons/align-left-solid.svg";
import ArrowLeft from "@/assets/icons/arrow-left-solid.svg";
import Email from "@/assets/icons/envelope-solid.svg";
import Save from "@/assets/icons/floppy-disk-solid.svg";
import IdCard from "@/assets/icons/id-card-solid.svg";
import Tel from "@/assets/icons/phone-solid.svg";
import User from "@/assets/icons/user-solid.svg";
import VenusMars from "@/assets/icons/venus-mars-solid.svg";
import { defaultTeachers } from "@/constants/defaultValues";
import { teacher } from "@/constants/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Dimensions,
  Keyboard,
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
  const [teachers, setTeachers] = useState<teacher[]>(defaultTeachers);

  const [error, setError] = useState<{
    name: boolean;
    surname: boolean;
  }>({
    name: false,
    surname: false,
  });

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const teachersAwait = await AsyncStorage.getItem("teachers");
          const typeFormAwait = await AsyncStorage.getItem("typeTeacher");
          const idEditAwait = await AsyncStorage.getItem("idEditT");

          const parsedTeachers: teacher[] = teachersAwait
            ? JSON.parse(teachersAwait)
            : defaultTeachers;

          setTeachers(parsedTeachers);

          const formType = typeFormAwait ?? "create";
          setTypeForm(formType);

          if (formType === "edit" && idEditAwait) {
            const id = Number(idEditAwait);
            setEditId(id);

            const current = parsedTeachers.find((t) => t.id === id);
            if (current) {
              setName(current.name);
              setSurnames(current.surnames);
              setEmail(current.email);
              setTel(current.tel);
              setGender(current.gender);
              setNotes(current.notes);
            }
          }
        } catch (error) {
          console.error("❌ Error al cargar datos:", error);
        }
      };

      fetchData();
    }, [])
  );

  const [name, setName] = useState("");
  const [surnames, setSurnames] = useState("");
  const [email, setEmail] = useState<string | undefined>();
  const [tel, setTel] = useState<number | undefined>();
  const [gender, setGender] = useState<"male" | "female" | undefined>();
  const [notes, setNotes] = useState<string | undefined>();

  const [typeForm, setTypeForm] = useState<string>("create");
  const [editId, setEditId] = useState<number | null>(null);

  function checkData() {
    const isNameValid = name !== "";
    const isSurnamesValid = surnames !== "";

    setError({
      name: !isNameValid,
      surname: !isSurnamesValid,
    });

    return isNameValid && isSurnamesValid;
  }

  async function submit() {
    let newTeachers: teacher[] = teachers;
    const isValid = checkData();
    let id: number =
      teachers.length > 0 ? teachers[teachers.length - 1].id + 1 : 0;
    if (typeForm !== "create") {
      id = editId ?? 0;
    }
    if (isValid) {
      const newTeacher: teacher = {
        name: name,
        surnames: surnames,
        gender: gender,
        tel: tel,
        email: email,
        notes: notes,
        id: id,
      };
      if (typeForm == "create") {
        newTeachers = [...teachers, newTeacher];
      } else {
        newTeachers = teachers.map((t) => (t.id === editId ? newTeacher : t));
      }

      const stringfySubjects = JSON.stringify(newTeachers);
      await AsyncStorage.setItem("teachers", stringfySubjects);

      router.push("/(drawer)/teachers");
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

        {/* Button exit */}
        <TouchableOpacity
          style={styles.buttonExit}
          onPress={() => router.push("/(drawer)/teachers")}
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
                <User height={35} width={35} fill="#0b0279" />
              </View>
              <TextInput
                style={{
                  minHeight: "100%",
                  width: "75%",
                  borderWidth: 2,
                  borderRadius: 10,
                  padding: 5,
                  paddingHorizontal: 10,
                  fontSize: 18,
                  borderColor: error.name == true ? "#f00" : "#d3d3d3",
                }}
                placeholder="Nombre"
                value={name}
                onChangeText={(e) => setName(e)}
              ></TextInput>
            </View>
            <View style={styles.label}>
              <View style={styles.iconDiv}>
                <IdCard height={35} width={35} fill="#0b0279" />
              </View>
              <TextInput
                style={{
                  minHeight: "100%",
                  width: "75%",
                  borderWidth: 2,
                  borderRadius: 10,
                  padding: 5,
                  paddingHorizontal: 10,
                  borderColor: error.surname == true ? "#f00" : "#d3d3d3",
                  fontSize: 18,
                }}
                placeholder="Apellidos"
                value={surnames}
                onChangeText={(e) => setSurnames(e)}
              ></TextInput>
            </View>
          </View>

          <View style={styles.inputsContainer}>
            <View style={styles.label}>
              <View style={styles.iconDiv}>
                <Email height={35} width={35} fill="#0b0279" />
              </View>
              <TextInput
                style={{
                  minHeight: "100%",
                  width: "75%",
                  borderWidth: 2,
                  borderRadius: 10,
                  padding: 5,
                  paddingHorizontal: 10,
                  borderColor: "#d3d3d3",
                  fontSize: 18,
                }}
                placeholder="Correo Electrónico (Opcional)"
                value={email}
                onChangeText={(e) => setEmail(e)}
              ></TextInput>
            </View>
            <View style={styles.label}>
              <View style={styles.iconDiv}>
                <Tel height={35} width={35} fill="#0b0279" />
              </View>
              <TextInput
                style={{
                  minHeight: "100%",
                  width: "75%",
                  borderWidth: 2,
                  borderRadius: 10,
                  padding: 5,
                  paddingHorizontal: 10,
                  borderColor: "#d3d3d3",
                  fontSize: 18,
                }}
                placeholder="Teléfono (Opcional)"
                value={tel !== undefined ? String(tel) : ""}
                onChangeText={(e) => setTel(Number(e))}
              ></TextInput>
            </View>
          </View>

          <View style={styles.inputsContainer}>
            <TouchableOpacity style={styles.label} onPress={Keyboard.dismiss}>
              <View style={styles.iconDiv}>
                <VenusMars height={35} width={35} fill="#0b0279" />
              </View>
              <View
                style={{
                  borderWidth: 2,
                  width: "75%",
                  borderRadius: 10,
                  borderColor: "#d3d3d3",
                }}
              >
                <Picker
                  selectedValue={gender}
                  style={{
                    width: "100%",
                    height: "100%",
                    paddingHorizontal: 10,
                    borderColor: "#d3d3d3",
                    fontSize: 18,
                    fontFamily: "InstrumentSans-Medium",
                  }}
                  onValueChange={(e) => setGender(e)}
                >
                  <Picker.Item label={""} value={undefined} />
                  <Picker.Item label={"Hombre"} value={"male"} />
                  <Picker.Item label={"Mujer"} value={"female"} />
                  <Picker.Item label={"Otro"} value={""} />
                </Picker>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.inputsContainer}>
            <View style={styles.label}>
              <View style={styles.iconDiv}>
                <AlignLeft height={35} width={35} fill="#0b0279" />
              </View>
              <TextInput
                style={{
                  minHeight: "100%",
                  width: "75%",
                  borderWidth: 2,
                  borderRadius: 10,
                  padding: 5,
                  paddingHorizontal: 10,
                  borderColor: "#d3d3d3",
                  fontSize: 18,
                }}
                placeholder="Notas (Opcional)"
                value={notes}
                onChangeText={(e) => setNotes(e)}
              ></TextInput>
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
