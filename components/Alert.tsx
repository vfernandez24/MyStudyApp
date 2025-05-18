import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Alert = ({ text, condition }: { text: string; condition: boolean }) => {
  return (
    <View style={[styles.container, {}]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

export default Alert;

const styles = StyleSheet.create({
  container: {},
  text: {},
});
