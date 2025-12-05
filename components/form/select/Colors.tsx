import colors from "@/constants/colors";
import icons from "@/constants/icons";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

type Props = {
  overlayColor: boolean;
  setOverlayColor: (id: boolean) => void;
  setOverlay: (id: boolean) => void;
  typeSelect: "icon" | "color";
  setColor: (id: number) => void;
  setIcon: (id: number) => void;
};

const Colors = ({
  overlayColor,
  typeSelect,
  setColor,
  setIcon,
  setOverlayColor,
  setOverlay,
}: Props) => {
  return (
    <ScrollView
      style={[
        styles.overlayDiv,
        {
          display: overlayColor == true ? "flex" : "none",
          height: typeSelect == "icon" ? 325 : "auto",
        },
      ]}
    >
      <View style={styles.colorsOverlayRow}>
        {typeSelect == "color"
          ? colors
              .filter((col) => col.id <= 4)
              .map((col) => (
                <TouchableOpacity
                  onPress={() => {
                    setColor(col.id), setOverlayColor(false);
                    setOverlay(false);
                  }}
                  style={[styles.colorsOverlayColorDiv]}
                  key={col.id}
                >
                  <View
                    style={[
                      styles.colorsOverlayColor,
                      { backgroundColor: col.hex },
                    ]}
                  ></View>
                </TouchableOpacity>
              ))
          : icons
              .filter((i) => i.id <= 4)
              .map((i) => (
                <TouchableOpacity
                  onPress={() => {
                    setIcon(i.id), setOverlayColor(false);
                    setOverlay(false);
                  }}
                  style={styles.colorsOverlayColorDiv}
                  key={i.id}
                >
                  {i.icon}
                </TouchableOpacity>
              ))}
      </View>
      <View style={styles.colorsOverlayRow}>
        {typeSelect == "color"
          ? colors
              .filter((col) => col.id <= 9 && col.id > 4)
              .map((col) => (
                <TouchableOpacity
                  onPress={() => {
                    setColor(col.id), setOverlayColor(false);
                    setOverlay(false);
                  }}
                  style={[styles.colorsOverlayColorDiv]}
                  key={col.id}
                >
                  <View
                    style={[
                      styles.colorsOverlayColor,
                      { backgroundColor: col.hex },
                    ]}
                  ></View>
                </TouchableOpacity>
              ))
          : icons
              .filter((i) => i.id <= 9 && i.id > 4)
              .map((i) => (
                <TouchableOpacity
                  onPress={() => {
                    setIcon(i.id), setOverlayColor(false);
                    setOverlay(false);
                  }}
                  style={styles.colorsOverlayColorDiv}
                  key={i.id}
                >
                  {i.icon}
                </TouchableOpacity>
              ))}
      </View>
      <View style={styles.colorsOverlayRow}>
        {typeSelect == "color"
          ? colors
              .filter((col) => col.id <= 14 && col.id > 9)
              .map((col) => (
                <TouchableOpacity
                  onPress={() => {
                    setColor(col.id), setOverlayColor(false);
                    setOverlay(false);
                  }}
                  style={[styles.colorsOverlayColorDiv]}
                  key={col.id}
                >
                  <View
                    style={[
                      styles.colorsOverlayColor,
                      { backgroundColor: col.hex },
                    ]}
                  ></View>
                </TouchableOpacity>
              ))
          : icons
              .filter((i) => i.id <= 14 && i.id > 9)
              .map((i) => (
                <TouchableOpacity
                  onPress={() => {
                    setIcon(i.id), setOverlayColor(false);
                    setOverlay(false);
                  }}
                  style={styles.colorsOverlayColorDiv}
                  key={i.id}
                >
                  {i.icon}
                </TouchableOpacity>
              ))}
      </View>
      <View style={styles.colorsOverlayRow}>
        {typeSelect == "color"
          ? colors
              .filter((col) => col.id <= 19 && col.id > 14)
              .map((col) => (
                <TouchableOpacity
                  onPress={() => {
                    setColor(col.id), setOverlayColor(false);
                    setOverlay(false);
                  }}
                  style={[styles.colorsOverlayColorDiv]}
                  key={col.id}
                >
                  <View
                    style={[
                      styles.colorsOverlayColor,
                      { backgroundColor: col.hex },
                    ]}
                  ></View>
                </TouchableOpacity>
              ))
          : icons
              .filter((i) => i.id <= 19 && i.id > 14)
              .map((i) => (
                <TouchableOpacity
                  onPress={() => {
                    setIcon(i.id), setOverlayColor(false);
                    setOverlay(false);
                  }}
                  style={styles.colorsOverlayColorDiv}
                  key={i.id}
                >
                  {i.icon}
                </TouchableOpacity>
              ))}
      </View>
      <View style={styles.colorsOverlayRow}>
        {typeSelect == "color"
          ? colors
              .filter((col) => col.id > 19)
              .map((col) => (
                <TouchableOpacity
                  onPress={() => {
                    setColor(col.id), setOverlayColor(false);
                    setOverlay(false);
                  }}
                  style={[styles.colorsOverlayColorDiv]}
                  key={col.id}
                >
                  <View
                    style={[
                      styles.colorsOverlayColor,
                      { backgroundColor: col.hex },
                    ]}
                  ></View>
                </TouchableOpacity>
              ))
          : icons
              .filter((i) => i.id > 19 && i.id <= 24)
              .map((i) => (
                <TouchableOpacity
                  onPress={() => {
                    setIcon(i.id), setOverlayColor(false);
                    setOverlay(false);
                  }}
                  style={styles.colorsOverlayColorDiv}
                  key={i.id}
                >
                  {i.icon}
                </TouchableOpacity>
              ))}
      </View>

      {typeSelect == "icon" ? (
        <>
          <View style={styles.colorsOverlayRow}>
            {icons
              .filter((i) => i.id > 24 && i.id <= 29)
              .map((i) => (
                <TouchableOpacity
                  onPress={() => {
                    setIcon(i.id), setOverlayColor(false);
                    setOverlay(false);
                  }}
                  style={styles.colorsOverlayColorDiv}
                  key={i.id}
                >
                  {i.icon}
                </TouchableOpacity>
              ))}
          </View>
          <View style={styles.colorsOverlayRow}>
            {icons
              .filter((i) => i.id > 29 && i.id <= 34)
              .map((i) => (
                <TouchableOpacity
                  onPress={() => {
                    setIcon(i.id), setOverlayColor(false);
                    setOverlay(false);
                  }}
                  style={styles.colorsOverlayColorDiv}
                  key={i.id}
                >
                  {i.icon}
                </TouchableOpacity>
              ))}
          </View>
          <View style={styles.colorsOverlayRow}>
            {icons
              .filter((i) => i.id > 34 && i.id <= 39)
              .map((i) => (
                <TouchableOpacity
                  onPress={() => {
                    setIcon(i.id), setOverlayColor(false);
                    setOverlay(false);
                  }}
                  style={styles.colorsOverlayColorDiv}
                  key={i.id}
                >
                  {i.icon}
                </TouchableOpacity>
              ))}
          </View>
          <View style={styles.colorsOverlayRow}>
            {icons
              .filter((i) => i.id > 39 && i.id <= 44)
              .map((i) => (
                <TouchableOpacity
                  onPress={() => {
                    setIcon(i.id), setOverlayColor(false);
                    setOverlay(false);
                  }}
                  style={styles.colorsOverlayColorDiv}
                  key={i.id}
                >
                  {i.icon}
                </TouchableOpacity>
              ))}
          </View>
          <View style={styles.colorsOverlayRow}>
            {icons
              .filter((i) => i.id > 44 && i.id <= 49)
              .map((i) => (
                <TouchableOpacity
                  onPress={() => {
                    setIcon(i.id), setOverlayColor(false);
                    setOverlay(false);
                  }}
                  style={styles.colorsOverlayColorDiv}
                  key={i.id}
                >
                  {i.icon}
                </TouchableOpacity>
              ))}
          </View>
        </>
      ) : null}
      {typeSelect == "icon" ? <View style={{ height: 20 }}></View> : null}
    </ScrollView>
  );
};

export default Colors;

const styles = StyleSheet.create({
  overlayDiv: {
    position: "absolute",
    zIndex: 25,
    width: "auto",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    display: "flex",
    gap: 15,
    top: "50%",
    left: "50%",
    transform: [{ translateX: "-40%" }, { translateY: "-40%" }],
    paddingBottom: 20,
  },
  colorsOverlayRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    paddingVertical: 10,
  },
  colorsOverlayColorDiv: {
    backgroundColor: "#ececec",
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  colorsOverlayColor: {
    height: 30,
    width: 30,
    borderRadius: "100%",
  },
});
