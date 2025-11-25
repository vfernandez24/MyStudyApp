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
  setShow: (value: boolean) => void;
  setShowT: (value: boolean) => void;
  setTypeDate: (value: "start" | "finished") => void;
  finishedTime: Date;
  allDay: boolean;
};

const EventEndTime = ({
  setShow,
  setShowT,
  setTypeDate,
  finishedTime,
  allDay,
}: Props) => {
  return (
    <TouchableOpacity style={stylesFormCreate.label} onPress={Keyboard.dismiss}>
      <View style={stylesFormCreate.iconDiv}></View>
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
          setTypeDate("finished");
          Keyboard.dismiss();
        }}
      >
        <Text style={stylesFormCreate.inputText}>
          {finishedTime.toLocaleString().split(" ")[0]}
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
          setTypeDate("finished");
          Keyboard.dismiss();
        }}
      >
        <Text style={stylesFormCreate.inputText}>
          {allDay
            ? "Todo el día"
            : `${finishedTime
                .getHours()
                .toString()
                .padStart(2, "0")}:${finishedTime
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
    </TouchableOpacity>
  );
};

export default EventEndTime;

const styles = StyleSheet.create({});
