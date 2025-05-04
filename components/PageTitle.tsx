import { StyleSheet, Text, View } from "react-native";
import { useFonts } from "expo-font";

type Props = {
  title: string;
};

const PageTitle = ({ title }: Props) => {
  const [fontsLoaded] = useFonts({
    "InstrumentSans-Bold": require("../assets/fonts/InstrumentSans-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.view}>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
};

export default PageTitle;

const styles = StyleSheet.create({
  view: {
    paddingVertical: 5,
  },
  text: {
    fontSize: 40,
    color: "#6C98F7",
    textAlign: "right",
    fontFamily: "InstrumentSans-Bold",
    letterSpacing: 5,
  },
});
