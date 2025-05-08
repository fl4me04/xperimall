import { Tabs, usePathname } from "expo-router";
import React, { useEffect } from "react";
import { Platform } from "react-native";

import {
  BadgePercent,
  CircleDollarSign,
  History,
  Home,
  Map,
  Store,
} from "@tamagui/lucide-icons";
import { View } from "tamagui";

export default function TabLayout() {
  const pathName = usePathname();

  useEffect(() => {
    console.log(pathName);
  }, [pathName]);

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#A7C4A0",
          borderTopWidth: 0,
          padding: 0,
          height: 60,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#F3EAC2",
        tabBarInactiveTintColor: "#fff",
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="maps"
        options={{
          title: "Maps",
          tabBarIcon: ({ color }) => <Map size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="store"
        options={{
          title: "Stores",
          tabBarIcon: ({ color }) => <Store size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="budget"
        options={{
          title: "Budget",
          tabBarIcon: ({ color }) => (
            <View
              style={{
                width: 67,
                height: 67,
                borderRadius: 33,
                backgroundColor: "#9BA88D",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircleDollarSign size={35} color={pathName == "/budget" ? "#F3EAC2" : "#fff"} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="promotion"
        options={{
          title: "Promo",
          tabBarIcon: ({ color }) => <BadgePercent size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => <History size={26} color={color} />,
        }}
      />

      <Tabs.Screen
        name="authentication/login"
        options={{ href: null }} // 👈 Menyembunyikan dari tab bar
      />
      <Tabs.Screen
        name="authentication/register"
        options={{ href: null }} // 👈 Menyembunyikan dari tab bar
      />
      <Tabs.Screen
        name="index"
        options={{ href: null }} // 👈 Menyembunyikan dari tab bar
      />
      <Tabs.Screen
        name="mallDirectory"
        options={{ href: null }} // 👈 Menyembunyikan dari tab bar
      />
      <Tabs.Screen
        name="activityPlanner"
        options={{ href: null }} // 👈 Menyembunyikan dari tab bar
      />
      <Tabs.Screen
        name="newTenant"
        options={{href: null}} // 👈 Menyembunyikan dari tab bar
      />
    </Tabs>
  );
}
