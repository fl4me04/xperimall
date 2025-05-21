import { Navbar } from "@/components/Navbar";
import { ArrowLeft } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import React from "react";
import { Dimensions, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, ScrollView, SizableText, XStack, YStack } from "tamagui";

const { width, height } = Dimensions.get("window");

export default function history() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, backgroundColor: "#fff" }}
      >
        <Navbar />
        <YStack
          width={"auto"}
          height={"auto"}
          padding={width * 0.07}
          space={width * 0.03}
          paddingBottom={width * 0.01}
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
              background="#4A7C59"
              icon={<ArrowLeft size={20} color={"white"} />}
              onPress={() => router.push("/(drawer)/(tabs)")}
              style={{
                position: "absolute",
                left: 0,
                backgroundColor: "#4A7C59",
                borderWidth: 0,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            />
            <SizableText
              style={{
                fontFamily: "Poppins",
                fontWeight: "700",
                fontSize: 28,
                color: "#000",
                letterSpacing: 1,
                alignSelf: "center",
              }}
            >
              History
            </SizableText>
          </XStack>
          <YStack
            alignItems="center"
            justifyContent="center"
            space={width * 0.02}
          >
            <Pressable
              onPress={() => router.push("/(drawer)/(tabs)/historyTracker")}
              style={{ width: "100%" }}
            >
              <XStack
                style={{
                  borderRadius: 12,
                  backgroundColor: "#F7F5E6",
                  width: "95%",
                  marginBottom: width * 0.015,
                  marginVertical: 6,
                  padding: width * 0.027,
                  borderWidth: 1,
                  borderColor: "#000",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.08,
                  shadowRadius: 4,
                }}
              >
                <YStack space={width * 0.02} padding={width * 0.01}>
                  <SizableText
                    style={{
                      fontSize: 18,
                      color: "#4D4D4D",
                      fontFamily: "Poppins",
                    }}
                  >
                    Saturday, 23 February 2025
                  </SizableText>
                  <SizableText
                    style={{
                      fontSize: 22,
                      color: "#4A7C59",
                      fontFamily: "Poppins",
                      fontWeight: "600",
                    }}
                  >
                    Rp. 459.000
                  </SizableText>
                </YStack>
              </XStack>
            </Pressable>
          </YStack>
          <YStack alignItems="center" justifyContent="center">
            <XStack space={width * 0.03}>
              <Button
                width={width * 0.23}
                height={height * 0.06}
                backgroundColor={"#4A7C59"}
                color={"#fff"}
                borderRadius={width * 0.04}
                onPress={() => router.push("/(drawer)/(tabs)/financeTracker")}
              >
                Add
              </Button>
              <Button
                width={width * 0.23}
                height={height * 0.06}
                backgroundColor={"#C47A7B"}
                color={"#fff"}
                borderRadius={width * 0.04}
              >
                Delete
              </Button>
            </XStack>
          </YStack>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
