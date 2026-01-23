import ChevronDown from "@/assets/icons/chevron-down-solid.svg";
import Shapes from "@/assets/icons/shapes-solid-full.svg";
import eventsType from "@/constants/eventsType";
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
  types: number;
  setTypes: React.Dispatch<React.SetStateAction<number>>;
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
            {eventsType[types].icon}
          </View>
          <Text style={stylesFormCreate.inputText}>
            {eventsType[types].text}
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
