import Calendar from "@/assets/icons/calendar-regular.svg";
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
  setShow: (show: boolean) => void;
  setShowT: (showT: boolean) => void;
  setTypeDate: (typeDate: "start" | "finished") => void;
  startTime: Date;
  allDay: boolean;
};

const EventStartTime = ({
  setShow,
  setTypeDate,
  startTime,
  allDay,
  setShowT,
}: Props) => {
  return (
    <View style={stylesFormCreate.label}>
      <View
        style={[{ position: "relative", top: 35 }, stylesFormCreate.iconDiv]}
      >
        <Calendar height={35} width={35} fill="#0b0279" />
      </View>
      <TouchableOpacity
        style={[
          stylesFormCreate.input,
          {
            width: "35%",
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
        onPress={() => {
          setShow(true);
          setTypeDate("start");
          Keyboard.dismiss();
        }}
      >
        <Text style={stylesFormCreate.inputText}>
          {startTime.toLocaleString().split(" ")[0]}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          stylesFormCreate.input,
          {
            width: "35%",
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
        onPress={() => {
          setShowT(true);
          setTypeDate("start");
          Keyboard.dismiss();
        }}
      >
        <Text style={stylesFormCreate.inputText}>
          {allDay
            ? "Todo el día"
            : `${startTime.getHours().toString().padStart(2, "0")}:${startTime
                .getMinutes()
                .toString()
                .padStart(2, "0")}`}
        </Text>
        <View
          style={{
            position: "absolute",
            right: 10,
          }}
        ></View>
      </TouchableOpacity>
    </View>
  );
};

export default EventStartTime;

const styles = StyleSheet.create({});
