import React, { useEffect } from "react";
import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { router, usePathname } from "expo-router";

import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { StyleSheet } from "react-native";
import { Label, View } from "tamagui";
import { House, Map } from "@tamagui/lucide-icons";

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const pathName = usePathname();

  useEffect(() => {
    console.log(pathName);
  }, [pathName]);

  return (
    <DrawerContentScrollView {...props}>
      <View alignItems="center" justifyContent="center">
        <Label
          style={{
            fontWeight: "bold",
            color: "white",
            paddingBottom: 20,
            paddingTop: 50,
            textAlign: "end",
          }}
        >
          Central Park Jakarta
        </Label>
      </View>
      <DrawerItem
        label={"Home"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathName == "/" ? "#9BA88D" : "#fff" },
        ]}
        icon={({ color, size }) => (
          <House size={24} color={pathName == "/" ? "#9BA88D" : "#fff"} />
        )}
        style={{ backgroundColor: pathName == "/" ? "#F7F5E6" : "#A7C4A0" }}
        onPress={() => {
          router.push("/(drawer)/(tabs)");
        }}
      />
      <DrawerItem
        label={"Activity Planner"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathName == "/activityPlanner" ? "#9BA88D" : "#fff" },
        ]}
        icon={({ color, size }) => (
          <Map
            size={24}
            color={pathName == "/activityPlanner" ? "#9BA88D" : "#fff"}
          />
        )}
        style={{
          backgroundColor:
            pathName == "/activityPlanner" ? "#F7F5E6" : "#A7C4A0",
        }}
        onPress={() => {
          router.push("/(drawer)/(tabs)/activityPlanner");
        }}
      />
      <DrawerItem
        label={"Mall Map"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathName == "/maps" ? "#9BA88D" : "#fff" },
        ]}
        icon={({ color, size }) => (
          <Map size={24} color={pathName == "/maps" ? "#9BA88D" : "#fff"} />
        )}
        style={{ backgroundColor: pathName == "/maps" ? "#F7F5E6" : "#A7C4A0" }}
        onPress={() => {
          router.push("/(drawer)/(tabs)/maps");
        }}
      />
      <DrawerItem
        label={"Mall Directory"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathName == "/mallDirectory" ? "#9BA88D" : "#fff" },
        ]}
        icon={({ color, size }) => (
          <Map
            size={24}
            color={pathName == "/mallDirectory" ? "#9BA88D" : "#fff"}
          />
        )}
        style={{
          backgroundColor: pathName == "/mallDirectory" ? "#F7F5E6" : "#A7C4A0",
        }}
        onPress={() => {
          router.push("/(drawer)/(tabs)/mallDirectory");
        }}
      />
      <DrawerItem
        label={"Promotions"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathName == "/promotion" ? "#9BA88D" : "#fff" },
        ]}
        icon={({ color, size }) => (
          <Map
            size={24}
            color={pathName == "/promotion" ? "#9BA88D" : "#fff"}
          />
        )}
        style={{
          backgroundColor: pathName == "/promotion" ? "#F7F5E6" : "#A7C4A0",
        }}
        onPress={() => {
          router.push("/(drawer)/(tabs)/promotion");
        }}
      />
    </DrawerContentScrollView>
  );
};

export default function Layout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: "#A7C4A0",
        },
      }}
    />
  );
}

const styles = StyleSheet.create({
  navItemLabel: { fontSize: 14 },
});
