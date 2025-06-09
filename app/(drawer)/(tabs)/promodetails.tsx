import { Navbar } from "@/components/Navbar";
import { ArrowLeft } from "@tamagui/lucide-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
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
import React from "react";

const { width, height } = Dimensions.get("window");

interface Promotion {
  id: number;
  title: string;
  description: string;
  category_id: number;
}

const promotionImages = {
  1: require("../../../assets/images/Maison.jpg"),
  2: require("../../../assets/images/GongXi.jpg"),
  3: require("../../../assets/images/Gyudon.jpg"),
  4: require("../../../assets/images/Macarons.jpg"),
  5: require("../../../assets/images/Sensatia.jpeg"),
  6: require("../../../assets/images/Victoria.jpg"),
  7: require("../../../assets/images/PullBear.jpg"),
  8: require("../../../assets/images/Stadivarius.jpg"),
};

const categoryNames = {
  1: "Beauty & Wellness",
  2: "Arcade",
  3: "Food & Beverages",
  4: "Fashion",
  5: "Coffee Shops",
  6: "Bakery",
  7: "Electronics",
  8: "Supermarket",
  9: "Bookstore",
  10: "Cinema",
};

export default function promodetails() {
  const { id } = useLocalSearchParams();
  const [promotion, setPromotion] = useState<Promotion | null>(null);

  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        const response = await fetch(
          `https://xperimall-backend.onrender.com/api/promotions/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch promotion");
        }
        const data = await response.json();
        setPromotion(data);
      } catch (error) {
        console.error("Error fetching promotion:", error);
      }
    };

    fetchPromotion();
  }, [id]);

  if (!promotion) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <Navbar />
        <YStack flex={1} justifyContent="center" alignItems="center">
          <SizableText>Loading...</SizableText>
        </YStack>
      </SafeAreaView>
    );
  }

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
              onPress={() => router.push("/(drawer)/(tabs)/promotion")}
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
            justifyContent="center"
            alignItems="center"
            width={"100%"}
            marginTop={-20}
          >
            <SizableText
              style={{
                fontFamily: "Inter",
                justifyContent: "center",
                alignItems: "center",
                color: "#2B4433",
                fontSize: 15,
              }}
            >
              {
                categoryNames[
                  promotion.category_id as keyof typeof categoryNames
                ]
              }
            </SizableText>
            <XStack
              marginTop={8}
              width={"100%"}
              style={{
                fontFamily: "Inter",
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
                {promotion.title}
              </SizableText>
            </XStack>
            <XStack width={"100%"} height={height * 0.5} marginTop={15}>
              <Image
                source={
                  promotionImages[promotion.id as keyof typeof promotionImages]
                }
                resizeMode="contain"
                style={{ width: "100%", height: "100%" }}
              />
            </XStack>
          </YStack>
          <YStack
            justifyContent="center"
            alignItems="center"
            space={20}
            marginTop={10}
          >
            <SizableText
              style={{
                color: "#2B4433",
                textAlign: "center",
                fontFamily: "Inter",
                fontSize: 14,
              }}
            >
              {promotion.description}
            </SizableText>
          </YStack>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
