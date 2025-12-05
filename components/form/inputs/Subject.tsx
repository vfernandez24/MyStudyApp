import ChevronDown from "@/assets/icons/chevron-down-solid.svg";
import Cap from "@/assets/icons/graduation-cap-solid.svg";
import colors from "@/constants/colors";
import { stylesFormCreate } from "@/constants/styles";
import { subject } from "@/constants/types";
import React from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const SubjectInput = ({
  subject,
  setSubject,
  error,
  overlay,
  setOverlay,
  setOverlaySelect,
  setOverlayType,
  subjects,
}: {
  subject: number;
  setSubject: (subject: number) => void;
  error: { subject: boolean };
  overlay: boolean;
  setOverlay: (overlay: boolean) => void;
  setOverlaySelect: (overlaySelect: boolean) => void;
  setOverlayType: (
    overlayType: "subjects" | "grades" | "notifications"
  ) => void;
  subjects: subject[];
}) => {
  return (
    <View style={stylesFormCreate.label}>
      <View style={stylesFormCreate.iconDiv}>
        <Cap height={35} width={35} fill="#0b0279" />
      </View>
      <View
        style={{
          borderColor: error.subject == true ? "#f00" : "#d3d3d3",
          borderWidth: 2,
          width: "75%",
          borderRadius: 10,
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setOverlay(true);
            setOverlaySelect(true);
            setOverlayType("subjects");
            Keyboard.dismiss();
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 10,
            position: "relative",
          }}
        >
          <View
            style={{
              borderRadius: 12.5,
              backgroundColor: (() => {
                const sel = subjects.find((s) => s.id === subject);
                if (sel) return colors[sel.color].hex;
                if (subjects.length > 0) return colors[subjects[0].color].hex;
                return "#d3d3d3";
              })(),
              height: 25,
              width: 25,
              marginRight: 10,
              display: subject === -1 ? "none" : "flex",
            }}
          ></View>
          <Text style={stylesFormCreate.inputText}>
            {(() => {
              const sel = subjects.find((s) => s.id == subject);
              if (sel) return sel.name;
              if (subjects.length > 0 || subject === -1)
                return "Selecciona asignatura";
              return "Selecciona asignatura";
            })()}
          </Text>
          <View
            style={{
              position: "absolute",
              right: 10,
            }}
          >
            <ChevronDown fill="#6C98F7" height={25} width={25} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SubjectInput;

const styles = StyleSheet.create({});
