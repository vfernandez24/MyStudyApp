import ChevronDown from "@/assets/icons/chevron-down-solid.svg";
import Palette from "@/assets/icons/palette-solid-full.svg";
import colors from "@/constants/colors";
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
  color: number;
  setOverlayColor: (overlayColor: boolean) => void;
  setOverlay: (overlay: boolean) => void;
};

const EventColor = ({ color, setOverlayColor, setOverlay }: Props) => {
  return (
    <View style={stylesFormCreate.label}>
      <View style={stylesFormCreate.iconDiv}>
        <Palette height={35} width={35} fill="#0b0279" />
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
            setOverlayColor(true);
            setOverlay(true);
            Keyboard.dismiss();
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 0,
            position: "relative",
          }}
        >
          {colors[color ?? -1] ? (
            <View
              style={{
                height: "100%",
                width: "80%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                paddingLeft: 10,
                gap: 10,
              }}
            >
              <View
                style={{
                  backgroundColor: colors[color ?? -1].hex,
                  width: 25,
                  height: 25,
                  borderRadius: 30,
                }}
              ></View>
              <Text
                style={{
                  lineHeight: 50,
                  color: "#999",
                  fontSize: 18,
                  fontFamily: "InstrumentSans-Medium",
                  maxWidth: "70%",
                }}
                ellipsizeMode="tail"
                numberOfLines={1}
              >
                {colors[color ?? -1].name}
              </Text>
            </View>
          ) : (
            <View
              style={{
                height: "100%",
                width: "80%",
                justifyContent: "center",
                padding: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: "InstrumentSans-Medium",
                  fontSize: 18,
                  color: "#999",
                }}
              >
                Selecciona un color
              </Text>
            </View>
          )}
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

export default EventColor;

const styles = StyleSheet.create({});
