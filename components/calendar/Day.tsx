import { event } from "@/constants/types";
import React from "react";
import { StyleSheet, View } from "react-native";
import Event from "./Event";

const Day = () => {
  const events: event[] = [];
  let eventsDay: event[] = [];

  const date = new Date().getDate().toString();

  events.forEach((e) => {
    if (e.date == String(date)) {
      eventsDay[eventsDay.length + 1] = e;
    }
  });

  return (
    <View style={styles.container}>
      <View style={styles.day}></View>
      <View style={styles.eventsContainer}>
        {eventsDay.map((e) => (
          <Event e={e} />
        ))}
      </View>
    </View>
  );
};

export default Day;

const styles = StyleSheet.create({
  container: {},
  day: {},
  eventsContainer: {},
});
