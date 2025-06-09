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
  Text,
  XStack,
  YStack,
  ZStack,
  SizableText,
} from "tamagui";

const { width } = Dimensions.get("window");

const promoCategories = [
  {
    name: "Food & Beverages",
    promos: [
      {
        id: 1,
        title: "Maison Sale",
        image: require("../../../assets/images/Maison.jpg"),
      },
      {
        id: 2,
        title: "GongXi Promo",
        image: require("../../../assets/images/GongXi.jpg"),
      },
      {
        id: 3,
        title: "Gyudon Madness",
        image: require("../../../assets/images/Gyudon.jpg"),
      },
      {
        id: 4,
        title: "Macarons Treat",
        image: require("../../../assets/images/Macarons.jpg"),
      },
    ],
  },
  {
    name: "Beauty & Wellness",
    promos: [
      {
        id: 5,
        title: "Sensatia Glow",
        image: require("../../../assets/images/Sensatia.jpeg"),
      },
      {
        id: 6,
        title: "Victoria Secret",
        image: require("../../../assets/images/Victoria.jpg"),
      },
    ],
  },
  {
    name: "Fashion",
    promos: [
      {
        id: 7,
        title: "Pull & Bear Style",
        image: require("../../../assets/images/PullBear.jpg"),
      },
      {
        id: 8,
        title: "Stradivarius Look",
        image: require("../../../assets/images/Stadivarius.jpg"),
      },
    ],
  },
];

// Helper: chunk promos into rows of 2
const chunkArray = (array: any[], size: number) => {
  const chunked = [];
  for (let i = 0; i < array.length; i += size) {
    chunked.push(array.slice(i, i + size));
  }
  return chunked;
};

export default function promotion() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Navbar />
      <ScrollView contentContainerStyle={{ paddingTop: 80, paddingBottom: 30 }}>
        <YStack paddingHorizontal={width * 0.07} space={width * 0.05}>
          {/* Header */}
          <XStack alignItems="center" justifyContent="space-between">
            <Button
              circular
              size="$2"
              background="#2B4433"
              icon={<ArrowLeft size={20} color={"white"} />}
              onPress={() => router.push("/(drawer)/(tabs)")}
              style={{
                backgroundColor: "#2B4433",
                borderWidth: 0,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            />
            <SizableText style={{ fontSize: 22, fontWeight: "700", color: "#2B4433" }}>
              Promotions
            </SizableText>
            <XStack width={32} />
          </XStack>

          {/* Content */}
          {promoCategories.map((category, idx) => (
            <YStack key={idx} space={width * 0.03} marginTop={30} alignItems="center">
              {/* Category Title */}
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: "#4A7C59",
                  marginBottom: 10,
                  textAlign: "center",
                }}
              >
                {category.name}
              </Text>

              {/* Cards in 2 per row */}
              {chunkArray(category.promos, 2).map((row, rowIdx) => (
                <XStack
                  key={rowIdx}
                  justifyContent="space-between"
                  width="100%"
                  marginBottom={width * 0.04}
                >
                  {row.map((promo) => (
                    <Button
                      key={promo.id}
                      width={(width * 0.85 - width * 0.04) / 2}
                      height={width * 0.5}
                      borderRadius={16}
                      padding={0}
                      backgroundColor="transparent"
                      onPress={() =>
                        router.push({
                          pathname: "/(drawer)/(tabs)/promodetails",
                          params: { id: promo.id },
                        })
                      }
                      style={{
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                      }}
                    >
                      <ZStack width="100%" height="100%" borderRadius={16} overflow="hidden">
                        <Image
                          source={promo.image}
                          resizeMode="cover"
                          style={{ width: "100%", height: "100%" }}
                        />
                        <YStack
                          position="absolute"
                          bottom={0}
                          width="100%"
                          paddingVertical={8}
                          paddingHorizontal={12}
                          backgroundColor="rgba(0,0,0,0.4)"
                        >
                          <Text color="#fff" fontWeight="600" fontSize={14}>
                            {promo.title}
                          </Text>
                        </YStack>
                      </ZStack>
                    </Button>
                  ))}
                  {row.length === 1 && (
                    <XStack width={(width * 0.85 - width * 0.04) / 2} />
                  )}
                </XStack>
              ))}
            </YStack>
          ))}
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
