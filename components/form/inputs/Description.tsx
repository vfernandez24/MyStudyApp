import AlignLeft from "@/assets/icons/align-left-solid.svg";
import { stylesFormCreate } from "@/constants/styles";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

const DescriptionInput = ({
  description,
  setDescription,
}: {
  description: string | undefined;
  setDescription: (description: string | undefined) => void;
}) => {
  return (
    <View style={stylesFormCreate.label}>
      <View style={stylesFormCreate.iconDiv}>
        <AlignLeft height={35} width={35} fill="#0b0279" />
      </View>
      <TextInput
        style={{
          minHeight: "100%",
          width: "75%",
          borderWidth: 2,
          borderRadius: 10,
          padding: 5,
          paddingHorizontal: 10,
          borderColor: "#d3d3d3",
          fontSize: 18,
          fontFamily: "InstrumentSans-Medium",
          color: "#999",
        }}
        placeholder="Descripción (Opcional)"
        value={description}
        onChangeText={(e) => setDescription(e)}
      ></TextInput>
    </View>
  );
};

export default DescriptionInput;

const styles = StyleSheet.create({});
