import { Navbar } from "@/components/Navbar";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, ScrollView, YStack } from "tamagui";

export default function mallDirectory() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, backgroundColor: "#fff" }}
      >
        <Navbar />
        <YStack backgroundColor={"cyan"} width={"auto"} height={"auto"}>
          <Button width={10} height={20} padding={10} />
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
