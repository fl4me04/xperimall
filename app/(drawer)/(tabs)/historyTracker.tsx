import { Navbar } from "@/components/Navbar";
import { ArrowLeft } from "@tamagui/lucide-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
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

const { width, height } = Dimensions.get("window");
const API_URL = "http://localhost:8080";

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
    ? createPieSlices(expenses.map((expense, index) => ({
        amount: expense.amount,
        color: colors[index % colors.length],
      })))
    : [];

  return (
    <Svg width={width * 0.8} height={width * 0.8} viewBox="0 0 2 2">
      <G>
        {expenses.length === 1 ? (
          <>
            <Circle cx={1} cy={1} r={1} fill={colors[0]} />
            <SvgText
              x={1}
              y={0.9}
              fill="#fff"
              fontSize={0.07}
              fontWeight="400"
              textAnchor="middle"
              alignmentBaseline="middle"
              fontFamily="Poppins"
            >
              {expenses[0].tenant}
              <TSpan
                x={1}
                dy={0.12}
                fontSize={0.07}
                fontWeight="bold"
                fontFamily="Poppins"
              >
                Rp {expenses[0].amount.toLocaleString("id-ID")}
              </TSpan>
            </SvgText>
          </>
        ) : pieSlices.length > 0 ? (
          <>
            {pieSlices.map((slice, i) => (
              <Path key={i} d={slice.d} fill={slice.color} />
            ))}
            {expenses.map((expense, i) => {
              const total = expenses.reduce((sum, e) => sum + e.amount, 0);
              let prev = 0;
              for (let j = 0; j < i; j++) prev += expenses[j].amount;
              const angle = ((prev + expense.amount / 2) / total) * 2 * Math.PI;
              const r = 0.55;
              const x = Math.cos(angle) * r + 1;
              const y = Math.sin(angle) * r + 1;
              return (
                <SvgText
                  key={i}
                  x={x}
                  y={y}
                  fill="#fff"
                  fontSize={0.07}
                  fontWeight="400"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fontFamily="Poppins"
                >
                  {expense.tenant}
                  <TSpan
                    x={x}
                    dy={0.12}
                    fontSize={0.07}
                    fontWeight="bold"
                    fontFamily="Poppins"
                  >
                    Rp {expense.amount.toLocaleString("id-ID")}
                  </TSpan>
                </SvgText>
              );
            })}
          </>
        ) : (
          <Circle cx={1} cy={1} r={1} fill="#4A7C59" />
        )}
      </G>
    </Svg>
  );
});

export default function HistoryTracker() {
  const params = useLocalSearchParams();
  const [expenseData, setExpenseData] = useState<ExpenseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { token, isLoading: isAuthLoading, checkAuth } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (token && params.date) {
      fetchExpenses();
    }
  }, [token, params.date]);

  const fetchExpenses = async () => {
    if (!token) {
      alert("Please login first");
      router.push("/(drawer)/(tabs)/authentication/login");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/expenses/detail?date=${params.date}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setExpenseData(data);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch expenses');
      }
    } catch (error: any) {
      console.error("Error fetching expenses:", error);
      if (error.message?.includes('401') || error.message?.includes('unauthorized')) {
        alert("Session expired. Please login again.");
        router.push("/(drawer)/(tabs)/authentication/login");
      } else {
        alert(error.message || "Failed to fetch expenses. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!token) {
      alert("Please login first");
      router.push("/(drawer)/(tabs)/authentication/login");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/expenses?date=${params.date}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        setShowDeleteModal(false);
        alert("Expenses deleted successfully");
        router.push("/(drawer)/(tabs)/history");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete expenses');
      }
    } catch (error: any) {
      console.error("Error deleting expenses:", error);
      if (error.message?.includes('401') || error.message?.includes('unauthorized')) {
        alert("Session expired. Please login again.");
        router.push("/(drawer)/(tabs)/authentication/login");
      } else {
        alert(error.message || "Failed to delete expenses. Please try again.");
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

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
              onPress={() => router.push("/(drawer)/(tabs)/history")}
              style={{
                position: "absolute",
                left: 0,
                backgroundColor: "#4A7C59",
                borderTopWidth: 0,
                borderRightWidth: 0,
                borderBottomWidth: 0,
                borderLeftWidth: 0,
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
                fontSize: 18,
                color: "#000",
                letterSpacing: 1,
                alignSelf: "center",
              }}
            >
              {expenseData?.date || "Loading..."}
            </SizableText>
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
                    }}
                  >
                    Total Expense:
                  </SizableText>
                  <SizableText
                    style={{
                      color: "#4A7C59",
                      fontWeight: "600",
                      fontSize: 28,
                      fontFamily: "Poppins",
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
                    borderTopWidth: 0,
                    borderRightWidth: 0,
                    borderBottomWidth: 0,
                    borderLeftWidth: 0,
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
              backgroundColor: "#fff",
              borderRadius: 20,
              padding: 20,
              width: width * 0.8,
              maxWidth: 400,
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: [{ translateX: -width * 0.4 }, { translateY: -100 }],
            }}
          >
            <Dialog.Title
              style={{
                fontFamily: "Poppins",
                fontWeight: "700",
                fontSize: 20,
                color: "#000",
                marginBottom: 10,
              }}
            >
              Confirm Delete
            </Dialog.Title>
            <Dialog.Description
              style={{
                fontFamily: "Poppins",
                color: "#666",
                fontSize: 16,
                marginBottom: 20,
              }}
            >
              Are you sure you want to delete all expenses for this date? This action cannot be undone.
            </Dialog.Description>

            <XStack space="$3" justifyContent="flex-end">
              <Dialog.Close displayWhenAdapted asChild>
                <Button
                  backgroundColor="#4A7C59"
                  color="#fff"
                  borderRadius={20}
                  width={100}
                  onPress={() => setShowDeleteModal(false)}
                  style={{
                    borderTopWidth: 0,
                    borderRightWidth: 0,
                    borderBottomWidth: 0,
                    borderLeftWidth: 0,
                  }}
                >
                  Cancel
                </Button>
              </Dialog.Close>
              <Dialog.Close displayWhenAdapted asChild>
                <Button
                  backgroundColor="#C47A7B"
                  color="#fff"
                  borderRadius={20}
                  width={100}
                  onPress={handleDelete}
                  style={{
                    borderTopWidth: 0,
                    borderRightWidth: 0,
                    borderBottomWidth: 0,
                    borderLeftWidth: 0,
                  }}
                >
                  Delete
                </Button>
              </Dialog.Close>
            </XStack>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </SafeAreaView>
  );
}
