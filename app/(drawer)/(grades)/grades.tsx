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

export default function grades() {
  const router = useRouter();

  const [subjects, setSubjects] = useState<subject[]>(defaultSubjects);
  const [periods, setPeriods] = useState<period[]>(defaultPeriods);
  const [grades, setGrades] = useState<grade[]>([]);

  const calculateAverage = () => {
    const total = grades.reduce((sum, g) => sum + g.grade, 0);
    return Number((total / grades.length).toFixed(2));
  };
  const pr = calculateAverage();
  const prColor = selectColor(pr)
  const [promedio, setPromedio] = useState(pr);
  const [promedioColor, setPromedioColor] = useState(prColor);

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
        const parsed = Number(grades.reduce((sum, g) => sum + g.grade, 0) / grades.length);
        setPromedio(Number(Number(parsed)));
        setPromedioColor(selectColor(Number(Number(parsed).toFixed(2))));
      };
      fetchPromedio();
    }, [])
  );

  useEffect(() => {
    const fetchPromedio = async () => {
      const parsed = Number(grades.reduce((sum, g) => sum + g.grade, 0) / grades.length);
      setPromedio(Number(Number(parsed)));
      setPromedioColor(selectColor(Number(Number(parsed).toFixed(2))));
    };
    fetchPromedio();
  })

  let gradesPerSubject: { [key: string]: number } = {};
  subjects.forEach((sub) => {
    gradesPerSubject[sub.id] = 0;
  });

  grades.forEach((grade) => {
    if (gradesPerSubject[grade.subject] !== undefined) {
      gradesPerSubject[grade.subject] += 1;
    }
  });

  return (
    <View>

      <ScrollView style={styles.container}>
        {/* Title */}
        <PageTitle title="NOTAS" />

        {/* Overlay */}
        <View style={styles.overlayBg}></View>
        <View></View>

        {/* Periodos selector */}

        {/* Promedio's zone */}
        <View
          style={[
            styles.promedioDiv,
            {
              backgroundColor: gradeColors[promedioColor].color,
            },
          ]}
        >
          <Text
            style={[
              styles.promedioTitle,
              {
                color: gradeColors[promedioColor].text,
              },
            ]}
          >
            TU PROMEDIO
          </Text>
          <Text
            style={[
              styles.promedio,
              {
                color: gradeColors[promedioColor].text,
              },
            ]}
          >
            {(grades.reduce((sum, g) => sum + g.grade, 0) / grades.length).toFixed(2)}
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
                    <Grade {...grade} key={index} />
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
    backgroundColor: "transparent",
    backdropFilter: "blur(15px)",
    zIndex: 20,
  },
  overlay: {},
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
    gap: 10
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
});
