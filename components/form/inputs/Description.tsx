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
    <View style={[stylesFormCreate.inputContainer]}>
      <View style={stylesFormCreate.label}>
        <View style={stylesFormCreate.iconDiv}>
          <AlignLeft height={35} width={35} fill="#0b0279" />
        </View>
        <TextInput
          style={stylesFormCreate.input}
          placeholder="Descripción (Opcional)"
          value={description}
          onChangeText={(e) => setDescription(e)}
        ></TextInput>
      </View>
    </View>
  );
};

export default DescriptionInput;

const styles = StyleSheet.create({});
