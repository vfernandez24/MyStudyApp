import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const AlertDelete = ({
  alert,
  setAlert,
  setOverlay,
  functionDel,
  selectedGrade,
}: {
  selectedGrade: number | null;
  alert: boolean;
  functionDel: (id: number) => void;
  setAlert: (alert: boolean) => void;
  setOverlay: (overlay: boolean) => void;
}) => {
  return (
    <View style={[styles.alert, { display: alert == true ? "flex" : "none" }]}>
      <Text style={styles.alertText}>
        Vas a borrar una nota permanentemente
      </Text>
      <Text style={styles.alertText}>¿Estás seguro?</Text>
      <View style={styles.alertButtonContainer}>
        <TouchableOpacity
          onPress={() => {
            setOverlay(false);
            setAlert(false);
          }}
          style={[styles.alertButton, { backgroundColor: "#d3d3d3" }]}
        >
          <Text style={styles.alertButtonText}>NO</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setOverlay(false);
            setAlert(false);
            functionDel(selectedGrade ?? 0);
          }}
          style={[
            styles.alertButton,
            { backgroundColor: "rgba(255, 0, 0, 0.3)" },
          ]}
        >
          <Text style={styles.alertButtonText}>SÍ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AlertDelete;

const styles = StyleSheet.create({
  alert: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: "-50%" }, { translateY: -80 }],
    zIndex: 50,
    backgroundColor: "#fff",
    maxWidth: "80%",
    borderRadius: 20,
    padding: 20,
  },
  alertText: {
    fontSize: 18,
    fontFamily: "InstrumentSans-Medium",
    textAlign: "center",
    marginBottom: 20,
  },
  alertButtonContainer: {
    width: "100%",
    height: 70,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  alertButton: {
    width: "40%",
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  alertButtonText: {
    fontSize: 20,
    fontFamily: "InstrumentSans-Bold",
    color: "#fff",
  },
});
