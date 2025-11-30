import Check from "@/assets/icons/check-solid-full.svg";
import { period, teacher } from "@/constants/types";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  element: string | teacher | period;
  pressFunction: (id: number | string) => void;
  overlayType: "teachers" | "periods" | "genders";
  teacher?: number;
  period?: number;
  gender?: "male" | "female";
};

function BasicElement({
  element,
  pressFunction,
  overlayType,
  teacher,
  period,
  gender,
}: Props) {
  const [isSelected, setIsSelected] = useState<boolean>(false);

  // id o valor según overlayType
  const id =
    overlayType === "genders"
      ? (element as string)
      : typeof element === "object" && "id" in element
      ? element.id
      : -1;

  useEffect(() => {
    if (overlayType === "teachers") {
      setIsSelected(teacher === id);
    } else if (overlayType === "periods") {
      setIsSelected(period === id);
    } else if (overlayType === "genders") {
      setIsSelected(gender === id);
    }
  }, [overlayType, teacher, period, gender, id]);

  let displayText = "";
  if (
    overlayType === "teachers" &&
    typeof element === "object" &&
    "name" &&
    "surnames" in element
  ) {
    displayText = `${element.name} ${element.surnames}`;
  } else if (
    overlayType === "periods" &&
    typeof element === "object" &&
    "name" in element
  ) {
    displayText = element.name;
  } else if (overlayType === "genders" && typeof element === "string") {
    displayText = element === "male" ? "Hombre" : "Mujer";
  }

  return (
    <TouchableOpacity
      onPress={() => pressFunction(id)}
      style={styles.container}
    >
      <View style={styles.textDiv}>
        <Text style={styles.text1}>{displayText}</Text>
      </View>

      <View
        style={[
          styles.checkBox,
          {
            borderColor: isSelected ? "#446dc4ff" : "#dedede",
            backgroundColor: isSelected ? "#446dc4ff" : "#fff",
          },
        ]}
      >
        {isSelected && <Check height={20} width={20} fill="#fff" />}
      </View>
    </TouchableOpacity>
  );
}

export default BasicElement;

const styles = StyleSheet.create({
  container: {
    maxHeight: 60,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    overflow: "visible",
    alignItems: "center",
    padding: 10,
    zIndex: 5,
    marginBottom: 10,
  },
  textDiv: {
    width: "80%",
    height: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingLeft: 0,
    overflow: "visible",
  },
  tDiv: {
    marginBottom: 4,
    overflow: "visible",
  },
  text1: {
    fontSize: 24,
    lineHeight: 32,
    color: "#777",
    overflow: "visible",
    fontFamily: "InstrumentSans-Medium",
  },
  arrowDiv: {
    position: "absolute",
    top: "50%",
    right: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  checkBox: {
    height: 30,
    width: 30,
    borderRadius: 30,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
  },
});
