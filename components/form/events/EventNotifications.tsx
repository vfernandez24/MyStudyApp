import Bell from "@/assets/icons/bell-solid-full.svg";
import ChevronDown from "@/assets/icons/chevron-down-solid.svg";
import { stylesFormCreate } from "@/constants/styles";
import { notification } from "@/constants/types";
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
  notifications: notification[];
  setOverlay: (value: boolean) => void;
  setOverlaySelect: (value: boolean) => void;
  setOverlayType: (value: "subjects" | "notifications" | "typeEvents") => void;
};

const EventNotifications = ({
  setShow,
  setShowT,
  setTypeDate,
  finishedTime,
  allDay,
  notifications,
  setOverlay,
  setOverlaySelect,
  setOverlayType,
}: Props) => {
  return (
    <View style={stylesFormCreate.label}>
      <View style={stylesFormCreate.iconDiv}>
        <Bell height={35} width={35} fill="#0b0279" />
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
            setOverlayType("notifications");
            Keyboard.dismiss();
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 10,
            position: "relative",
          }}
        >
          <Text style={stylesFormCreate.inputText}>
            {`${
              notifications.length !== 0 ? String(notifications.length) : "Sin"
            } ${
              notifications.length !== 1 ? "notificaciones" : "notificación"
            }`}
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

export default EventNotifications;

const styles = StyleSheet.create({});
