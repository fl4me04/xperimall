import { Navbar } from "@/components/Navbar";
import { ArrowLeft } from "@tamagui/lucide-icons";
import { router, useFocusEffect } from "expo-router";
import { useState, useEffect, useRef, useCallback } from "react";
import { Dimensions, Platform } from "react-native";
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
} from "tamagui";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";

const { width, height } = Dimensions.get("window");

interface Expense {
  tenant: string;
  amount: number;
  color: string;
}

interface PieChartProps {
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

const PieChart = React.memo(({ expenses }: PieChartProps) => {
  const pieSlices = expenses.length
    ? createPieSlices(expenses.map(({ amount, color }) => ({ amount, color })))
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
            <Circle cx={1} cy={1} r={1} fill={expenses[0].color} />
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
                fontFamily: "Inter",
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
                fontFamily: "Inter",
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

const API_URL = "https://xperimall-backend.onrender.com";

export default function FinanceTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [tenant, setTenant] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const isNavigating = useRef(false);
  const [showNoExpenseDialog, setShowNoExpenseDialog] = useState(false);
  const [showAmountDialog, setShowAmountDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  useEffect(() => {
    const getToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        setToken(storedToken);
      } catch (error) {
        console.error("Error getting token:", error);
      }
    };
    getToken();
  }, []);

  // Reset form when page comes into focus
  useFocusEffect(
    useCallback(() => {
      setExpenses([]);
      setTenant("");
      setAmount("");
    }, [])
  );

  const formatCurrency = (value: string) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleAmountChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    setAmount(numericValue);
  };

  const colors = ["#4A7C59", "#C47A7B", "#9BA88D", "#4D4D4D"];

  const handleAdd = () => {
    if (!tenant || !amount) return;
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount === 0) {
      setShowAmountDialog(true);
      return;
    }
    setExpenses([
      ...expenses,
      {
        tenant,
        amount: parsedAmount,
        color: colors[expenses.length % colors.length],
      },
    ]);
    setTenant("");
    setAmount("");
  };

  const handleLogin = () => {
    setShowLoginDialog(false);
    router.push({
      pathname: "/(drawer)/(tabs)/authentication/login",
      params: { returnTo: "/(drawer)/(tabs)/financeTracker" },
    });
  };

  const handleCancel = () => {
    setShowLoginDialog(false);
    router.push("/(drawer)/(tabs)");
  };

  const handleFinalize = async () => {
    if (isNavigating.current) return;

    if (expenses.length === 0) {
      setShowNoExpenseDialog(true);
      return;
    }

    if (!token) {
      setShowLoginDialog(true);
      return;
    }

    try {
      const expenseData = expenses.map(({ tenant, amount }) => ({
        tenant,
        amount,
      }));

      const response = await fetch(`${API_URL}/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          expenses: expenseData,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Set navigating flag
        isNavigating.current = true;

        // Show success message
        setShowSuccessDialog(true);

        setExpenses([]);
        setTenant("");
        setAmount("");

        router.push("/(drawer)/(tabs)/history");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save expenses");
      }
    } catch (error: any) {
      console.error("Error saving expenses:", error);
      if (
        error.message?.includes("401") ||
        error.message?.includes("unauthorized")
      ) {
        setShowLoginDialog(true);
      } else {
        alert(error.message || "Failed to save expenses. Please try again.");
      }
    } finally {
      setIsLoading(false);
      isNavigating.current = false;
    }
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
            <SizableText
              width={width * 0.9}
              style={{
                fontSize: Math.min(32, width * 0.8),
                lineHeight: Math.min(32, width * 0.8) * 1.3,
                color: "#2B4433",
                fontFamily: "Inter",
                flexWrap: "wrap",
                flexShrink: 1,
                textAlign: "center",
              }}
            >
              Finance Tracker
            </SizableText>
          </XStack>
          <YStack alignItems="center" marginVertical={20}>
            <PieChart expenses={expenses} />
            {expenses.length === 0 && (
              <SizableText
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: [
                    { translateX: -width * 0.25 },
                    { translateY: -10 },
                  ],
                  color: "#fff",
                  textAlign: "center",
                  width: width * 0.5,
                }}
              >
                You haven't inputted an expense.
              </SizableText>
            )}
          </YStack>
          <YStack alignItems="center" marginVertical={20}>
            <SizableText
              style={{
                fontFamily: "Inter",
                fontWeight: "700",
                fontSize: 25,
                color: "#000",
                marginBottom: height * 0.02,
              }}
            >
              Enter a New Expense:
            </SizableText>
            <Input
              placeholder="Input Tenant Name"
              value={tenant}
              onChangeText={setTenant}
              style={{
                width: "90%",
                borderRadius: 20,
                borderWidth: 1,
                borderColor: "#000",
                padding: 10,
                marginBottom: height * 0.02,
                backgroundColor: "#F7F5E6",
                fontFamily: "Inter",
              }}
            />
            <Input
              placeholder="Input Amount Spent (Rp)"
              value={`Rp ${formatCurrency(amount)}`}
              onChangeText={(value) =>
                handleAmountChange(value.replace(/^Rp\s?/, ""))
              }
              keyboardType="numeric"
              style={{
                width: "90%",
                borderRadius: 20,
                borderWidth: 1,
                borderColor: "#000",
                padding: 10,
                marginBottom: height * 0.02,
                backgroundColor: "#F7F5E6",
                fontFamily: "Inter",
              }}
            />
            <XStack space={20} marginTop={10}>
              <Button
                backgroundColor="#4A7C59"
                color="#fff"
                borderRadius={20}
                width={100}
                onPress={handleAdd}
                disabled={isLoading}
                style={{
                  borderWidth: 0,
                }}
              >
                Add
              </Button>
              <Button
                backgroundColor="#C47A7B"
                color="#fff"
                borderRadius={20}
                width={100}
                onPress={() => handleFinalize()}
                disabled={isLoading}
                style={{
                  borderWidth: 0,
                }}
              >
                {isLoading ? <Spinner color="#fff" /> : "Finalize"}
              </Button>
            </XStack>
          </YStack>
        </YStack>

        <Dialog
          modal
          open={showNoExpenseDialog}
          onOpenChange={setShowNoExpenseDialog}
        >
          <Dialog.Portal>
            <Dialog.Overlay
              key="overlay-no-expense"
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
              key="content-no-expense"
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
                  fontFamily: "Inter",
                  fontWeight: "700",
                  fontSize: 20,
                  color: "#fff",
                }}
              >
                No Expenses
              </Dialog.Title>
              <Dialog.Description
                style={{
                  fontFamily: "Inter",
                  color: "#fff",
                  fontSize: 16,
                  marginBottom: 10,
                }}
              >
                Please add at least one expense before finalizing.
              </Dialog.Description>
              <XStack space="$3" justifyContent="flex-end">
                <Dialog.Close displayWhenAdapted asChild>
                  <Button
                    backgroundColor="#4A7C59"
                    color="#fff"
                    borderRadius={20}
                    width={100}
                    onPress={() => setShowNoExpenseDialog(false)}
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

        <Dialog
          modal
          open={showAmountDialog}
          onOpenChange={setShowAmountDialog}
        >
          <Dialog.Portal>
            <Dialog.Overlay
              key="overlay-amount"
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
              key="content-amount"
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
                  fontFamily: "Inter",
                  fontWeight: "700",
                  fontSize: 20,
                  color: "#fff",
                }}
              >
                Invalid Amount
              </Dialog.Title>
              <Dialog.Description
                style={{
                  fontFamily: "Inter",
                  color: "#fff",
                  fontSize: 16,
                  marginBottom: 10,
                }}
              >
                Please enter the correct amount.
              </Dialog.Description>
              <XStack space="$3" justifyContent="flex-end">
                <Dialog.Close displayWhenAdapted asChild>
                  <Button
                    backgroundColor="#4A7C59"
                    color="#fff"
                    borderRadius={20}
                    width={100}
                    onPress={() => setShowAmountDialog(false)}
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
                  fontFamily: "Inter",
                  fontWeight: "700",
                  fontSize: 20,
                  color: "#fff",
                }}
              >
                Success
              </Dialog.Title>
              <Dialog.Description
                style={{
                  fontFamily: "Inter",
                  color: "#fff",
                  fontSize: 16,
                  marginBottom: 10,
                }}
              >
                Spending History Saved.
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
                  fontFamily: "Inter",
                  fontWeight: "700",
                  fontSize: 20,
                  color: "#fff",
                }}
              >
                Login Required
              </Dialog.Title>
              <Dialog.Description
                style={{
                  fontFamily: "Inter",
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
      </ScrollView>
    </SafeAreaView>
  );
}
