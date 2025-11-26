import Tag from "@/assets/icons/tag-solid.svg";
import { stylesFormCreate } from "@/constants/styles";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

type Props = {
  name: string;
  setName: (name: string) => void;
  error: boolean;
  setError: (error: boolean) => void;
};

const EventName = ({ name, setName, error, setError }: Props) => {
  return (
    <View style={stylesFormCreate.label}>
      <View style={stylesFormCreate.iconDiv}>
        <Tag height={35} width={35} fill="#0b0279" />
      </View>
      <TextInput
        style={{
          minHeight: "100%",
          width: "75%",
          borderWidth: 2,
          borderRadius: 10,
          padding: 5,
          paddingHorizontal: 10,
          fontSize: 18,
          fontFamily: "InstrumentSans-Medium",
          color: "#999",
          borderColor: error ? "#f00" : "#d3d3d3",
        }}
        placeholder="Nombre"
        value={name}
        onChangeText={(e) => {
          setName(e);
          setError(e.length < 3 || e.trim() === "");
        }}
      ></TextInput>
    </View>
  );
};

export default EventName;

const styles = StyleSheet.create({});
