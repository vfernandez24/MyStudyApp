import AlignLeft from "@/assets/icons/align-left-solid.svg";
import { stylesFormCreate } from "@/constants/styles";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

const DescriptionInput = ({
  description,
  setDescription,
}: {
  description: string | undefined;
  setDescription: (description: string | undefined) => void;
}) => {
  return (
    <View
      style={[
        stylesFormCreate.inputContainer,
        description?.length !== 0
          ? { height: 80 }
          : { height: 65, alignItems: "center", justifyContent: "center" },
      ]}
    >
      <Text
        style={[
          stylesFormCreate.labelText,
          description?.length === 0 ? { display: "none" } : { display: "flex" },
        ]}
      >
        Descripción (Opcional)
      </Text>
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
