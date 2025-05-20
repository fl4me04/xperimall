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

interface UserData {
  name: string;
  email: string;
}

const { width, height } = Dimensions.get("window");

export default function HomeScreen() {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    loadUserData();

    // Add interval to check for user data changes
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
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Navbar />
        <YStack
          width={"auto"}
          height={"auto"}
          padding={width * 0.07}
          space={width * 0.03}
          paddingBottom={width * 0.02}
        >
          <SizableText
            width={"auto"}
            height={"auto"}
            style={{
              fontSize: width * 0.05,
              color: "#9BA88D",
              fontFamily: "Poppins",
            }}
          >
            Hello, {userData ? userData.name : "Guest"}!
          </SizableText>
          <XStack
            alignItems="center"
            padding={width * 0.0118}
            borderRadius={width * 0.02}
            borderWidth={1}
            borderColor="$borderColor"
            space={width * 0.01}
            backgroundColor={"#F7F5E6"}
          >
            <Search color="gray" size={width * 0.03} />
            <Input
              flex={1}
              size="$3"
              placeholder="Search for anything in Central Park"
              value={searchText}
              onChangeText={setSearchText}
              borderWidth={0}
              backgroundColor="transparent"
              fontFamily={"Poppins"}
              style={{ fontSize: width * 0.03 }}
            />
            <Button
              icon={Filter}
              size="$3"
              backgroundColor={"#A7C4A0"}
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
            width={"auto"}
            height={"auto"}
            alignSelf="center"
            justifyContent="center"
            style={{
              fontSize: width * 0.05,
              color: "#9BA88D",
              fontFamily: "Poppins",
            }}
          >
            What's New on Central Park
          </SizableText>
          <XStack space={width * 0.03}>
            <Button
              width={width * 0.4}
              height={width * 0.4}
              onPress={buttonTap}
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
              onPress={buttonTap}
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
              onPress={buttonTap}
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
              onPress={buttonTap}
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
            width={"auto"}
            height={"auto"}
            alignSelf="center"
            justifyContent="center"
            style={{
              fontSize: width * 0.05,
              color: "#9BA88D",
              fontFamily: "Poppins",
            }}
          >
            Directory
          </SizableText>
          <XStack space={width * 0.03}>
            <Button
              height={height * 0.06}
              width={width * 0.4}
              backgroundColor={"#A7C4A0"}
              borderRadius={"$10"}
            >
              <SizableText
                color="white"
                fontSize={width * 0.03}
                style={{ fontFamily: "Poppins" }}
              >
                Level B1
              </SizableText>
            </Button>
            <Button
              height={height * 0.06}
              width={width * 0.4}
              backgroundColor={"#A7C4A0"}
              borderRadius={"$10"}
            >
              <SizableText
                color="white"
                fontSize={width * 0.03}
                style={{ fontFamily: "Poppins" }}
              >
                Ground
              </SizableText>
            </Button>
          </XStack>
          <XStack space={width * 0.03}>
            <Button
              height={height * 0.06}
              width={width * 0.4}
              backgroundColor={"#A7C4A0"}
              borderRadius={"$10"}
            >
              <SizableText
                color="white"
                fontSize={width * 0.03}
                style={{ fontFamily: "Poppins" }}
              >
                Upperground
              </SizableText>
            </Button>
            <Button
              height={height * 0.06}
              width={width * 0.4}
              backgroundColor={"#A7C4A0"}
              borderRadius={"$10"}
            >
              <SizableText
                color="white"
                fontSize={width * 0.03}
                style={{ fontFamily: "Poppins" }}
              >
                Level 1
              </SizableText>
            </Button>
          </XStack>
          <XStack space={width * 0.03}>
            <Button
              height={height * 0.06}
              width={width * 0.4}
              backgroundColor={"#A7C4A0"}
              borderRadius={"$10"}
            >
              <SizableText
                color="white"
                fontSize={width * 0.03}
                style={{ fontFamily: "Poppins" }}
              >
                Level 2
              </SizableText>
            </Button>
            <Button
              height={height * 0.06}
              width={width * 0.4}
              backgroundColor={"#A7C4A0"}
              borderRadius={"$10"}
            >
              <SizableText
                color="white"
                fontSize={width * 0.03}
                style={{ fontFamily: "Poppins" }}
              >
                Level 3
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
