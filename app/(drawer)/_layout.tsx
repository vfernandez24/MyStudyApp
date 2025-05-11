import { DrawerContentScrollView } from "@react-navigation/drawer";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { router, usePathname } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import "react-native-gesture-handler";
import HeaderLink from "../../components/HeaderLink";

function CustomDrawerContent(props: any) {
  const pathname = usePathname?.() ?? "";
  const path = "/(drawer)" + pathname;

  const links = [
    {
      href: "/(drawer)/home",
      name: "Inicio",
      icon: require("../../assets/icons/pages/home.png"),
      iconFocus: require("../../assets/icons/pages/homeFocus.png"),
    },
    {
      href: "/(drawer)/grades",
      name: "Notas",
      icon: require("../../assets/icons/pages/grades.png"),
      iconFocus: require("../../assets/icons/pages/gradesFocus.png"),
    },
    {
      href: "/(drawer)/calendar",
      name: "Calendario",
      icon: require("../../assets/icons/pages/calendar.png"),
      iconFocus: require("../../assets/icons/pages/calendarFocus.png"),
    },
    {
      href: "/(drawer)/timetable",
      name: "Horario",
      icon: require("../../assets/icons/pages/timetable.png"),
      iconFocus: require("../../assets/icons/pages/timetableFocus.png"),
    },
    {
      href: "/(drawer)/subjects",
      name: "Asignaturas",
      icon: require("../../assets/icons/pages/subjects.png"),
      iconFocus: require("../../assets/icons/pages/subjectsFocus.png"),
    },
    {
      href: "/(drawer)/exams",
      name: "Exámenes",
      icon: require("../../assets/icons/pages/exams.png"),
      iconFocus: require("../../assets/icons/pages/exams.png"),
    },
    {
      href: "/(drawer)/homework",
      name: "Tareas",
      icon: require("../../assets/icons/pages/homework.png"),
      iconFocus: require("../../assets/icons/pages/homework.png"),
    },
    {
      href: "/(drawer)/notes",
      name: "Apuntes",
      icon: require("../../assets/icons/pages/notes.png"),
      iconFocus: require("../../assets/icons/pages/notes.png"),
    },
    {
      href: "/(drawer)/premium",
      name: "Planes Premium",
      icon: require("../../assets/icons/pages/premium.png"),
      iconFocus: require("../../assets/icons/pages/premium.png"),
    },
    {
      href: "/(drawer)/teachers",
      name: "Profesores",
      icon: require("../../assets/icons/pages/teacher.png"),
      iconFocus: require("../../assets/icons/pages/teacher.png"),
    },
  ];
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
        <Image
          source={require("../../assets/icons/closeSideBar.png")}
          style={{ height: 40, width: 40 }}
          tintColor="#0b0279"
        />
      </TouchableOpacity>

      {/* Account */}
      <View style={[styles.optionDiv, { top: 0 }]}>
        <HeaderLink
          condition={path == "/(drawer)/account" ? true : false}
          href={() => router.push("/(drawer)/account")}
          linkName="Cuenta"
          linkSrc={
            <Image
              source={
                path == "/(drawer)/account"
                  ? require("../../assets/icons/pages/accountFocus.png")
                  : require("../../assets/icons/pages/account.png")
              }
              tintColor={path === "/(drawer)/account" ? "#6C98F7" : "#000"}
              style={styles.linkIconImage}
            />
          }
        />
      </View>

      {/* SideBar */}
      <DrawerContentScrollView {...props}>
        {/* Link's zone */}
        <View style={styles.linkContainer}>
          {links.map((link) => (
            <HeaderLink
              condition={path == link.href}
              href={() => router.push(link.href)}
              linkName={link.name}
              linkSrc={
                <Image
                  source={path == link.href ? link.iconFocus : link.icon}
                  tintColor={path === link.href ? "#6C98F7" : "#000"}
                  style={styles.linkIconImage}
                />
              }
              key={link.href}
            />
          ))}
        </View>
      </DrawerContentScrollView>
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
        <Image
          source={require("../../assets/icons/sideBar.png")}
          style={{ height: 40, width: 40 }}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/(drawer)/settings")}
        style={{ position: "absolute", top: 24, right: 20 }}
      >
        <Image
          source={require("../../assets/icons/pages/settingsFocus.png")}
          tintColor="#fff"
          style={{ height: 30, width: 30 }}
        />
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
