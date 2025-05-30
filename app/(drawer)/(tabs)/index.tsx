import { Dimensions, Image, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  Input,
  ScrollView,
  SizableText,
  XStack,
  YStack,
} from "tamagui";
import { Filter, Search } from "@tamagui/lucide-icons";
import Slider from "@/components/Slider";
import { Navbar } from "@/components/Navbar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

interface UserData {
  name: string;
  email: string;
}

const { width, height } = Dimensions.get("window");

export default function HomeScreen() {
  const [userData, setUserData] = useState<UserData | null>(null);

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
    }
  };

  const buttonTap = () => {
    console.log("Button tapped");
  };

  const [searchText, setSearchText] = useState("");

  const buttonImages = {
    button1: require("../../../assets/images/NowOpen1.jpg"),
    button2: require("../../../assets/images/NowOpen2.jpg"),
    button3: require("../../../assets/images/NowOpen3.jpg"),
    button4: require("../../../assets/images/NowOpen4.jpg"),
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Navbar />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: "#fff",
          paddingTop: 100,
        }}
      >
        <YStack
          width={"auto"}
          height={"auto"}
          padding={width * 0.07}
          space={width * 0.03}
          paddingBottom={width * 0.02}
        >
          <SizableText
            width={width * 0.9}
            style={{
              fontSize: Math.min(23, width * 0.055),
              lineHeight: Math.min(23, width * 0.055) * 1.3,
              color: "#2B4433",
              fontFamily: "Poppins",
              flexWrap: "wrap",
              flexShrink: 1,
              textAlign: "left",
            }}
          >
            Hello, {userData ? userData.name : "Guest"}!
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
            <Search color="gray" size={"$1"} marginLeft={10} />
            <Input
              flex={1}
              width={"100%"}
              placeholder="Search for anything in Central Park"
              value={searchText}
              onChangeText={setSearchText}
              borderWidth={0}
              backgroundColor="transparent"
              fontFamily={"Poppins"}
            />
            <Button
              icon={Filter}
              color={"#fff"}
              size="$3"
              backgroundColor={"#4A7C59"}
              animation="bouncy"
              elevation="$4"
              pressStyle={{
                scale: 0.95,
              }}
              onPress={buttonTap}
            />
          </XStack>
        </YStack>
        <YStack paddingTop={10}>
          <Slider />
        </YStack>
        <YStack
          justifyContent="center"
          alignItems="center"
          space={width * 0.03}
          padding={width * 0.05}
        >
          <SizableText
            width={width * 0.9}
            alignSelf="center"
            style={{
              fontSize: Math.min(23, width * 0.055),
              lineHeight: Math.min(23, width * 0.055) * 1.3,
              color: "#2B4433",
              fontFamily: "Poppins",
              flexWrap: "wrap",
              flexShrink: 1,
              textAlign: "center",
            }}
          >
            What's New on Central Park
          </SizableText>
          <XStack space={width * 0.03}>
            <Button
              width={width * 0.4}
              height={width * 0.4}
              onPress={() => router.push({
                pathname: "/(drawer)/(tabs)/newtenant",
                params: { id: 1 }
              })}
              borderRadius={width * 0.02}
              padding="$0"
              backgroundColor="transparent"
              overflow="hidden"
            >
              <Image
                resizeMode="contain"
                source={buttonImages["button1"]}
                style={{ width: "100%", height: "100%" }}
              />
            </Button>
            <Button
              width={width * 0.4}
              height={width * 0.4}
              onPress={() => router.push({
                pathname: "/(drawer)/(tabs)/newtenant",
                params: { id: 2 }
              })}
              borderRadius={width * 0.02}
              padding="$0"
              backgroundColor="transparent"
              overflow="hidden"
            >
              <Image
                resizeMode="contain"
                source={buttonImages["button2"]}
                style={{ width: "100%", height: "100%" }}
              />
            </Button>
          </XStack>
          <XStack space={width * 0.03}>
            <Button
              width={width * 0.4}
              height={width * 0.4}
              onPress={() => router.push({
                pathname: "/(drawer)/(tabs)/newtenant",
                params: { id: 3 }
              })}
              borderRadius={width * 0.02}
              padding="$0"
              backgroundColor="transparent"
              overflow="hidden"
            >
              <Image
                resizeMode="contain"
                source={buttonImages["button3"]}
                style={{ width: "100%", height: "100%" }}
              />
            </Button>
            <Button
              width={width * 0.4}
              height={width * 0.4}
              onPress={() => router.push({
                pathname: "/(drawer)/(tabs)/newtenant",
                params: { id: 4 }
              })}
              borderRadius={width * 0.02}
              padding="$0"
              backgroundColor="transparent"
              overflow="hidden"
            >
              <Image
                resizeMode="contain"
                source={buttonImages["button4"]}
                style={{ width: "100%", height: "100%" }}
              />
            </Button>
          </XStack>
        </YStack>
        <YStack
          justifyContent="center"
          alignItems="center"
          space={width * 0.03}
          padding={width * 0.05}
        >
          <SizableText
            width={width * 0.9}
            alignSelf="center"
            style={{
              fontSize: Math.min(23, width * 0.055),
              lineHeight: Math.min(23, width * 0.055) * 1.3,
              color: "#2B4433",
              fontFamily: "Poppins",
              flexWrap: "wrap",
              flexShrink: 1,
              textAlign: "center",
            }}
          >
            Directory
          </SizableText>
          <XStack space={width * 0.03}>
            <Button
              height={height * 0.06}
              width={width * 0.4}
              backgroundColor={"#4A7C59"}
              borderRadius={"$10"}
              onPress={() => router.push({
                pathname: "/(drawer)/(tabs)/mallDirectory",
                params: { floorId: 1 }
              })}
            >
              <SizableText
                color="white"
                fontSize={"$5"}
                style={{ fontFamily: "Poppins" }}
              >
                Lower Ground Floor
              </SizableText>
            </Button>
            <Button
              height={height * 0.06}
              width={width * 0.4}
              backgroundColor={"#4A7C59"}
              borderRadius={"$10"}
              onPress={() => router.push({
                pathname: "/(drawer)/(tabs)/mallDirectory",
                params: { floorId: 2 }
              })}
            >
              <SizableText
                color="white"
                fontSize={"$5"}
                style={{ fontFamily: "Poppins" }}
              >
                Lower Ground Mezzanine
              </SizableText>
            </Button>
          </XStack>
          <XStack space={width * 0.03}>
            <Button
              height={height * 0.06}
              width={width * 0.4}
              backgroundColor={"#4A7C59"}
              borderRadius={"$10"}
              onPress={() => router.push({
                pathname: "/(drawer)/(tabs)/mallDirectory",
                params: { floorId: 3 }
              })}
            >
              <SizableText
                color="white"
                fontSize={"$5"}
                style={{ fontFamily: "Poppins" }}
              >
                Ground Floor
              </SizableText>
            </Button>
            <Button
              height={height * 0.06}
              width={width * 0.4}
              backgroundColor={"#4A7C59"}
              borderRadius={"$10"}
              onPress={() => router.push({
                pathname: "/(drawer)/(tabs)/mallDirectory",
                params: { floorId: 4 }
              })}
            >
              <SizableText
                color="white"
                fontSize={"$5"}
                style={{ fontFamily: "Poppins" }}
              >
                Upper Ground Floor
              </SizableText>
            </Button>
          </XStack>
          <XStack space={width * 0.03}>
            <Button
              height={height * 0.06}
              width={width * 0.4}
              backgroundColor={"#4A7C59"}
              borderRadius={"$10"}
              onPress={() => router.push({
                pathname: "/(drawer)/(tabs)/mallDirectory",
                params: { floorId: 5 }
              })}
            >
              <SizableText
                color="white"
                fontSize={"$5"}
                style={{ fontFamily: "Poppins" }}
              >
                1st Floor
              </SizableText>
            </Button>
            <Button
              height={height * 0.06}
              width={width * 0.4}
              backgroundColor={"#4A7C59"}
              borderRadius={"$10"}
              onPress={() => router.push({
                pathname: "/(drawer)/(tabs)/mallDirectory",
                params: { floorId: 6 }
              })}
            >
              <SizableText
                color="white"
                fontSize={"$5"}
                style={{ fontFamily: "Poppins" }}
              >
                2nd Floor
              </SizableText>
            </Button>
          </XStack>
          <XStack space={width * 0.03}>
            <Button
              height={height * 0.06}
              width={width * 0.4}
              backgroundColor={"#4A7C59"}
              borderRadius={"$10"}
              onPress={() => router.push({
                pathname: "/(drawer)/(tabs)/mallDirectory",
                params: { floorId: 7 }
              })}
            >
              <SizableText
                color="white"
                fontSize={"$5"}
                style={{ fontFamily: "Poppins" }}
              >
                3rd Floor
              </SizableText>
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