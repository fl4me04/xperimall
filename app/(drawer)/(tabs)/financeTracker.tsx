
import { Navbar } from "@/components/Navbar";
import { ArrowLeft } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import React, { useState, useEffect, useRef } from "react";
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
} from "tamagui";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

  return (
    <Svg width={width * 0.8} height={width * 0.8} viewBox="0 0 2 2">
      <G>
        {expenses.length === 1 ? (
          <>
            <Circle cx={1} cy={1} r={1} fill={expenses[0].color} />
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
              const total = expenses.reduce(
                (sum, e) => sum + e.amount,
                0
              );
              let prev = 0;
              for (let j = 0; j < i; j++) prev += expenses[j].amount;
              const angle =
                ((prev + expense.amount / 2) / total) * 2 * Math.PI;
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

const API_URL = "http://localhost:8080";

export default function FinanceTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [tenant, setTenant] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const isNavigating = useRef(false);

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

  const formatCurrency = (value: string) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleAmountChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    setAmount(numericValue);
  };

  const colors = ["#4A7C59", "#C47A7B", "#9BA88D", "#F7F5E6", "#4D4D4D"];

  const handleAdd = () => {
    if (!tenant || !amount) return;
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount === 0) {
      alert("Please enter the correct amount");
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

  const handleFinalize = async () => {
    if (isNavigating.current) return;
    
    if (expenses.length === 0) {
      alert("Please add at least one expense before finalizing");
      return;
    }

    if (!token) {
      alert("Please login first");
      router.push("/(drawer)/(tabs)/authentication/login");
      return;
    }

    try {
      const expenseData = expenses.map(({ tenant, amount }) => ({
        tenant,
        amount,
      }));

      console.log("Sending data:", expenseData);

      const response = await fetch(`${API_URL}/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          expenses: expenseData
        })
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Response data:", data);
        
        // Set navigating flag
        isNavigating.current = true;
        
        // Show success message
        alert("Expenses saved successfully!");
        
        // Clear expenses after a short delay
        setTimeout(() => {
          setExpenses([]);
        }, 100);
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(errorData.message || 'Failed to save expenses');
      }
    } catch (error: any) {
      console.error("Error saving expenses:", error);
      if (error.message?.includes('401') || error.message?.includes('unauthorized')) {
        alert("Session expired. Please login again.");
        router.push("/(drawer)/(tabs)/authentication/login");
      } else {
        alert(error.message || "Failed to save expenses. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
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
              onPress={() => router.push("/(drawer)/(tabs)")}
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
                fontSize: 28,
                color: "#000",
                letterSpacing: 1,
                alignSelf: "center",
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
                fontFamily: "Poppins",
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
                width: width * 0.7,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: "#000",
                padding: 10,
                marginBottom: height * 0.02,
                backgroundColor: "#F7F5E6",
                fontFamily: "Poppins",
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
                width: width * 0.7,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: "#000",
                padding: 10,
                marginBottom: 10,
                backgroundColor: "#F7F5E6",
                fontFamily: "Poppins",
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
                  borderTopWidth: 0,
                  borderRightWidth: 0,
                  borderBottomWidth: 0,
                  borderLeftWidth: 0,
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
                  borderTopWidth: 0,
                  borderRightWidth: 0,
                  borderBottomWidth: 0,
                  borderLeftWidth: 0,
                }}
              >
                {isLoading ? <Spinner color="#fff" /> : "Finalize"}
              </Button>
            </XStack>
          </YStack>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
