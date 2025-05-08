import { Navbar } from "@/components/Navbar";
import { ArrowLeft } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  Input,
  ScrollView,
  SizableText,
  XStack,
  YStack,
  ZStack,
} from "tamagui";

const categories = [
  "Beauty & Wellness",
  "Arcade",
  "Dining",
  "Fashion",
  "Coffee Shops",
];

export default function activityPlanner() {
  const [inputAmount, setAmount] = useState("");

  const [selectedIndex, setSelectedIndex] = useState<number | null>(-1);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Navbar />
        <YStack width={"auto"} height={"auto"} padding={25}>
          <XStack
            alignItems="flex-start"
            position="relative"
            justifyContent="center"
            height={50}
          >
            <Button
              circular
              size="$2"
              background="#9BA88D"
              icon={<ArrowLeft size={20} color={"white"} />}
              onPress={() => router.push("/(drawer)/(tabs)")}
              style={{
                position: "absolute",
                left: 0,
              }}
            />
            <SizableText
              style={{ fontWeight: "500", fontSize: 32, color: "#9BA88D" }}
            >
              Your Activity Guide
            </SizableText>
          </XStack>
          <YStack
            alignItems="flex-start"
            space={5}
            paddingTop={10}
            paddingBottom={10}
          >
            <SizableText
              style={{
                color: "#000",
                fontWeight: "500",
                fontSize: 16,
              }}
            >
              1. Enter your Budget
            </SizableText>
            <Input
              flex={1}
              size="$3"
              width={"100%"}
              placeholder="Insert Amount (Rp.)"
              secureTextEntry
              value={inputAmount}
              onChangeText={setAmount}
              fontFamily="Poppins"
              backgroundColor="#F7F5E6"
              borderWidth={1}
              borderColor="black"
              borderRadius={8}
            />
          </YStack>
          <YStack
            alignItems="flex-start"
            space={5}
            paddingTop={10}
            paddingBottom={10}
          >
            <SizableText
              style={{ color: "#000", fontWeight: "500", fontSize: 16 }}
            >
              2. Add activity preferences
            </SizableText>
            <YStack
              // height={220}
              width={"100%"}
              backgroundColor="#F7F5E6"
              borderWidth={1}
              borderColor="black"
              borderRadius={8}
              alignItems="center"
              justifyContent="center"
              // space={5}
            >
              <ZStack
                width={"90%"}
                height={150}
                backgroundColor="#fff"
                borderWidth={1}
                borderColor="black"
                borderRadius={8}
                marginTop={18}
                marginLeft={18}
                marginRight={18}
                marginBottom={10}
              >
                <XStack flexWrap="wrap" gap="$2" margin={10}>
                  {categories.map((category, index) => (
                    <Button
                      key={category}
                      size={"$3"}
                      borderRadius={30}
                      backgroundColor={
                        selectedIndex === index ? "#fff" : "#9BA88D"
                      }
                      color={selectedIndex === index ? "#000" : "#fff"} // Adjust text color for better contrast
                      onPress={() => setSelectedIndex(index)} // Update selectedIndex to the clicked button's index
                      pressStyle={{
                        backgroundColor:
                          selectedIndex === index ? "#E8E8E8" : "#A5B89C", // Slightly lighter shade
                        transform: [{ scale: 0.95 }], // Add a scaling effect
                        shadowColor: "#000", // Add a subtle shadow
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 4,
                      }}
                    >
                      {category}
                    </Button>
                  ))}
                </XStack>
              </ZStack>
              <Button
                size={"$2"}
                marginBottom={10}
                width={120}
                height={40}
                alignSelf="center"
                backgroundColor="#9BA88D"
                borderRadius={17}
                justifyContent="center"
              >
                <SizableText style={{ fontFamily: "Poppins", color: "#fff" }}>
                  Generate
                </SizableText>
              </Button>
            </YStack>
          </YStack>
          <YStack
            alignItems="flex-start"
            space={5}
            paddingTop={10}
            paddingBottom={10}
          >
            <SizableText
              style={{ color: "#000", fontWeight: "500", fontSize: 16 }}
            >
              3. Your Recommendation
            </SizableText>
            <YStack
              width={"100%"}
              backgroundColor="#F7F5E6"
              borderWidth={1}
              borderColor="black"
              borderRadius={8}
              alignItems="center"
              justifyContent="center"
              // space={5}
            >
              <ZStack
                width={"90%"}
                height={240}
                backgroundColor="#fff"
                borderWidth={1}
                borderColor="black"
                borderRadius={8}
                margin={18}
              >
                {/* Ini ntar lu isi pake category */}
                <YStack
                  justifyContent="center"
                  alignItems="center"
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  bottom={0}
                  space={5}
                >
                  <SizableText
                    marginBottom={2}
                    style={{
                      fontFamily: "Poppins",
                      color: "#A7C4A0",
                      fontSize: 14,
                    }}
                  >
                    Restaurants
                  </SizableText>
                  <XStack
                    justifyContent="center"
                    alignItems="center"
                    style={{
                      borderRadius: 12,
                      backgroundColor: "#9BA88D",
                      width: "90%",
                    }}
                  >
                    <SizableText
                      style={{
                        fontFamily: "Poppins",
                        color: "#fff",
                        fontSize: 10,
                      }}
                    >
                      Remboelan - Rp 75.000 - 100.000
                    </SizableText>
                  </XStack>
                  <XStack
                    justifyContent="center"
                    alignItems="center"
                    style={{
                      borderRadius: 12,
                      backgroundColor: "#9BA88D",
                      width: "90%",
                    }}
                  >
                    <SizableText
                      style={{
                        fontFamily: "Poppins",
                        color: "#fff",
                        fontSize: 10,
                      }}
                    >
                      Bakmi GM - Rp 25.000 - 50.000
                    </SizableText>
                  </XStack>
                  <XStack
                    justifyContent="center"
                    alignItems="center"
                    style={{
                      borderRadius: 12,
                      backgroundColor: "#9BA88D",
                      width: "90%",
                    }}
                  >
                    <SizableText
                      style={{
                        fontFamily: "Poppins",
                        color: "#fff",
                        fontSize: 10,
                      }}
                    >
                      Solaria - Rp 30.000 - 60.000
                    </SizableText>
                  </XStack>
                  <XStack
                    justifyContent="center"
                    alignItems="center"
                    style={{
                      borderRadius: 12,
                      backgroundColor: "#9BA88D",
                      width: "90%",
                    }}
                  >
                    <SizableText
                      style={{
                        fontFamily: "Poppins",
                        color: "#fff",
                        fontSize: 10,
                      }}
                    >
                      Dapur Solo - Rp 40.000 - 70.000
                    </SizableText>
                  </XStack>
                  <XStack
                    justifyContent="center"
                    alignItems="center"
                    style={{
                      borderRadius: 12,
                      backgroundColor: "#9BA88D",
                      width: "90%",
                    }}
                  >
                    <SizableText
                      style={{
                        fontFamily: "Poppins",
                        color: "#fff",
                        fontSize: 10,
                      }}
                    >
                      Ikkudo Ichi - Rp 50.000 - 100.000
                    </SizableText>
                  </XStack>
                  <XStack
                    justifyContent="center"
                    alignItems="center"
                    style={{
                      borderRadius: 12,
                      backgroundColor: "#9BA88D",
                      width: "90%",
                    }}
                  >
                    <SizableText
                      style={{
                        fontFamily: "Poppins",
                        color: "#fff",
                        fontSize: 10,
                      }}
                    >
                      Sukiya - Rp 30.000 - 70.000
                    </SizableText>
                  </XStack>
                </YStack>
              </ZStack>
            </YStack>
          </YStack>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
