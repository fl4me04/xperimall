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

const { width } = Dimensions.get("window");

export default function promotion() {
  const buttonImages = {
    button1: require("../../../assets/images/Maison.jpg"),
    button2: require("../../../assets/images/GongXi.jpg"),
    button3: require("../../../assets/images/Gyudon.jpg"),
    button4: require("../../../assets/images/Macarons.jpg"),
    button5: require("../../../assets/images/Sensatia.jpeg"),
    button6: require("../../../assets/images/Victoria.jpg"),
    button7: require("../../../assets/images/PullBear.jpg"),
    button8: require("../../../assets/images/Stadivarius.jpg"),
  };

  const sections = [
    {
      title: "Food & Beverages",
      items: [1, 2, 3, 4],
    },
    {
      title: "Beauty & Wellness",
      items: [5, 6],
    },
    {
      title: "Fashion",
      items: [7, 8],
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Navbar />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: "#fff",
          paddingTop: 80,
        }}
      >
        <YStack
          padding={width * 0.07}
          space={width * 0.05}
          paddingBottom={width * 0.03}
        >
          <XStack
            alignItems="center"
            justifyContent="center"
            height={width * 0.115}
            position="relative"
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

          {sections.map((section, index) => (
            <YStack
              key={index}
              space={width * 0.04}
              alignItems="center"
              marginBottom={index === sections.length - 1 ? 0 : 30}
            >
              <XStack
                width={width * 0.5}
                style={{
                  backgroundColor: "#4A7C59",
                  padding: 8,
                  borderRadius: 20,
                  borderWidth: 1.4,
                  justifyContent: "center",
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <SizableText
                  style={{
                    fontSize: 16,
                    color: "#fff",
                    fontWeight: "600",
                    fontFamily: "Inter",
                    letterSpacing: 0.5,
                  }}
                >
                  {section.title}
                </SizableText>
              </XStack>

              {Array.from({ length: Math.ceil(section.items.length / 2) }).map(
                (_, rowIdx) => {
                  const startIdx = rowIdx * 2;
                  const pair = section.items.slice(startIdx, startIdx + 2);
                  return (
                    <XStack
                      key={rowIdx}
                      space={width * 0.04}
                      justifyContent="center"
                      marginTop={rowIdx > 0 ? width * 0.04 : 0}
                    >
                      {pair.map((itemId) => (
                        <YStack
                          key={itemId}
                          width={width * 0.4}
                          borderRadius={16}
                          overflow="hidden"
                          backgroundColor="#fff"
                          elevation={4}
                          style={{
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.15,
                            shadowRadius: 6,
                          }}
                        >
                          <Button
                            onPress={() =>
                              router.push({
                                pathname: "/(drawer)/(tabs)/promodetails",
                                params: { id: itemId },
                              })
                            }
                            padding="$0"
                            backgroundColor="transparent"
                            style={{
                              width: "100%",
                              height: width * 0.5,
                            }}
                            animation="bouncy"
                            scale={0.95}
                            hoverStyle={{ scale: 0.98 }}
                            pressStyle={{ scale: 0.92 }}
                          >
                            <Image
                              resizeMode="cover"
                              source={buttonImages[`button${itemId}` as keyof typeof buttonImages]}
                              style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: 16,
                              }}
                            />
                          </Button>
                        </YStack>
                      ))}
                    </XStack>
                  );
                }
              )}
            </YStack>
          ))}
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
