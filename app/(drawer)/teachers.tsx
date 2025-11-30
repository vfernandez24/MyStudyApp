import Plus from "@/assets/icons/plus-solid.svg";
import AlertDelete from "@/components/UI/AlertDelete";
import PageTitle from "@/components/UI/PageTitle";
import Teacher from "@/components/listPages/Teacher";
import OverlayTeachers from "@/components/overlays/OverlayTeachers";
import STORAGE_KEYS from "@/constants/storageKeys";
import useTeachers from "@/hooks/pages/useTeachers";
import { deleteItem, setItem } from "@/services/storage/dataArrays.service";
import { router } from "expo-router";
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
  const {
    teachers,
    loadEvents,
    deleteGrade,
    selectedTeacher,
    setSelectedTeacher,
  } = useTeachers();
  useEffect(() => {
    loadEvents();
  }, []);

  const [overlay, setOverlay] = useState(false);
  const [overlayDiv, setOverlayDiv] = useState(false);
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
            await deleteItem(STORAGE_KEYS.TEACHERS_KEY);
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
          await setItem(STORAGE_KEYS.TYPEFORM_KEY, "create");
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
