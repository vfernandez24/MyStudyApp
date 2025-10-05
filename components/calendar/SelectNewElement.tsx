import Event from "@/assets/icons/calendar-day-solid-full.svg"
import Exam from "@/assets/icons/file-pen-solid-full.svg"
import Task from "@/assets/icons/list-check-solid-full.svg"
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const SelectNewElement = ({ pressFunction }: { pressFunction: (id: "event" | "exam" | "task") => void }) => {
  return (
    <>
      <TouchableOpacity style={styles.div} onPress={() => pressFunction("event")}>
        <View style={{ width: "30%", height: "100%", justifyContent: "center", alignItems: "center" }}>
          <Event height={25} width={25} fill="#446DC4" />
        </View>
        <View style={{ width: "70%", height: "100%", justifyContent: "center", alignItems: "flex-start", }}>
          <Text style={styles.text}>Evento</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.div} onPress={() => pressFunction("exam")}>
        <View style={{ width: "30%", height: "100%", justifyContent: "center", alignItems: "center" }}>
          <Exam height={25} width={25} fill="#446DC4" />
        </View>
        <View style={{ width: "70%", height: "100%", justifyContent: "center", alignItems: "flex-start", }}>
          <Text style={styles.text}>Examen</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.div} onPress={() => pressFunction("task")}>
        <View style={{ width: "30%", height: "100%", justifyContent: "center", alignItems: "center" }}>
          <Task height={25} width={25} fill="#446DC4" />
        </View>
        <View style={{ width: "70%", height: "100%", justifyContent: "center", alignItems: "flex-start", }}>
          <Text style={styles.text}>Tarea</Text>
        </View>
      </TouchableOpacity></>
  )
}

export default SelectNewElement

const styles = StyleSheet.create({
  div: {
    backgroundColor: "#fff",
    height: "28%",
    width: "100%",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    width: "70%",
    fontFamily: "InstrumentSans-SemiBold",
    fontSize: 20,
  },
})