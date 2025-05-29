import { Navbar } from "@/components/Navbar";
import { ArrowLeft } from "@tamagui/lucide-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useState, useEffect, useCallback } from "react";
import { Dimensions, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  ScrollView,
  SizableText,
  XStack,
  YStack,
  Spinner,
  Dialog,
} from "tamagui";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../hooks/useAuth";

const { width, height } = Dimensions.get("window");
const API_URL = "https://xperimall-backend.onrender.com";

interface Expense {
  id: number;
  tenant: string;
  amount: number;
  created_at: string;
}

interface GroupedExpenses {
  date: string;
  total: number;
  expenses: Expense[];
}

const formatDateForAPI = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD format
};

export default function History() {
  const [groupedExpenses, setGroupedExpenses] = useState<GroupedExpenses[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token, isLoading: isAuthLoading, checkAuth } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const fetchExpenses = async () => {
    if (!token) {
      setShowLoginDialog(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/expenses/grouped`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Ensure data is an array and sort by date
        const sortedData = Array.isArray(data) ? data : [];
        setGroupedExpenses(sortedData);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch expenses");
      }
    } catch (error: any) {
      console.error("Error fetching expenses:", error);
      if (
        error.message?.includes("401") ||
        error.message?.includes("unauthorized")
      ) {
        setShowLoginDialog(true);
      } else {
        alert(error.message || "Failed to fetch expenses. Please try again.");
      }
      setGroupedExpenses([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (token) {
        fetchExpenses();
      } else {
        setShowLoginDialog(true);
      }
    }, [token])
  );

  useEffect(() => {
    if (token) {
      fetchExpenses();
    } else {
      setShowLoginDialog(true);
    }
  }, [token]);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const handleDateClick = (dateStr: string) => {
    if (!token) {
      setShowLoginDialog(true);
      return;
    }
    
    // Parse the date string (e.g., "Monday, 23 February 2025")
    const dateParts = dateStr.split(", ")[1].split(" ");
    const day = dateParts[0];
    const month =
      new Date(Date.parse(dateParts[1] + " 1, 2000")).getMonth() + 1;
    const year = dateParts[2];
    const formattedDate = `${year}-${month
      .toString()
      .padStart(2, "0")}-${day.padStart(2, "0")}`;

    router.push({
      pathname: "/(drawer)/(tabs)/historyTracker",
      params: { date: formattedDate },
    });
  };

  const handleLogin = () => {
    setShowLoginDialog(false);
    router.push({
      pathname: "/(drawer)/(tabs)/authentication/login",
      params: { returnTo: "/(drawer)/(tabs)/history" }
    });
  };

  const handleCancel = () => {
    setShowLoginDialog(false);
    router.push("/(drawer)/(tabs)");
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
            {isLoading ? (
              <YStack flex={1} justifyContent="center" alignItems="center">
                <Spinner size="large" color="#4A7C59" />
              </YStack>
            ) : groupedExpenses.length === 0 ? (
              <SizableText
                style={{
                  fontFamily: "Poppins",
                  color: "#666",
                  textAlign: "center",
                  padding: 20,
                }}
              >
                No expense history found
              </SizableText>
            ) : (
              groupedExpenses.map((group, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleDateClick(group.date)}
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
                        {group.date}
                      </SizableText>
                      <SizableText
                        style={{
                          fontSize: 22,
                          color: "#4A7C59",
                          fontFamily: "Poppins",
                          fontWeight: "600",
                        }}
                      >
                        {formatCurrency(group.total)}
                      </SizableText>
                    </YStack>
                  </XStack>
                </Pressable>
              ))
            )}
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
                style={{
                  borderWidth: 0,
                }}
              >
                Add
              </Button>
            </XStack>
          </YStack>
        </YStack>
      </ScrollView>

      <Dialog modal open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <Dialog.Portal>
          <Dialog.Overlay
            key="overlay"
            animation="quick"
            opacity={0.5}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <Dialog.Content
            bordered
            elevate
            key="content"
            animation={[
              "quick",
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            space
            style={{
              backgroundColor: "#2B4433",
              borderRadius: 20,
              padding: 20,
              width: width * 0.8,
              maxWidth: 400,
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: [{ translateX: -width * 0.4 }, { translateY: -100 }],
            }}
          >
            <Dialog.Title
              style={{
                fontFamily: "Poppins",
                fontWeight: "700",
                fontSize: 20,
                color: "#fff",
              }}
            >
              Login Required
            </Dialog.Title>
            <Dialog.Description
              style={{
                fontFamily: "Poppins",
                color: "#fff",
                fontSize: 16,
                marginBottom: 10,
              }}
            >
              Please login to access this feature.
            </Dialog.Description>
            <XStack space="$3" justifyContent="flex-end">
              <Button
                backgroundColor="#F7F5E6"
                color="#2B4433"
                borderRadius={20}
                width={100}
                onPress={handleCancel}
                style={{
                  borderWidth: 1,
                  borderColor: "#000",
                }}
              >
                Cancel
              </Button>
              <Button
                backgroundColor="#4A7C59"
                color="#fff"
                borderRadius={20}
                width={100}
                onPress={handleLogin}
                style={{
                  borderWidth: 0,
                }}
              >
                Login
              </Button>
            </XStack>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </SafeAreaView>
  );
}
