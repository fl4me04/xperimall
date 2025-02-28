import { StyleSheet, Image, Platform, SafeAreaView } from "react-native";

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import {
  Button,
  Input,
  Label,
  SizableText,
  Switch,
  View,
  XStack,
  YStack,
} from "tamagui";
import { Menu, Plus, User2 } from "@tamagui/lucide-icons";

export default function TabTwoScreen() {
  const buttonTap = () => {
    console.log("Button tapped");
  };

  return (
    <SafeAreaView>
      <XStack
        padding={10}
        backgroundColor={"#A7C4A0"}
        width={"100%"}
        height={100}
        justifyContent="space-between"
        alignItems="flex-end"
      >
        <Button
          animation="bouncy"
          elevation="$4"
          // hoverStyle={{
          //   scale: 1.2,
          // }}
          pressStyle={{
            scale: 0.95,
          }}
          onPress={buttonTap}
          width={"auto"}
          height={"auto"}
          icon={Menu}
          backgroundColor="transparent"
        />
        <SizableText style={{ justifyContent: "center" }}>
          CENTRAL PARK JAKARTA
        </SizableText>
        <Button
          animation="bouncy"
          elevation="$4"
          // hoverStyle={{
          //   scale: 1.2,
          // }}
          pressStyle={{
            scale: 0.95,
          }}
          onPress={buttonTap}
          width={"auto"}
          height={"auto"}
          icon={User2}
          backgroundColor="transparent"
        />
      </XStack>
      <YStack backgroundColor={"cyan"} width={"auto"} height={"auto"}>
        <Button width={10} height={20} padding={10}/>
      </YStack>
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
