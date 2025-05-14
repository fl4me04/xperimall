import React, { useEffect, useState } from "react";
import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { router, usePathname } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { StyleSheet } from "react-native";
import { Image, Label, SizableText, View, XStack, YStack } from "tamagui";
import {
  Activity,
  BadgePercent,
  Disc,
  House,
  Map,
  Route,
  User,
} from "@tamagui/lucide-icons";

interface UserData {
  name: string;
  email: string;
}

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const pathName = usePathname();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();

    const checkUserData = async () => {
      const storedUserData = await AsyncStorage.getItem("userData");
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
      } else {
        setUserData(null);
      }
    };

    const interval = setInterval(checkUserData, 1000);

    return () => clearInterval(interval);
  }, []);

  const loadUserData = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem("userData");
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("userData");
      setUserData(null);
      router.push("/(drawer)/(tabs)/authentication/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <View
        alignItems="center"
        justifyContent="center"
        paddingBottom={20}
        paddingTop={20}
      >
        <YStack>
          <Image
            source={require("../../assets/images/360Club.jpg")}
            width={100}
            height={100}
            alt="Logo"
            borderRadius={50}
          />
        </YStack>
        <SizableText paddingTop={3} fontWeight={"bold"} color={"white"}>
          {userData ? userData.name : "Guest"}
        </SizableText>
        <SizableText marginTop={-5} fontSize={12} color={"white"}>
          {userData ? `Email: ${userData.email}` : "Please login"}
        </SizableText>
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
      {!userData && (
        <DrawerItem
          label={"Login"}
          labelStyle={[
            styles.navItemLabel,
            {
              color: pathName == "/authentication/login" ? "#9BA88D" : "#fff",
            },
          ]}
          icon={({ color, size }) => (
            <User
              size={24}
              color={pathName == "/authentication/login" ? "#9BA88D" : "#fff"}
            />
          )}
          style={{
            backgroundColor:
              pathName == "/authentication/login" ? "#F7F5E6" : "#A7C4A0",
          }}
          onPress={() => {
            router.push("/(drawer)/(tabs)/authentication/login");
          }}
        />
      )}
      {userData && (
        <>
          <DrawerItem
            label={"Activity Planner"}
            labelStyle={[
              styles.navItemLabel,
              { color: pathName == "/budget" ? "#9BA88D" : "#fff" },
            ]}
            icon={({ color, size }) => (
              <Activity
                size={24}
                color={pathName == "/budget" ? "#9BA88D" : "#fff"}
              />
            )}
            style={{
              backgroundColor: pathName == "/budget" ? "#F7F5E6" : "#A7C4A0",
            }}
            onPress={() => {
              router.push("/(drawer)/(tabs)/budget");
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
            style={{
              backgroundColor: pathName == "/maps" ? "#F7F5E6" : "#A7C4A0",
            }}
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
              <Route
                size={24}
                color={pathName == "/mallDirectory" ? "#9BA88D" : "#fff"}
              />
            )}
            style={{
              backgroundColor:
                pathName == "/mallDirectory" ? "#F7F5E6" : "#A7C4A0",
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
              <BadgePercent
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
          <DrawerItem
            label={"Logout"}
            labelStyle={[styles.navItemLabel, { color: "#fff" }]}
            icon={({ color, size }) => <User size={24} color="#fff" />}
            style={{ backgroundColor: "#A7C4A0" }}
            onPress={handleLogout}
          />
        </>
      )}
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
