import { ImageBackground, StyleSheet, Text, View } from "react-native";
import PageTitle from "../../components/PageTitle";

export default function Index() {
  const months = [
    "ENE",
    "FEB",
    "MAR",
    "ABR",
    "MAY",
    "JUN",
    "JUL",
    "AGO",
    "SEP",
    "OCT",
    "NOV",
    "DIC",
  ];
  // const todayDate = new Date();

  return (
    <View style={styles.container}>
      <PageTitle title="INICIO" />

      {/* Today's zone */}
      <View style={styles.todayDiv}>
        <View style={styles.calendar}>
          <ImageBackground
            source={require("../../assets/backgrounds/calendar.png")}
            tintColor={"#0B0279"}
            imageStyle={{
              height: 145,
              objectFit: "contain",
              alignSelf: "center",
            }}
          >
            <Text></Text>
          </ImageBackground>
        </View>
      </View>

      {/* Promedio's zone */}
      <View style={styles.promedioDiv}></View>

      {/* Timetable's zone */}
      <View style={styles.horarioDiv}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    gap: 10,
  },
  todayDiv: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    height: 145,
    width: "100%",
  },
  calendar: {
    height: 145,
    width: "50%",
  },
  promedioDiv: {
    height: 110,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderRadius: 20,
    borderColor: "green",
  },
  horarioDiv: {
    height: "100%",
    width: "100%",
  },
});
