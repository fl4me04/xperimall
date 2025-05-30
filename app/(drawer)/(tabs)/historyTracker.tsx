import { Navbar } from "@/components/Navbar";
import { ArrowLeft } from "@tamagui/lucide-icons";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import { useState, useEffect, useCallback } from "react";
import { Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { G, Path, Circle, Text as SvgText, TSpan } from "react-native-svg";
import {
  Button,
  Input,
  ScrollView,
  SizableText,
  XStack,
  YStack,
  Spinner,
  Dialog,
  Adapt,
  Sheet,
} from "tamagui";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../hooks/useAuth";
import React from "react";

const { width, height } = Dimensions.get("window");
const API_URL = "https://xperimall-backend.onrender.com";

interface Expense {
  id: number;
  tenant: string;
  amount: number;
  created_at: string;
}

interface ExpenseData {
  date: string;
  total: number;
  expenses: Expense[];
}

function createPieSlices(expenses: { amount: number; color: string }[]) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  let startAngle = 0;
  return expenses.map((e) => {
    const angle = (e.amount / total) * 2 * Math.PI;
    const x1 = Math.cos(startAngle) * 1 + 1;
    const y1 = Math.sin(startAngle) * 1 + 1;
    const x2 = Math.cos(startAngle + angle) * 1 + 1;
    const y2 = Math.sin(startAngle + angle) * 1 + 1;
    const largeArc = angle > Math.PI ? 1 : 0;
    const d = `M1,1 L${x1},${y1} A1,1 0 ${largeArc} 1 ${x2},${y2} Z`;
    startAngle += angle;
    return { d, color: e.color };
  });
}

const PieChart = React.memo(({ expenses }: { expenses: Expense[] }) => {
  const colors = ["#4A7C59", "#C47A7B", "#9BA88D", "#F7F5E6", "#4D4D4D"];
  const pieSlices = expenses.length
    ? createPieSlices(
        expenses.map((expense, index) => ({
          amount: expense.amount,
          color: colors[index % colors.length],
        }))
      )
    : [];

  // Calculate label positions for overlay
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  let prev = 0;
  const labelPositions = expenses.map((expense, i) => {
    const angle = ((prev + expense.amount / 2) / total) * 2 * Math.PI;
    prev += expense.amount;
    const r = ((width * 0.8) / 2) * 0.55; // match SVG r=0.55
    const x = Math.cos(angle) * r + (width * 0.8) / 2;
    const y = Math.sin(angle) * r + (width * 0.8) / 2;
    return { x, y, tenant: expense.tenant, amount: expense.amount };
  });

  return (
    <YStack>
      <Svg width={width * 0.8} height={width * 0.8} viewBox="0 0 2 2">
        <G>
          {expenses.length === 1 ? (
            <Circle cx={1} cy={1} r={1} fill={colors[0]} />
          ) : pieSlices.length > 0 ? (
            pieSlices.map((slice, i) => (
              <Path key={i} d={slice.d} fill={slice.color} />
            ))
          ) : (
            <Circle cx={1} cy={1} r={1} fill="#4A7C59" />
          )}
        </G>
      </Svg>
      {/* Overlay labels */}
      {expenses.length > 0 &&
        labelPositions.map((pos, i) => (
          <YStack
            key={i}
            position="absolute"
            left={pos.x - 40}
            top={pos.y - 20}
            width={80}
            alignItems="center"
            pointerEvents="none"
          >
            <SizableText
              color="#fff"
              fontSize={12}
              style={{
                fontFamily: "Poppins",
                textAlign: "center",
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {pos.tenant}
            </SizableText>
            <SizableText
              color="#fff"
              fontSize={12}
              style={{
                fontFamily: "Poppins",
                textAlign: "center",
                fontWeight: "bold",
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              Rp {pos.amount.toLocaleString("id-ID")}
            </SizableText>
          </YStack>
        ))}
    </YStack>
  );
});

export default function HistoryTracker() {
  const params = useLocalSearchParams();
  const [expenseData, setExpenseData] = useState<ExpenseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { token, isLoading: isAuthLoading, checkAuth } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (token && params.date) {
        console.log("Fetching expenses for date:", params.date);
        fetchExpenses();
      }
    }, [token, params.date])
  );

  const fetchExpenses = async () => {
    if (!token) {
      setShowLoginDialog(true);
      return;
    }

    setIsLoading(true);
    try {
      const date = params.date as string;
      console.log("=== Fetching Expenses ===");
      console.log("Date from params:", date);
      console.log("Token:", token);

      // Validate date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) {
        console.error("Invalid date format:", date);
        throw new Error("Invalid date format. Expected YYYY-MM-DD");
      }

      const url = `${API_URL}/expenses/detail?date=${date}`;
      console.log("Making API request to:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Received expense data:", data);

        // Ensure we have valid expense data
        if (data && typeof data === "object") {
          // If data doesn't have expenses array, create it from the data
          if (!data.expenses && Array.isArray(data)) {
            setExpenseData({
              date: date,
              total: data.reduce(
                (sum: number, exp: Expense) => sum + exp.amount,
                0
              ),
              expenses: data,
            });
          } else if (data.expenses && Array.isArray(data.expenses)) {
            setExpenseData(data);
          } else {
            console.error("Invalid expense data format:", data);
            throw new Error("Invalid expense data format received from server");
          }
        } else {
          console.error("Invalid response data:", data);
          throw new Error("Invalid response data from server");
        }
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    setShowLoginDialog(false);
    router.push({
      pathname: "/(drawer)/(tabs)/authentication/login",
      params: { returnTo: "/(drawer)/(tabs)/historyTracker" },
    });
  };

  const handleCancel = () => {
    setShowLoginDialog(false);
    router.push("/(drawer)/(tabs)/history");
  };

  const handleDelete = async () => {
    if (!token) {
      setShowLoginDialog(true);
      return;
    }

    try {
      const date = decodeURIComponent(params.date as string);
      console.log("Token being used for delete:", token);
      console.log(
        "Making delete request to:",
        `${API_URL}/expenses?date=${date}`
      );

      const response = await fetch(`${API_URL}/expenses?date=${date}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      console.log("Delete response status:", response.status);
      if (response.ok) {
        setShowDeleteModal(false);
        setShowSuccessDialog(true);
        router.push("/(drawer)/(tabs)/history");
      } else {
        const errorData = await response.json();
        console.error("Delete error response:", errorData);
        throw new Error(errorData.message || "Failed to delete expenses");
      }
    } catch (error: any) {
      console.error("Error deleting expenses:", error);
      if (
        error.message?.includes("401") ||
        error.message?.includes("unauthorized")
      ) {
        setShowLoginDialog(true);
      } else {
        alert(error.message || "Failed to delete expenses. Please try again.");
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
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
            marginBottom={width * 0.01}
          >
            <Button
              circular
              size="$2"
              background="#2B4433"
              icon={<ArrowLeft size={20} color={"white"} />}
              onPress={() => router.push("/(drawer)/(tabs)/history")}
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
            <XStack width={width * 0.5} justifyContent="center">
              <SizableText
                width={width * 1}
                style={{
                  fontSize: Math.min(22, width * 0.8),
                  lineHeight: Math.min(22, width * 0.8) * 1.1,
                  color: "#2B4433",
                  fontFamily: "Poppins",
                  flexWrap: "wrap",
                  flexShrink: 1,
                  textAlign: "center",
                  letterSpacing: 1,
                  alignSelf: "center",
                  textWrap: "wrap",
                }}
              >
                {expenseData?.date || "Loading..."}
              </SizableText>
            </XStack>
          </XStack>
          <YStack alignItems="center" marginVertical={20}>
            {isLoading ? (
              <YStack flex={1} justifyContent="center" alignItems="center">
                <Spinner size="large" color="#4A7C59" />
              </YStack>
            ) : expenseData?.expenses.length === 0 ? (
              <SizableText
                style={{
                  fontFamily: "Poppins",
                  color: "#666",
                  textAlign: "center",
                  padding: 20,
                }}
              >
                No expenses found for this date
              </SizableText>
            ) : (
              <>
                <PieChart expenses={expenseData?.expenses || []} />
                <YStack alignItems="center" marginVertical={20}>
                  <SizableText
                    style={{
                      fontFamily: "Poppins",
                      fontWeight: "700",
                      fontSize: 25,
                      color: "#000",
                      marginBottom: height * 0.02,
                      marginTop: height * 0.02,
                    }}
                  >
                    Total Expense:
                  </SizableText>
                  <SizableText
                    width={width * 0.9}
                    alignSelf="center"
                    style={{
                      fontSize: Math.min(28, width * 0.08),
                      lineHeight: Math.min(28, width * 0.08) * 1.3,
                      color: "#4A7C59",
                      fontFamily: "Poppins",
                      flexWrap: "wrap",
                      flexShrink: 1,
                      textAlign: "center",
                    }}
                  >
                    {expenseData ? formatCurrency(expenseData.total) : "Rp 0"}
                  </SizableText>
                </YStack>
                <Button
                  backgroundColor="#C47A7B"
                  color="#fff"
                  borderRadius={20}
                  width={120}
                  onPress={() => setShowDeleteModal(true)}
                  style={{
                    borderWidth: 0,
                    marginTop: 20,
                  }}
                >
                  Delete
                </Button>
              </>
            )}
          </YStack>
        </YStack>
      </ScrollView>

      <Dialog modal open={showDeleteModal} onOpenChange={setShowDeleteModal}>
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
            justifyContent="center"
            alignItems="center"
            key="content"
            animateOnly={["transform", "opacity"]}
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
                fontWeight: "100",
                fontSize: 20,
                color: "#fff",
                // marginBottom: 5,
              }}
            >
              Delete History
            </Dialog.Title>
            <Dialog.Description
              style={{
                fontFamily: "Poppins",
                color: "#fff",
                fontSize: 16,
                marginBottom: 5,
                marginTop: -13,
              }}
            >
              Are you sure you want to delete all expenses for this date? This
              action cannot be undone.
            </Dialog.Description>

            <XStack space="$3" justifyContent="flex-end">
              <Dialog.Close displayWhenAdapted asChild>
                <Button
                  backgroundColor="#C47A7B"
                  color="#fff"
                  borderRadius={20}
                  width={100}
                  onPress={() => setShowDeleteModal(false)}
                  style={{
                    borderWidth: 0,
                  }}
                >
                  No
                </Button>
              </Dialog.Close>
              <Dialog.Close displayWhenAdapted asChild>
                <Button
                  backgroundColor="#4A7C59"
                  color="#fff"
                  borderRadius={20}
                  width={100}
                  onPress={handleDelete}
                  style={{
                    borderWidth: 0,
                  }}
                >
                  Yes
                </Button>
              </Dialog.Close>
            </XStack>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>

      <Dialog
        modal
        open={showSuccessDialog}
        onOpenChange={(open) => {
          setShowSuccessDialog(open);
          if (!open) {
            router.push("/(drawer)/(tabs)/history");
          }
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay
            key="overlay-success"
            animation="quick"
            opacity={0.5}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <Dialog.Content
            bordered
            elevate
            justifyContent="center"
            alignItems="center"
            key="content-success"
            animateOnly={["transform", "opacity"]}
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
                // marginBottom: 10,
              }}
            >
              Success
            </Dialog.Title>
            <Dialog.Description
              style={{
                fontFamily: "Poppins",
                color: "#fff",
                fontSize: 16,
                marginBottom: 10,
              }}
            >
              History Deleted.
            </Dialog.Description>
            <XStack space="$3" justifyContent="flex-end">
              <Dialog.Close displayWhenAdapted asChild>
                <Button
                  backgroundColor="#4A7C59"
                  color="#fff"
                  borderRadius={20}
                  width={100}
                  onPress={() => setShowSuccessDialog(false)}
                  style={{
                    borderWidth: 0,
                  }}
                >
                  Return
                </Button>
              </Dialog.Close>
            </XStack>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>

      <Dialog modal open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <Dialog.Portal>
          <Dialog.Overlay
            key="overlay-login"
            animation="quick"
            opacity={0.5}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <Dialog.Content
            bordered
            elevate
            justifyContent="center"
            alignItems="center"
            key="content-login"
            animateOnly={["transform", "opacity"]}
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
