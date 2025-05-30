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
                zIndex: 10,
                pointerEvents: "auto",
              }}
            />
          </XStack>
          <YStack
            space={width * 0.03}
            alignItems="center"
            marginBottom={20}
            marginTop={-20}
          >
            <XStack
              width={width * 0.5}
              style={{
                backgroundColor: "#4A7C59",
                padding: 7,
                borderRadius: 20,
                borderWidth: 1.4,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <SizableText
                style={{ fontSize: 20, color: "#fff", fontWeight: "500" }}
              >
                Food & Beverages
              </SizableText>
            </XStack>
            <XStack space={width * 0.03} justifyContent="center">
              <Button
                width={width * 0.4}
                height={width * 0.5}
                onPress={() =>
                  router.push({
                    pathname: "/(drawer)/(tabs)/promodetails",
                    params: { id: 1 },
                  })
                }
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
                height={width * 0.5}
                onPress={() =>
                  router.push({
                    pathname: "/(drawer)/(tabs)/promodetails",
                    params: { id: 2 },
                  })
                }
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
            <XStack space={width * 0.03} justifyContent="center">
              <Button
                width={width * 0.4}
                height={width * 0.5}
                onPress={() =>
                  router.push({
                    pathname: "/(drawer)/(tabs)/promodetails",
                    params: { id: 3 },
                  })
                }
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
                height={width * 0.5}
                onPress={() =>
                  router.push({
                    pathname: "/(drawer)/(tabs)/promodetails",
                    params: { id: 4 },
                  })
                }
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
          <YStack space={width * 0.03} alignItems="center" marginBottom={20}>
            <XStack
              width={width * 0.5}
              style={{
                backgroundColor: "#4A7C59",
                padding: 7,
                borderRadius: 20,
                borderWidth: 1.4,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <SizableText
                style={{ fontSize: 20, color: "#fff", fontWeight: "500" }}
              >
                Beauty & Wellness
              </SizableText>
            </XStack>
            <XStack space={width * 0.03} justifyContent="center">
              <Button
                width={width * 0.4}
                height={width * 0.5}
                onPress={() =>
                  router.push({
                    pathname: "/(drawer)/(tabs)/promodetails",
                    params: { id: 5 },
                  })
                }
                borderRadius={width * 0.02}
                padding="$0"
                backgroundColor="transparent"
                overflow="hidden"
              >
                <Image
                  resizeMode="contain"
                  source={buttonImages["button5"]}
                  style={{ width: "100%", height: "100%" }}
                />
              </Button>
              <Button
                width={width * 0.4}
                height={width * 0.5}
                onPress={() =>
                  router.push({
                    pathname: "/(drawer)/(tabs)/promodetails",
                    params: { id: 6 },
                  })
                }
                borderRadius={width * 0.02}
                padding="$0"
                backgroundColor="transparent"
                overflow="hidden"
              >
                <Image
                  resizeMode="stretch"
                  source={buttonImages["button6"]}
                  style={{ width: "100%", height: "100%" }}
                />
              </Button>
            </XStack>
          </YStack>
          <YStack space={width * 0.03} alignItems="center" marginBottom={20}>
            <XStack
              width={width * 0.5}
              style={{
                backgroundColor: "#4A7C59",
                padding: 7,
                borderRadius: 20,
                borderWidth: 1.4,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <SizableText
                style={{ fontSize: 20, color: "#fff", fontWeight: "500" }}
              >
                Fashion
              </SizableText>
            </XStack>
            <XStack space={width * 0.03} justifyContent="center">
              <Button
                width={width * 0.4}
                height={width * 0.5}
                onPress={() =>
                  router.push({
                    pathname: "/(drawer)/(tabs)/promodetails",
                    params: { id: 7 },
                  })
                }
                borderRadius={width * 0.02}
                padding="$0"
                backgroundColor="transparent"
                overflow="hidden"
              >
                <Image
                  resizeMode="contain"
                  source={buttonImages["button7"]}
                  style={{ width: "100%", height: "100%" }}
                />
              </Button>
              <Button
                width={width * 0.4}
                height={width * 0.5}
                onPress={() =>
                  router.push({
                    pathname: "/(drawer)/(tabs)/promodetails",
                    params: { id: 8 },
                  })
                }
                borderRadius={width * 0.02}
                padding="$0"
                backgroundColor="transparent"
                overflow="hidden"
              >
                <Image
                  resizeMode="stretch"
                  source={buttonImages["button8"]}
                  style={{ width: "100%", height: "100%" }}
                />
              </Button>
            </XStack>
          </YStack>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
