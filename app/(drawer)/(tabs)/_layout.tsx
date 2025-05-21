import { Tabs, usePathname } from "expo-router";
import React, { useEffect } from "react";
import { Platform, Dimensions } from "react-native";

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
  const { width, height } = Dimensions.get("window");

  useEffect(() => {
    console.log(pathName);
  }, [pathName]);

  const isSmallScreen = width < 360;

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#4A7C59",
          borderTopWidth: 0,
          padding: 0,
          height: isSmallScreen ? 50 : 60,
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
          tabBarIcon: ({ color }) => (
            <Map size={isSmallScreen ? 20 : 26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="store"
        options={{
          title: "Stores",
          tabBarIcon: ({ color }) => (
            <Store size={isSmallScreen ? 20 : 26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="budget"
        options={{
          title: "Budget",
          tabBarIcon: ({ color }) => (
            <View
              style={{
                width: isSmallScreen ? 50 : 67,
                height: isSmallScreen ? 50 : 67,
                borderRadius: isSmallScreen ? 25 : 33,
                backgroundColor: "#9BA88D",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircleDollarSign
                size={isSmallScreen ? 25 : 35}
                color={pathName == "/budget" ? "#F3EAC2" : "#fff"}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="promotion"
        options={{
          title: "Promo",
          tabBarIcon: ({ color }) => (
            <BadgePercent size={isSmallScreen ? 20 : 26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => (
            <History size={isSmallScreen ? 20 : 26} color={color} />
          ),
        }}
      />

      <Tabs.Screen name="authentication/login" options={{ href: null }} />
      <Tabs.Screen name="authentication/register" options={{ href: null }} />
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="mallDirectory" options={{ href: null }} />
      <Tabs.Screen name="activityPlanner" options={{ href: null }} />
      <Tabs.Screen name="financeTracker" options={{ href: null }} />
      <Tabs.Screen name="historyTracker" options={{ href: null }} />
    </Tabs>
  );
}
