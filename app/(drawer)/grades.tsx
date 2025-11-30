import Plus from "@/assets/icons/plus-solid.svg";
import AlertDelete from "@/components/UI/AlertDelete";
import PageTitle from "@/components/UI/PageTitle";
import Grade from "@/components/listPages/Grade";
import OverlayGrades from "@/components/overlays/OverlayGrades";
import { gradeColors } from "@/constants/colors";
import STORAGE_KEYS from "@/constants/storageKeys";
import useGrades from "@/hooks/pages/useGrades";
import { setItem } from "@/services/storage/dataArrays.service";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const screenHeight = Dimensions.get("window").height;
const scrollHeight = screenHeight - 80;

export default function grades() {
  const {
    subjects,
    periods,
    grades,
    promedio,
    promedioColor,
    loadData,
    gradesPerSubject,
    selectedGrade,
    setSelectedGrade,
    deleteGrade,
  } = useGrades();

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const [overlay, setOverlay] = useState(false);
  const [overlayDiv, setOverlayDiv] = useState(false);
  const [alert, setAlert] = useState(false);

  function gradePressed(id: number) {
    setOverlay(true);
    setOverlayDiv(true);
    const selected = grades.find((g) => g.id === id);
    setSelectedGrade(selected ? selected : null);
  }

  function closeOverlay() {
    setOverlay(false);
    setOverlayDiv(false);
  }

  function buttonDelete(id: number) {
    setAlert(true);
    setOverlayDiv(false);
  }

  return (
    <View>
      {/* Overlay */}
      {
        <TouchableOpacity
          onPress={alert == true ? () => {} : closeOverlay}
          style={[
            styles.overlayBg,
            { display: overlay == true ? "flex" : "none" },
          ]}
        ></TouchableOpacity>
      }
      <OverlayGrades
        overlay={overlayDiv}
        selectedGrade={selectedGrade != null ? selectedGrade : null}
        periods={periods}
        subjects={subjects}
        deleteGrade={buttonDelete}
      />

      <AlertDelete
        alert={alert}
        setAlert={setAlert}
        setOverlay={setOverlay}
        functionDel={deleteGrade}
        selectedGrade={selectedGrade?.id ?? null}
      />

      <ScrollView style={styles.container}>
        <View style={styles.containerTitle}>
          {/* Title */}
          <PageTitle title="NOTAS" />
        </View>

        {/* Promedio's zone */}
        <View
          style={[
            styles.promedioDiv,
            {
              backgroundColor:
                grades.length > 0
                  ? gradeColors[promedioColor].color
                  : "#d3d3d3",
            },
          ]}
        >
          <Text
            style={[
              styles.promedioTitle,
              {
                color:
                  grades.length > 0 ? gradeColors[promedioColor].text : "#000",
              },
            ]}
          >
            TU PROMEDIO
          </Text>
          <Text
            style={[
              styles.promedio,
              {
                color:
                  grades.length > 0 ? gradeColors[promedioColor].text : "#000",
              },
            ]}
          >
            {grades.length > 0 ? promedio.toFixed(2) : "-"}
          </Text>
        </View>

        {/* Subjects' zone */}
        {subjects
          .filter((sub) => gradesPerSubject[sub.id] > 0)
          .map((sub) => (
            <View style={styles.subject} key={sub.id}>
              <View style={styles.subjectTitleDiv}>
                <Text style={styles.subjectTitle}>{sub.name}</Text>
              </View>
              <View style={styles.subjectContainer}>
                {grades
                  .filter((g) => g.subject === sub.id)
                  .map((grade, index) => (
                    <Grade
                      g={grade}
                      pressFunction={() => gradePressed(grade.id)}
                      key={index}
                    />
                  ))}
              </View>
            </View>
          ))}

        <View style={{ height: 100 }}></View>
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={async () => {
          await setItem(STORAGE_KEYS.TYPEFORM_KEY, "create");
          router.push("/(modal)/createGrades");
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
  selector: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#d3d3d3",
    padding: 5,
    zIndex: 2,
  },
  promedioDiv: {
    height: 110,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0,
    borderRadius: 20,
  },
  promedioTitle: {
    position: "absolute",
    top: 10,
    left: 20,
    fontSize: 20,
    width: "100%",
    letterSpacing: 2,
    fontFamily: "InstrumentSans-Bold",
    color: "#0b0279",
  },
  promedio: {
    fontSize: 40,
    fontFamily: "InstrumentSans-Bold",
    letterSpacing: 5,
    paddingTop: 20,
  },
  subject: {
    marginVertical: 20,
    width: "100%",
    paddingVertical: 10,
  },
  subjectTitleDiv: {
    height: 60,
  },
  subjectTitle: {
    textAlign: "right",
    fontSize: 25,
    fontFamily: "InstrumentSans-Bold",
    letterSpacing: 1,
    color: "#0b0279",
  },
  subjectContainer: {
    gap: 10,
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
});
