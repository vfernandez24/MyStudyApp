import Plus from "@/assets/icons/plus-solid.svg";
import PageTitle from "@/components/common/PageTitle";
import AlertDelete from "@/components/listPages/AlertDelete";
import Teacher from "@/components/listPages/Teacher";
import OverlayTeachers from "@/components/overlays/OverlayTeachers";
import { defaultSubjects, defaultTeachers } from "@/constants/defaultValues";
import STORAGE_KEYS from "@/constants/storageKeys";
import { subject, teacher } from "@/constants/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const screenHeight = Dimensions.get("window").height;
const scrollHeight = screenHeight - 80;

export default function teachers() {
  const router = useRouter();

  const [teachers, setTeachers] = useState<teacher[]>([]);
  const [subjects, setSubjects] = useState<subject[]>([]);
  useEffect(() => {
    const loadEvents = async () => {
      const teachersAwait = await AsyncStorage.getItem(STORAGE_KEYS.TEACHERS_KEY);
      const subjectsAwait = await AsyncStorage.getItem(STORAGE_KEYS.SUBJECTS_KEY);
      const parsedteachers: teacher[] = teachersAwait
        ? JSON.parse(teachersAwait)
        : defaultTeachers;
      const parsedSubjects: subject[] = subjectsAwait
        ? JSON.parse(subjectsAwait)
        : defaultSubjects;
      setTeachers(parsedteachers);
      setSubjects(parsedSubjects);
    };
    loadEvents();
  }, []);

  const [overlay, setOverlay] = useState(false);
  const [overlayDiv, setOverlayDiv] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<teacher | null>(null);
  function gradePressed(id: number) {
    setOverlay(true);
    setOverlayDiv(true);
    const selected = teachers.find((g) => g.id === id);
    setSelectedTeacher(selected ? selected : null);
  }

  function closeOverlay() {
    setOverlay(false);
    setOverlayDiv(false);
  }

  const [alert, setAlert] = useState(false);

  function buttonDelete() {
    setAlert(true);
    setOverlayDiv(false);
  }

  async function deleteGrade(id: number) {
    const newTeachers = teachers.filter((teacher) => teacher.id !== id);
    setTeachers(newTeachers);
    const parsed = JSON.stringify(newTeachers);
    await AsyncStorage.setItem(STORAGE_KEYS.TEACHERS_KEY, parsed);

    const newSubjects = subjects.map((sub) => {
      if (sub.teacher === id) {
        let newSub: subject = {
          ...sub,
          teacher: -1,
        };
        return newSub;
      } else {
        return sub;
      }
    });
    const parsedSubs = JSON.stringify(newSubjects);
    await AsyncStorage.setItem(STORAGE_KEYS.SUBJECTS_KEY, parsedSubs);

    setSelectedTeacher(null);
  }

  return (
    <View>
      <TouchableOpacity
        onPress={alert == true ? () => {} : closeOverlay}
        style={[
          styles.overlayBg,
          { display: overlay == true ? "flex" : "none" },
        ]}
      ></TouchableOpacity>
      <OverlayTeachers
        overlay={overlayDiv}
        selectedTeacher={selectedTeacher != null ? selectedTeacher : null}
        deleteGrade={buttonDelete}
      />

      <AlertDelete
        alert={alert}
        setAlert={setAlert}
        setOverlay={setOverlay}
        functionDel={deleteGrade}
        selectedGrade={selectedTeacher?.id ?? null}
      />

      <ScrollView style={styles.container}>
        {/* Title */}
        <View style={styles.containerTitle}>
          <PageTitle title="PROFESORES"></PageTitle>
        </View>

        <View style={styles.containerData}>
          {teachers.map((t) => (
            <Teacher
              key={t.name}
              t={t}
              pressFunction={() => gradePressed(t.id)}
            />
          ))}
        </View>

        <View style={{ height: 100 }}></View>

        <TouchableOpacity
          onPress={async () => {
            await AsyncStorage.removeItem(STORAGE_KEYS.TEACHERS_KEY);
            setTeachers(defaultTeachers);
          }}
          style={styles.deleteAllButton}
        >
          <Text style={styles.deleteAllButtonText}>
            Eliminar todos los profesores
          </Text>
        </TouchableOpacity>

        <View style={{ height: 100 }}></View>
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={async () => {
          await AsyncStorage.setItem(STORAGE_KEYS.TYPEFORM_KEY, "create");
          router.push("/(modal)/createTeachers");
        }}
      >
        <Plus fill="#fff" height={30} width={30} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: scrollHeight,
    padding: 15,
    paddingBottom: 200,
  },
  overlayBg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: scrollHeight,
    backgroundColor: "#0000003d",
    zIndex: 20,
  },
  containerTitle: {
    marginBottom: 10,
  },
  containerData: {
    gap: 40,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    height: 60,
    width: 60,
    zIndex: 10,
    borderRadius: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0b0279",
  },
  deleteAllButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 20,
    width: "85%",
    alignSelf: "center",
    backgroundColor: "rgba(255, 0, 0, 0.45)",
  },
  deleteAllButtonText: {
    textAlign: "center",
    fontFamily: "InstrumentSans-SemiBold",
    color: "#fff",
    fontSize: 20,
  },
});
