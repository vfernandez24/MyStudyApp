import Brain from "@/assets/icons/brain-solid.svg";
import Calendar from "@/assets/icons/calendar-solid.svg";
import TimeTable from "@/assets/icons/clock-solid.svg";
import Settings from "@/assets/icons/gear-solid.svg";
import Cap from "@/assets/icons/graduation-cap-solid.svg";
import Home from "@/assets/icons/house-solid.svg";
import CloseSideBar from "@/assets/icons/layout-sidebar-left-collapse.svg";
import SideBar from "@/assets/icons/layout-sidebar.svg";
import Pen from "@/assets/icons/pen-solid.svg";
import Teacher from "@/assets/icons/person-chalkboard-solid.svg";
import ToDo from "@/assets/icons/square-check-solid.svg";
import Pomodoro from "@/assets/icons/stopwatch-20-solid.svg";
import Trophy from "@/assets/icons/trophy-solid.svg";
import User from "@/assets/icons/user-solid.svg";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { router, usePathname } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import "react-native-gesture-handler";
import HeaderLink from "../../components/UI/HeaderLink";

function CustomDrawerContent(props: any) {
  const pathname = usePathname?.() ?? "";
  const path = "/(drawer)" + pathname;

  return (
    <View style={{ flex: 1, position: "relative", overflow: "hidden" }}>
      {/* Button to close the sidebar */}
      <TouchableOpacity
        style={{
          position: "absolute",
          top: -10,
          right: 0,
          zIndex: 20,
          padding: 15,
        }}
        onPress={() => props.navigation.closeDrawer()}
      >
        <CloseSideBar fill="#fff" height={40} width={40}></CloseSideBar>
      </TouchableOpacity>

      {/* Account */}
      <View style={[styles.optionDiv, { top: 0 }]}>
        <HeaderLink
          condition={path == "/(drawer)/account" ? true : false}
          href={() => router.push("/(drawer)/account")}
          linkName="Cuenta"
          linkSrc={
            <User
              height={30}
              width={30}
              fill={path === "/(drawer)/account" ? "#6C98F7" : "#0b0279"}
            />
          }
        />
      </View>

      {/* SideBar */}
      <DrawerContentScrollView {...props}>
        {/* Link's zone */}
        <View style={styles.linkContainer}>
          <HeaderLink
            condition={path == "/(drawer)/"}
            href={() => router.push("/(drawer)")}
            linkName={"Inicio"}
            linkSrc={
              <Home
                height={30}
                width={30}
                fill={path == "/(drawer)/" ? "#6C98F7" : "#0b0279"}
              />
            }
          />
          <HeaderLink
            condition={path == "/(drawer)/grades"}
            href={() => router.push("/(drawer)/(grades)/grades")}
            linkName={"Notas"}
            linkSrc={
              <Trophy
                height={30}
                width={30}
                fill={path == "/(drawer)/grades" ? "#6C98F7" : "#0b0279"}
              />
            }
          />
          <HeaderLink
            condition={path == "/(drawer)/subjects"}
            href={() => router.push("/(drawer)/subjects")}
            linkName={"Asignaturas"}
            linkSrc={
              <Cap
                height={30}
                width={30}
                fill={path == "/(drawer)/subjects" ? "#6C98F7" : "#0b0279"}
              />
            }
          />
          <HeaderLink
            condition={path == "/(drawer)/teachers"}
            href={() => router.push("/(drawer)/teachers")}
            linkName={"Profesores"}
            linkSrc={
              <Teacher
                height={30}
                width={30}
                fill={path == "/(drawer)/teachers" ? "#6C98F7" : "#0b0279"}
              />
            }
          />
          <HeaderLink
            condition={path == "/(drawer)/calendar"}
            href={() => router.push("/(drawer)/calendar")}
            linkName={"Calendario"}
            linkSrc={
              <Calendar
                height={30}
                width={30}
                fill={path == "/(drawer)/calendar" ? "#6C98F7" : "#0b0279"}
              />
            }
          />
          <HeaderLink
            condition={path == "/(drawer)/timetable"}
            href={() => router.push("/(drawer)/timetable")}
            linkName={"Horario"}
            linkSrc={
              <TimeTable
                height={30}
                width={30}
                fill={path == "/(drawer)/timetable" ? "#6C98F7" : "#0b0279"}
              />
            }
          />
          <HeaderLink
            condition={path == "/(drawer)/exams"}
            href={() => router.push("/(drawer)/exams")}
            linkName={"Exámenes"}
            linkSrc={
              <Brain
                height={30}
                width={30}
                fill={path == "/(drawer)/exams" ? "#6C98F7" : "#0b0279"}
              />
            }
          />
          <HeaderLink
            condition={path == "/(drawer)/homework"}
            href={() => router.push("/(drawer)/homework")}
            linkName={"Tareas"}
            linkSrc={
              <ToDo
                height={30}
                width={30}
                fill={path == "/(drawer)/homework" ? "#6C98F7" : "#0b0279"}
              />
            }
          />
          <HeaderLink
            condition={path == "/(drawer)/notes"}
            href={() => router.push("/(drawer)/notes")}
            linkName={"Apuntes"}
            linkSrc={
              <Pen
                height={30}
                width={30}
                fill={path == "/(drawer)/notes" ? "#6C98F7" : "#0b0279"}
              />
            }
          />
          <HeaderLink
            condition={path == "/(drawer)/homePomodoro"}
            href={() => router.push("/(drawer)/(pomodoro)/homePomodoro")}
            linkName={"Pomodoro"}
            linkSrc={
              <Pomodoro
                height={30}
                width={30}
                fill={
                  path == "/(drawer)/homePomodoro" ||
                  path == "/(drawer)/stopwatch" ||
                  path == "/(drawer)/config"
                    ? "#6C98F7"
                    : "#0b0279"
                }
              />
            }
          />
        </View>
      </DrawerContentScrollView>

      <View style={[styles.optionDiv, { bottom: 0 }]}>
        <HeaderLink
          condition={path == "/(drawer)/settings" ? true : false}
          href={() => router.push("/(drawer)/settings")}
          linkName="Configuración"
          linkSrc={
            <Settings
              height={30}
              width={30}
              fill={path === "/(drawer)/settings" ? "#6C98F7" : "#0b0279"}
            />
          }
        />
      </View>
    </View>
  );
}

function CustomHeader() {
  const navigation = useNavigation();

  return (
    <View
      style={{
        backgroundColor: "#0B0279",
        flexDirection: "row",
        height: 77,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <TouchableOpacity
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        style={{ position: "absolute", top: 18, left: 20 }}
      >
        <SideBar height={40} width={40} fill="#0b0279"></SideBar>
      </TouchableOpacity>

      <Image
        source={require("../../assets/images/isotipo.png")}
        style={{ height: 50, width: 50, resizeMode: "contain" }}
      />
    </View>
  );
}

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        header: () => <CustomHeader />,
        drawerStyle: {
          backgroundColor: "#fff",
          paddingVertical: 16,
        },
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    />
  );
}

const styles = StyleSheet.create({
  linkContainer: {
    flex: 1,
    flexDirection: "column",
    paddingVertical: 75,
  },
  linkIconImage: { height: 30, width: 30 },
  optionDiv: {
    position: "absolute",
    left: 0,
    height: 80,
    zIndex: 9,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingLeft: 10,
    boxShadow: "0px 0px 20px 20px #fff",
  },
});
