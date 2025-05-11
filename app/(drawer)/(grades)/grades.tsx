import { useRouter } from "expo-router";
import { Image, StyleSheet, TouchableOpacity } from "react-native";

export default function grades() {
  const router = useRouter();

  return (
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
  );
}
const styles = StyleSheet.create({
  addButton: {
    position: "fixed",
    bottom: 20,
    right: 20,
    height: 60,
    width: 60,
    borderRadius: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0b0279",
  },
  addButtonImg: {
    height: 40,
    objectFit: "contain",
  },
});
