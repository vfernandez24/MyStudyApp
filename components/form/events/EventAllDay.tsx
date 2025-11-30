import AllDay from "@/assets/icons/hourglass-half-solid-full.svg";
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
  allDay: boolean;
  setAllDay: React.Dispatch<React.SetStateAction<boolean>>;
};

const EventAllDay = ({ allDay, setAllDay }: Props) => {
  return (
    <View style={stylesFormCreate.label}>
      <View style={stylesFormCreate.iconDiv}>
        <AllDay height={35} width={35} fill="#0b0279" />
      </View>
      <View
        style={{
          width: "75%",
          borderRadius: 10,
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setAllDay((prev) => !prev);
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
          <Text style={stylesFormCreate.inputText}>Todo el día</Text>
          <View
            style={{
              position: "absolute",
              right: 1,
            }}
          >
            <View
              style={{
                height: 35,
                width: 70,
                borderRadius: 40,
                backgroundColor: allDay ? "#b8cfffb9" : "#efefef",
                flexDirection: "row",
                justifyContent: allDay ? "flex-end" : "flex-start",
                paddingHorizontal: 5,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  height: 25,
                  width: 25,
                  borderRadius: 25,
                  backgroundColor: allDay ? "#0b0279" : "#666",
                }}
              ></View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EventAllDay;

const styles = StyleSheet.create({});
