import Grade from "@/components/Grade";
import PageTitle from "@/components/PageTitle";
import { gradeColors } from "@/constants/colors";
import {
  defaultGrades,
  defaultPeriods,
  defaultSubjects,
} from "@/constants/defaultValues";
import { grade, period, subject } from "@/constants/types";
import selectColor from "@/scripts/selectColor";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const screenHeight = Dimensions.get("window").height;
const scrollHeight = screenHeight - 80;

const OverlayGrades = ({
  selectedGrade,
  overlay,
  subjects,
  periods,
  deleteGrade,
}: {
  selectedGrade: grade | null;
  overlay: boolean;
  subjects: subject[];
  periods: period[];
  deleteGrade: (id: number) => void;
}) => {
  const subject = subjects.find((sub) => sub.id === selectedGrade?.subject);
  const period = periods.find((sub) => sub.id === selectedGrade?.period);
  return (
    <View style={[styles.overlay, { bottom: overlay == true ? 0 : -500 }]}>
      <View style={styles.overlayContainer}>
        {/* Nota */}
        <View style={styles.overlayDataContainer}>
          <View style={styles.overlayDataIconDiv}>
            <Image
              style={styles.overlayDataIconImg}
              tintColor="#0b0279"
              source={require("@/assets/icons/pages/grades.png")}
            ></Image>
          </View>
          <View style={styles.overlayDataTextDiv}>
            <Text style={styles.overlayDataText}>{selectedGrade?.grade}</Text>
          </View>
        </View>

        {/* Descripcion */}
        <View style={styles.overlayDataContainer}>
          <View style={styles.overlayDataIconDiv}>
            <Image
              style={styles.overlayDataIconImg}
              tintColor="#0b0279"
              source={require("@/assets/icons/pages/notes.png")}
            ></Image>
          </View>
          <View style={styles.overlayDataTextDiv}>
            <Text
              style={[
                styles.overlayDataText,
                { color: selectedGrade?.description !== "" ? "#000" : "#999" },
              ]}
            >
              {selectedGrade?.description !== ""
                ? selectedGrade?.description
                : "Sin descripción"}
            </Text>
          </View>
        </View>

        {/* Asignatura */}
        <View style={styles.overlayDataContainer}>
          <View style={styles.overlayDataIconDiv}>
            <Image
              style={styles.overlayDataIconImg}
              tintColor="#0b0279"
              source={require("@/assets/icons/pages/subjects.png")}
            ></Image>
          </View>
          <View style={styles.overlayDataTextDiv}>
            <Text style={styles.overlayDataText}>{subject?.name}</Text>
          </View>
        </View>

        {/* Fecha */}
        <View style={styles.overlayDataContainer}>
          <View style={styles.overlayDataIconDiv}>
            <Image
              style={styles.overlayDataIconImg}
              tintColor="#0b0279"
              source={require("@/assets/backgrounds/calendar.png")}
            ></Image>
          </View>
          <View style={styles.overlayDataTextDiv}>
            <Text style={styles.overlayDataText}>{selectedGrade?.date}</Text>
          </View>
        </View>

        {/* Periodo */}
        <View style={styles.overlayDataContainer}>
          <View style={styles.overlayDataIconDiv}>
            <Image
              style={styles.overlayDataIconImg}
              tintColor="#0b0279"
              source={require("@/assets/icons/pages/calendar.png")}
            ></Image>
          </View>
          <View style={styles.overlayDataTextDiv}>
            <Text style={styles.overlayDataText}>{period?.name}</Text>
          </View>
        </View>

        {/* Tipo */}
        <View style={styles.overlayDataContainer}>
          <View style={styles.overlayDataIconDiv}>
            <Image
              style={styles.overlayDataIconImg}
              tintColor="#0b0279"
              source={require("@/assets/icons/tag.png")}
            ></Image>
          </View>
          <View style={styles.overlayDataTextDiv}>
            <Text style={styles.overlayDataText}>
              {selectedGrade?.type == "write"
                ? "Escrito"
                : selectedGrade?.type == "oral"
                ? "Oral"
                : "Práctico"}
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          height: 3,
          borderRadius: 20,
          width: "80%",
          backgroundColor: "#d3d3d3",
          position: "relative",
          bottom: 30,
        }}
      ></View>

      {/* Botones */}
      <View style={styles.overlayButtonContainer}>
        {/* Editar */}
        <TouchableOpacity
          style={[styles.overlayButton, { backgroundColor: "#f7f7f7" }]}
        >
          <View style={styles.overlayButtonIconDiv}>
            <Image
              style={styles.overlayButtonIconImg}
              tintColor={"#0b0279"}
              source={require("@/assets/icons/edit-text.png")}
            ></Image>
          </View>
          <View style={styles.overlayButtonTextDiv}>
            <Text style={[styles.overlayButtonText, { color: "#6C98F7" }]}>
              Editar
            </Text>
          </View>
        </TouchableOpacity>

        {/* Eliminar */}
        <TouchableOpacity
          style={[
            styles.overlayButton,
            { backgroundColor: "rgba(255, 0, 0, 0.45)" },
          ]}
          onPress={() => deleteGrade(selectedGrade?.id ?? 0)}
        >
          <View style={styles.overlayButtonIconDiv}>
            <Image
              style={styles.overlayButtonIconImg}
              tintColor={"#fff"}
              source={require("@/assets/icons/trash-bin.png")}
            ></Image>
          </View>
          <View style={styles.overlayButtonTextDiv}>
            <Text style={[styles.overlayButtonText, { color: "#fff" }]}>
              Eliminar
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const AlertDelete = ({
  alert,
  setAlert,
  setConfirmation,
  setOverlay,
  functionDel,
  selectedGrade,
}: {
  selectedGrade: number | null;
  alert: boolean;
  functionDel: (id: number) => void;
  setAlert: (alert: boolean) => void;
  setConfirmation: (confirmation: boolean) => void;
  setOverlay: (overlay: boolean) => void;
}) => {
  return (
    <View style={[styles.alert, { display: alert == true ? "flex" : "none" }]}>
      <Text style={styles.alertText}>
        Vas a borrar una nota permanentemente
      </Text>
      <Text style={styles.alertText}>¿Estás seguro?</Text>
      <View style={styles.alertButtonContainer}>
        <TouchableOpacity
          onPress={() => {
            setOverlay(false);
            setAlert(false);
            setConfirmation(false);
          }}
          style={[styles.alertButton, { backgroundColor: "#d3d3d3" }]}
        >
          <Text style={styles.alertButtonText}>NO</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setOverlay(false);
            setAlert(false);
            setConfirmation(true);
            functionDel(selectedGrade ?? 0);
          }}
          style={[
            styles.alertButton,
            { backgroundColor: "rgba(255, 0, 0, 0.3)" },
          ]}
        >
          <Text style={styles.alertButtonText}>SÍ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function grades() {
  const router = useRouter();

  const [subjects, setSubjects] = useState<subject[]>(defaultSubjects);
  const [periods, setPeriods] = useState<period[]>(defaultPeriods);
  const [grades, setGrades] = useState<grade[]>([]);

  const calculateAverage = () => {
    const total = grades.reduce((sum, g) => sum + g.grade, 0);
    return Number((total / grades.length).toFixed(2));
  };
  const [promedio, setPromedio] = useState(0);
  const [promedioColor, setPromedioColor] = useState(0);

  useEffect(() => {
    if (grades.length === 0) return;
    const avg = grades.reduce((sum, g) => sum + g.grade, 0) / grades.length;
    setPromedio(Number(avg.toFixed(2)));
    setPromedioColor(selectColor(avg));
    AsyncStorage.setItem("promedio", JSON.stringify(avg));
  }, [grades]);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const subjectsAwait = await AsyncStorage.getItem("subjects");
        const periodsAwait = await AsyncStorage.getItem("periods");
        const gradesAwait = await AsyncStorage.getItem("grades");
        console.log(gradesAwait);

        const parsedSubjects: subject[] = subjectsAwait
          ? JSON.parse(subjectsAwait)
          : defaultSubjects;
        const parsedPeriods: period[] = periodsAwait
          ? JSON.parse(periodsAwait)
          : defaultPeriods;
        const parsedGrades: grade[] = gradesAwait
          ? JSON.parse(gradesAwait)
          : defaultGrades;

        setSubjects(parsedSubjects);
        setPeriods(parsedPeriods);
        setGrades(parsedGrades);
      };

      loadData();

      const fetchPromedio = async () => {
        const parsed = Number(
          grades.reduce((sum, g) => sum + g.grade, 0) / grades.length
        );
        setPromedio(Number(Number(parsed)));
        setPromedioColor(selectColor(Number(Number(parsed).toFixed(2))));
      };
      fetchPromedio();
    }, [])
  );

  useEffect(() => {
    const fetchPromedio = async () => {
      const parsed = Number(
        grades.reduce((sum, g) => sum + g.grade, 0) / grades.length
      );
      setPromedio(Number(parsed));
      setPromedioColor(selectColor(Number(parsed.toFixed(2))));
    };
    fetchPromedio();
  }, [grades]);

  let gradesPerSubject: { [key: string]: number } = {};
  subjects.forEach((sub) => {
    gradesPerSubject[sub.id] = 0;
  });

  grades.forEach((grade) => {
    if (gradesPerSubject[grade.subject] !== undefined) {
      gradesPerSubject[grade.subject] += 1;
    }
  });

  const [overlay, setOverlay] = useState(false);
  const [overlayDiv, setOverlayDiv] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<grade | null>(null);
  function gradePressed(id: number) {
    setOverlay(true);
    setOverlayDiv(true);
    const selected = grades.find((g) => g.id === id);
    setSelectedGrade(selected ? selected : null);
    console.log(selected);
  }
  
  function closeOverlay() {
    setOverlay(false);
    setOverlayDiv(false);
  }

  const [alert, setAlert] = useState(false);
  const [confirmation, setConfirmation] = useState(false);

  function buttonDelete(id: number) {
    setAlert(true);
    setOverlayDiv(false);
  }

  async function deleteGrade(id: number) {
    const newGrades = grades.filter((grade) => grade.id !== id);
    newGrades.forEach((grade) => {
      if (grade.id > id) {
        grade.id -= 1;
      }
    });
    setGrades(newGrades);
    console.log(newGrades);
    const parsed = JSON.stringify(newGrades);
    await AsyncStorage.setItem("grades", parsed);
    const parsedGrades = await AsyncStorage.getItem("grades");
    console.log(parsedGrades);
    console.log("---------------------------------------");
    setSelectedGrade(null);
  }

  return (
    <View>
      {/* Overlay */}
      {
        <TouchableOpacity
          onPress={closeOverlay}
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
        setConfirmation={setConfirmation}
        setAlert={setAlert}
        setOverlay={setOverlay}
        functionDel={deleteGrade}
        selectedGrade={selectedGrade?.id ?? null}
      />

      <ScrollView style={styles.container}>
        {/* Title */}
        <PageTitle title="NOTAS" />

        {/* Periodos selector */}

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
        onPress={() => router.push("/(modal)/create")}
      >
        <Image
          style={styles.addButtonImg}
          source={require("@/assets/icons/plus.png")}
          tintColor={"#fff"}
        />
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
  overlay: {
    position: "absolute",
    transitionProperty: "bottom",
    transitionDuration: "0.8s",
    left: 0,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    gap: 0,
    height: 500,
    width: "100%",
    zIndex: 21,
    borderTopEndRadius: 40,
    borderTopStartRadius: 40,
  },
  overlayContainer: {
    height: 400,
    width: "100%",
    gap: 10,
  },
  overlayDataContainer: {
    height: 50,
    flexDirection: "row",
  },
  overlayDataIconDiv: {
    width: "30%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  overlayDataIconImg: {
    height: 35,
    objectFit: "contain",
  },
  overlayDataTextDiv: {
    width: "70%",
    height: 50,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  overlayDataText: {
    fontFamily: "InstrumentSans-Medium",
    fontSize: 18,
  },
  overlayButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 30,
    paddingHorizontal: 30,
  },
  overlayButton: {
    height: 50,
    width: "50%",
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  overlayButtonIconDiv: {
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  overlayButtonIconImg: {
    height: 30,
    objectFit: "contain",
  },
  overlayButtonTextDiv: {},
  overlayButtonText: {
    fontFamily: "InstrumentSans-SemiBold",
    fontSize: 17,
    letterSpacing: 1,
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
  addButtonImg: {
    height: 30,
    objectFit: "contain",
  },
  alert: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: "-50%" }, { translateY: -80 }],
    zIndex: 50,
    backgroundColor: "#fff",
    maxWidth: "80%",
    borderRadius: 20,
    padding: 20,
  },
  alertText: {
    fontSize: 18,
    fontFamily: "InstrumentSans-Medium",
    textAlign: "center",
    marginBottom: 20,
  },
  alertButtonContainer: {
    width: "100%",
    height: 70,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  alertButton: {
    width: "40%",
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  alertButtonText: {
    fontSize: 20,
    fontFamily: "InstrumentSans-Bold",
    color: "#fff",
  },
});
