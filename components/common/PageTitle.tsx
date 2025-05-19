import { StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
};

const PageTitle = ({ title }: Props) => {
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
    textAlign: "left",
    fontFamily: "InstrumentSans-Bold",
    letterSpacing: 5,
  },
});
