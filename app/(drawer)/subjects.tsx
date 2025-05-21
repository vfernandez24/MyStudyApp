import Plus from "@/assets/icons/plus-solid.svg";
import PageTitle from "@/components/common/PageTitle";
import Subject from "@/components/listPages/Subject";
import { defaultSubjects } from "@/constants/defaultValues";
import { subject } from "@/constants/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const screenHeight = Dimensions.get("window").height;
const scrollHeight = screenHeight - 80;

export default function subjects() {
  const [subjects, setSubjects] = useState<subject[]>(defaultSubjects);
  useEffect(() => {
    const loadEvents = async () => {
      const gradesAwait = await AsyncStorage.getItem("subjects");
      const parsedSubjects: subject[] = gradesAwait
        ? JSON.parse(gradesAwait)
        : defaultSubjects;
      setSubjects(parsedSubjects);
    };
    loadEvents();
  }, []);
  return (
    <View>
      <ScrollView style={styles.container}>
        {/* Title */}
        <View style={styles.containerTitle}>
          <PageTitle title="ASIGNTURAS"></PageTitle>
        </View>

        <View style={styles.containerData}>
          {subjects.map((sub) => (
            <Subject key={sub.id} {...sub} />
          ))}
        </View>

        <View style={{ height: 100 }}></View>
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={async () => {
          await AsyncStorage.setItem("typeSubject", "create");
          router.push("/(modal)/createSubjects");
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
});
