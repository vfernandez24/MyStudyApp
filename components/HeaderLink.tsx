import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { ReactNode } from "react";
import { useFonts } from "expo-font";

type Props = {
  linkSrc: ReactNode;
  linkName: string;
  condition: boolean;
  href: () => void;
};

const HeaderLink = ({ linkSrc, linkName, href, condition }: Props) => {
  const [fontsLoaded] = useFonts({
    "InstrumentSans-Regular": require("../assets/fonts/InstrumentSans-Regular.ttf"),
    "InstrumentSans-Bold": require("../assets/fonts/InstrumentSans-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <View>
      <TouchableOpacity onPress={href} style={styles.link}>
        <View style={styles.linkIcon}>{linkSrc}</View>
        <Text
          style={[
            styles.linkText,
            {
              color: condition ? "#6C98F7" : "#fff",
              fontFamily: condition
                ? "InstrumentSans-Bold"
                : "InstrumentSans-Regular",
            },
          ]}
        >
          {linkName}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default HeaderLink;

const styles = StyleSheet.create({
  link: {
    height: 50,
    width: "100%",
    display: "flex",
    fontFamily: "InstrumentSans-Regular",
    fontWeight: 400,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginVertical: 10,
  },
  linkIcon: {
    width: 70,
    height: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  linkText: {
    height: 50,
    width: "100%",
    fontSize: 20,
    fontFamily: "InstrumentSans-Regular",
    lineHeight: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
