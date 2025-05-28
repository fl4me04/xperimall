import { Navbar } from "@/components/Navbar";
import { ArrowLeft } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import React from "react";
import { Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  Image,
  ScrollView,
  SizableText,
  XStack,
  YStack,
} from "tamagui";

const { width, height } = Dimensions.get("window");

export default function promodetails() {
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
          //   paddingBottom={width * 0.01}
        >
          <XStack
            alignItems="center"
            position="relative"
            justifyContent="center"
            height={width * 0.115}
            marginBottom={width * 0.01}
          >
            <Button
              circular
              size="$2"
              background="#2B4433"
              icon={<ArrowLeft size={20} color={"white"} />}
              onPress={() => router.push("/(drawer)/(tabs)")}
              style={{
                position: "absolute",
                left: 0,
                backgroundColor: "#2B4433",
                borderWidth: 0,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            />
          </XStack>
          <YStack
            justifyContent="center"
            alignItems="center"
            width={"100%"}
            marginTop={-20}
          >
            <SizableText
              style={{
                fontFamily: "Poppins",
                justifyContent: "center",
                alignItems: "center",
                color: "#2B4433",
                fontSize: 15,
              }}
            >
              Food & Beverages
            </SizableText>
            <XStack
              marginTop={8}
              width={"100%"}
              style={{
                fontFamily: "Poppins",
                backgroundColor: "#4A7C59",
                padding: 10,
                borderRadius: 15,
                borderWidth: 1.4,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <SizableText
                style={{ fontSize: 19, color: "#fff", fontWeight: "500" }}
              >
                MAISON FEERIE Disc. Up to 50% OFF
              </SizableText>
            </XStack>
            <XStack width={"100%"} height={height * 0.5} marginTop={15}>
              <Image
                source={require("../../../assets/images/Maison.jpg")}
                resizeMode="contain"
                style={{ width: "100%", height: "100%" }}
              />
            </XStack>
          </YStack>
          <YStack justifyContent="center" alignItems="center" space={20} marginTop={10}>
            <SizableText
              style={{
                color: "#2B4433",
                textAlign: "center",
                fontFamily: "Poppins",
                fontSize: 14,
              }}
            >
              Your weekday just got way cooler with Maison Feerie! Enjoy 50% OFF
              refreshing for all beverages & soft gelato.
            </SizableText>
            <SizableText
              style={{
                color: "#2B4433",
                textAlign: "center",
                fontFamily: "Poppins",
                fontSize: 14,
              }}
            >
              Tnc apply, swipe for the details or visit @maisonfeerie's account
            </SizableText>
          </YStack>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
