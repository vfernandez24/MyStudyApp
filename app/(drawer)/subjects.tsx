import Plus from "@/assets/icons/plus-solid.svg";
import PageTitle from "@/components/UI/PageTitle";
import Subject from "@/components/listPages/Subject";
import STORAGE_KEYS from "@/constants/storageKeys";
import useSubjects from "@/hooks/pages/useSubjects";
import { setItem } from "@/services/storage/dataArrays.service";
import { router } from "expo-router";
import React, { useEffect } from "react";
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
  const { subjects, loadEvents } = useSubjects();
  useEffect(() => {
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
          await setItem(STORAGE_KEYS.TYPEFORM_KEY, "create");
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
