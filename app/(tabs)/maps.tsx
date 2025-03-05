import { Navbar } from "@/components/Navbar";
import { StyleSheet, SafeAreaView, ScrollView } from "react-native";

import { Button, YStack } from "tamagui";

export default function TabTwoScreen() {
  const buttonTap = () => {
    console.log("Button tapped");
  };

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Navbar />
        <YStack backgroundColor={"cyan"} width={"auto"} height={"auto"}>
          <Button width={10} height={20} padding={10} />
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
