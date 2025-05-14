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

      const pr = calculateAverage();
      const fetchPromedio = async () => {
        const parsed = Number(pr);
        setPromedioColor(selectColor(parsed));
      };
      fetchPromedio();
    }, [])
  );

  let gradesPerSubject: { [key: string]: number } = {};
  subjects.forEach((sub) => {
    gradesPerSubject[sub.id] = 0;
  });

  grades.forEach((grade) => {
    if (gradesPerSubject[grade.subject] !== undefined) {
      gradesPerSubject[grade.subject] += 1;
    }
  });

  const calculateAverage = () => {
    if (grades.length == 0) return "0";
    const total = grades.reduce((sum, g) => sum + g.grade, 0);
    return (total / grades.length).toFixed(2);
  };
  const pr = calculateAverage();
  const [promedio, setPromedio] = useState(pr);
  const [promedioColor, setPromedioColor] = useState(0);

  useEffect(() => {
    const fetchPromedio = async () => {
      const parsed = Number(pr);
      setPromedioColor(selectColor(parsed));
    };
    fetchPromedio();
  }, []);

  return (
    <View>
      <ScrollView style={styles.container}>
        {/* Title */}
        <PageTitle title="NOTAS" />

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
            {promedio}
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
    letterSpacing: 2,
  },
  subjectContainer: {},
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
