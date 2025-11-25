import Book from "@/assets/icons/book-solid-full.svg";
import Briefcase from "@/assets/icons/briefcase-solid-full.svg";
import ChevronDown from "@/assets/icons/chevron-down-solid.svg";
import Others from "@/assets/icons/circle-question-regular-full.svg";
import Shapes from "@/assets/icons/shapes-solid-full.svg";
import User from "@/assets/icons/user-solid.svg";
import { stylesFormCreate } from "@/constants/styles";
import React from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  types: "personal" | "job" | "school" | "other";
  setTypes: React.Dispatch<
    React.SetStateAction<"personal" | "job" | "school" | "other">
  >;
  setOverlay: React.Dispatch<React.SetStateAction<boolean>>;
  setOverlaySelect: React.Dispatch<React.SetStateAction<boolean>>;
  setOverlayType: React.Dispatch<
    React.SetStateAction<"subjects" | "notifications" | "typeEvents">
  >;
};

const EventType = ({
  types,
  setTypes,
  setOverlay,
  setOverlaySelect,
  setOverlayType,
}: Props) => {
  return (
    <View style={stylesFormCreate.label}>
      <View style={stylesFormCreate.iconDiv}>
        <Shapes height={35} width={35} fill="#0b0279" />
      </View>
      <View
        style={{
          borderColor: "#d3d3d3",
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
            setOverlayType("typeEvents");
            Keyboard.dismiss();
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 10,
            position: "relative",
            gap: 10,
          }}
        >
          <View
            style={{
              height: 25,
              width: 25,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {(() => {
              switch (types) {
                case "personal":
                  return <User height={30} width={30} fill="#446DC4" />;
                case "job":
                  return <Briefcase height={30} width={30} fill="#446DC4" />;
                case "school":
                  return <Book height={30} width={30} fill="#446DC4" />;
                case "other":
                  return <Others height={30} width={30} fill="#446DC4" />;
              }
            })()}
          </View>
          <Text style={stylesFormCreate.inputText}>
            {(() => {
              switch (types) {
                case "job":
                  return "Trabajo";
                case "personal":
                  return "Personal";
                case "school":
                  return "Escuela";
                case "other":
                  return "Otros";
              }
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

export default EventType;

const styles = StyleSheet.create({});
