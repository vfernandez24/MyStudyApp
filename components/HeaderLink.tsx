import { useFonts } from "expo-font";
import { FC, ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  linkSrc: ReactNode;
  linkName: string;
  condition: boolean;
  href: () => void;
};

const HeaderLink: FC<Props> = ({ linkSrc, linkName, condition, href }) => {
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
