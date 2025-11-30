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

type Props = {
  isVisible: boolean;
  subject: number;
  setOverlay: React.Dispatch<React.SetStateAction<boolean>>;
  setOverlaySelect: React.Dispatch<React.SetStateAction<boolean>>;
  setOverlayType: React.Dispatch<
    React.SetStateAction<"subjects" | "notifications" | "typeEvents">
  >;
  subjects: subject[];
};

const EventSubject = ({
  isVisible,
  subjects,
  subject,
  setOverlay,
  setOverlaySelect,
  setOverlayType,
}: Props) => {
  return (
    <>
      {isVisible && (
        <View style={stylesFormCreate.label}>
          <View style={stylesFormCreate.iconDiv}>
            <Cap height={35} width={35} fill="#0b0279" />
          </View>
          <View
            style={{
              borderWidth: 2,
              borderColor: "#d3d3d3",
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
                    const sel = subjects.find((s) => s.id == subject);
                    if (sel) return colors[sel.color].hex;
                    if (subjects.length > 0)
                      return colors[subjects[0].color].hex;
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
      )}
    </>
  );
};

export default EventSubject;

const styles = StyleSheet.create({});
