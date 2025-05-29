import { usePathname } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

const screenHeight = Dimensions.get("window").height;
const scrollHeight = screenHeight - 80;

const index = () => {
  const pathname = usePathname?.() ?? "";
  const path = "/(drawer)" + pathname;

  return (
    <View>
      <Text></Text>
    </View>
  )
}

export default index

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: scrollHeight,
    padding: 15,
    paddingBottom: 200,
  },
})