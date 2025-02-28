import { Image, StyleSheet, Platform } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  Button,
  Input,
  ScrollView,
  SizableStack,
  SizableText,
  SizeTokens,
  View,
  XStack,
  YStack,
} from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";
import { Filter, Menu, Scroll, Search, User2 } from "@tamagui/lucide-icons";
import { useState } from "react";

export default function HomeScreen() {
  const buttonTap = () => {
    console.log("Button tapped");
  };

  const [searchText, setSearchText] = useState("");

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
        <YStack
          width={"auto"}
          height={"auto"}
          padding={28}
          space={5}
          paddingBottom={2}
        >
          <SizableText
            width={"auto"}
            height={"auto"}
            style={{ fontWeight: "bold", fontSize: 20, color: "#9BA88D" }}
          >
            Good Afternoon, Guest!
          </SizableText>
          <XStack
            alignItems="center"
            padding="$2"
            borderRadius="$4"
            borderWidth={1}
            borderColor="$borderColor"
            space={5}
            backgroundColor={"#F7F5E6"}
          >
            <Search color="gray" size={"$1"} />
            <Input
              flex={1}
              size="$3"
              placeholder="Search for anything in Central Park"
              value={searchText}
              onChangeText={setSearchText}
              borderWidth={0}
              background="transparent"
            />
            <Button
              icon={Filter}
              size="$3"
              backgroundColor={"#A7C4A0"}
              animation="bouncy"
              elevation="$4"
              // hoverStyle={{
              //   scale: 1.2,
              // }}
              pressStyle={{
                scale: 0.95,
              }}
              onPress={buttonTap}
            />
          </XStack>
        </YStack>
        <YStack
          alignItems="center"
          justifyContent="center"
          width={"100%"}
          height={250}
          // backgroundColor={"cyan"}
        >
          <Image
            source={{
              uri: "https://picsum.photos/300/200",
              width: 300,
              height: 200,
            }}
          />
        </YStack>
        <YStack
          // backgroundColor={"cyan"}
          justifyContent="center"
          alignItems="center"
          space={5}
          padding={10}
        >
          <SizableText
            width={"auto"}
            height={"auto"}
            alignSelf="center"
            justifyContent="center"
            style={{ fontWeight: "500", fontSize: 20, color: "#9BA88D" }}
          >
            What's New on Central Park
          </SizableText>
          <XStack space={4}>
            <Button
              width={178}
              height={178}
              onPress={buttonTap}
              borderRadius="$6"
              padding="$0"
              backgroundColor="transparent"
              overflow="hidden"
            >
              <Image
                resizeMode="contain"
                blurRadius={2}
                source={{
                  uri: "https://picsum.photos/178/178",
                  width: 178,
                  height: 178,
                }}
              />
            </Button>
            <Button
              width={178}
              height={178}
              onPress={buttonTap}
              borderRadius="$6"
              padding="$0"
              backgroundColor="transparent"
              overflow="hidden"
            >
              <Image
                resizeMode="contain"
                blurRadius={2}
                source={{
                  uri: "https://picsum.photos/178/178",
                  width: 178,
                  height: 178,
                }}
              />
            </Button>
          </XStack>
          <XStack space={5}>
            <Button
              width={178}
              height={178}
              onPress={buttonTap}
              borderRadius="$6"
              padding="$0"
              backgroundColor="transparent"
              overflow="hidden"
            >
              <Image
                resizeMode="contain"
                blurRadius={2}
                source={{
                  uri: "https://picsum.photos/178/178",
                  width: 178,
                  height: 178,
                }}
              />
            </Button>
            <Button
              width={178}
              height={178}
              onPress={buttonTap}
              borderRadius="$6"
              padding="$0"
              backgroundColor="transparent"
              overflow="hidden"
            >
              <Image
                resizeMode="contain"
                blurRadius={2}
                source={{
                  uri: "https://picsum.photos/178/178",
                  width: 178,
                  height: 178,
                }}
              />
            </Button>
          </XStack>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
