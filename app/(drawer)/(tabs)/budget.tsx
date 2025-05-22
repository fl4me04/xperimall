import { Navbar } from "@/components/Navbar";
import { ArrowLeft } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  Input,
  ScrollView,
  SizableText,
  XStack,
  YStack,
  ZStack,
  Spinner,
} from "tamagui";
import { Dimensions, ScrollView as RNScrollView } from "react-native";
import { useAuth } from "../../hooks/useAuth";

const API_URL = "http://localhost:8080/api";

const { width, height } = Dimensions.get("window");

interface Category {
  ID: number;
  Name: string;
}

export default function activityPlanner() {
  const [inputAmount, setAmount] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { token, isLoading: isAuthLoading } = useAuth();
  const formatCurrency = (value: string) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleAmountChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    setAmount(numericValue);
  };

  useEffect(() => {
    console.log("Fetching categories from:", `${API_URL}/categories`);
    fetch(`${API_URL}/categories`)
      .then((res) => {
        console.log("Categories response status:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("Categories data:", data);
        setCategories(data);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
      });
  }, []);

  const toggleCategory = (categoryId: number) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const fetchRecommendations = async () => {
    if (selectedCategories.length === 0) {
      alert("Please select at least one category!");
      return;
    }
    if (inputAmount === "") {
      alert("Please enter your budget amount!");
      return;
    }
    setLoading(true);
    setHasSearched(true);
    try {
      const requestBody = {
        category_ids: selectedCategories,
        budget: parseInt(inputAmount),
      };

      const res = await fetch(`${API_URL}/recommendations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error response:", errorData);
        throw new Error(
          `HTTP error! status: ${res.status}, message: ${JSON.stringify(
            errorData
          )}`
        );
      }

      const data = await res.json();
      console.log("Response data:", data);

      if (!Array.isArray(data)) {
        console.error("Invalid response format:", data);
        throw new Error("Invalid response format from server");
      }

      setRecommendations(data);
    } catch (err) {
      console.error("Error details:", err);
      alert("Failed to fetch recommendations. Please try again.");
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, backgroundColor: "#fff" }}
      >
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
              background="#4A7C59"
              icon={<ArrowLeft size={20} color={"white"} />}
              onPress={() => router.push("/(drawer)/(tabs)")}
              style={{
                position: "absolute",
                left: 0,
              }}
            />
            <SizableText
              style={{ fontWeight: "500", fontSize: 32, color: "#000" }}
            >
              Your Activity Guide
            </SizableText>
          </XStack>
          <YStack
            alignItems="flex-start"
            space={5}
            paddingTop={10}
            paddingBottom={10}
            width="100%"
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
              size="$3"
              width={"100%"}
              placeholder="Insert Amount (Rp.)"
              value={`Rp ${formatCurrency(inputAmount)}`}
              onChangeText={(value) =>
                handleAmountChange(value.replace(/^Rp\s?/, ""))
              }
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
              alignItems="center"
              justifyContent="center"
              width="100%"
              backgroundColor="#F7F5E6"
              borderWidth={1}
              borderColor="black"
              borderRadius={8}
              space={10}
            >
              <ZStack
                width="90%"
                backgroundColor="#fff"
                borderWidth={1}
                borderColor="black"
                borderRadius={8}
                marginTop={18}
                marginLeft={18}
                marginRight={18}
                alignItems="center"
                justifyContent="center"
                style={{
                  padding: 140,
                }}
              >
                <RNScrollView
                  style={{ width: "100%" }}
                  contentContainerStyle={{
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: 10,
                    padding: 10,
                  }}
                  showsVerticalScrollIndicator={false}
                >
                  <XStack
                    flexWrap="wrap"
                    gap="$2"
                    margin={10}
                    alignSelf="center"
                    justifyContent="center"
                    alignItems="center"
                  >
                    {categories.map((category) => (
                      <Button
                        key={category.ID}
                        size={"$4"}
                        borderRadius={30}
                        backgroundColor={
                          selectedCategories.includes(category.ID)
                            ? "#E8E8E8"
                            : "#4A7C59"
                        }
                        color={
                          selectedCategories.includes(category.ID)
                            ? "#000"
                            : "#fff"
                        }
                        onPress={() => toggleCategory(category.ID)}
                        pressStyle={{
                          backgroundColor: selectedCategories.includes(
                            category.ID
                          )
                            ? "#E8E8E8"
                            : "#A5B89C",
                          transform: [{ scale: 0.95 }],
                        }}
                        style={{
                          minWidth: 120,
                          paddingVertical: 10,
                          margin: 5,
                          fontWeight: "bold",
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.2,
                          shadowRadius: 4,
                        }}
                      >
                        {category.Name}
                      </Button>
                    ))}
                  </XStack>
                </RNScrollView>
              </ZStack>
              <Button
                size={"$2"}
                marginBottom={10}
                width={120}
                height={40}
                alignSelf="center"
                backgroundColor="#4A7C59"
                borderRadius={17}
                justifyContent="center"
                onPress={fetchRecommendations}
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
              width="100%"
              backgroundColor="#F7F5E6"
              borderWidth={1}
              borderColor="black"
              borderRadius={8}
              alignItems="center"
              justifyContent="center"
            >
              <ZStack
                width="90%"
                height={240}
                backgroundColor="#fff"
                borderWidth={1}
                borderColor="black"
                borderRadius={8}
                margin={18}
                alignItems="center"
                justifyContent="center"
                marginTop={20}
              >
                <YStack
                  justifyContent="center"
                  alignItems="center"
                  position="absolute"
                  top={15}
                  left={0}
                  right={0}
                  bottom={15}
                  space={5}
                  style={{ maxHeight: 200 }}
                >
                  {loading ? (
                    <SizableText marginBottom={2}>Loading...</SizableText>
                  ) : !hasSearched ? (
                    <SizableText
                      style={{
                        fontFamily: "Poppins",
                        color: "#666",
                        textAlign: "center",
                        padding: 20,
                      }}
                    >
                      Please select at least one category and enter your budget
                      to get recommendations
                    </SizableText>
                  ) : recommendations.length === 0 ? (
                    <SizableText
                      style={{
                        fontFamily: "Poppins",
                        color: "#666",
                        textAlign: "center",
                        padding: 20,
                      }}
                    >
                      No recommendations found for your selected categories and
                      budget. Try adjusting your budget or selecting different
                      categories.
                    </SizableText>
                  ) : (
                    <RNScrollView style={{ width: "100%" }}>
                      <SizableText
                        marginBottom={2}
                        style={{
                          fontFamily: "Poppins",
                          color: "#000",
                          fontSize: 16,
                          alignSelf: "center",
                          paddingBottom: 10,
                        }}
                      >
                        Recommendation
                      </SizableText>
                      {recommendations.map((recommendation, index) => (
                        <XStack
                          key={recommendation.ID || index}
                          justifyContent="center"
                          alignItems="center"
                          alignSelf="center"
                          style={{
                            borderRadius: 12,
                            backgroundColor: "#4A7C59",
                            width: "90%",
                            height: height * 0.045,
                            marginBottom: 6,
                            marginVertical: 6,
                            justifyContent: "center",
                          }}
                        >
                          <SizableText
                            style={{
                              fontFamily: "Poppins",
                              color: "#fff",
                              fontSize: 13,
                              textWrap: "wrap",
                              textAlign: "center",
                            }}
                          >
                            {recommendation.Name} (Rp{" "}
                            {formatCurrency(recommendation.PriceMin.toString())}{" "}
                            - Rp{" "}
                            {formatCurrency(recommendation.PriceMax.toString())}
                            )
                          </SizableText>
                        </XStack>
                      ))}
                    </RNScrollView>
                  )}
                </YStack>
              </ZStack>
            </YStack>
          </YStack>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
