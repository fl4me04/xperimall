import { SafeAreaView } from "react-native";
import React, { useState } from "react";
import {
  Anchor,
  Button,
  Input,
  ScrollView,
  SizableText,
  XStack,
  YStack,
} from "tamagui";
import { Navbar } from "@/components/Navbar";
import { ArrowLeft } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/authentication/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login successful!");
        router.push("/");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      alert("Error logging in");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Navbar />
        <YStack padding={25} alignItems="flex-start">
          <Button
            circular
            size="$2"
            background="#9BA88D"
            icon={<ArrowLeft size={20} color={"white"} />}
            onPress={() => router.back()}
          />
        </YStack>
        <YStack padding={50} marginVertical={80}>
          <YStack space={10} justifyContent="center">
            <SizableText style={{ fontSize: 24, color: "#9BA88D", fontFamily: "Poppins" }}>
              Sign In
            </SizableText>
            <Input
              flex={1}
              size="$3"
              placeholder="Enter your E-mail"
              value={email}
              onChangeText={setEmail}
              fontFamily="Poppins"
              backgroundColor="#F7F5E6"
              borderWidth={1}
              borderColor="black"
              borderRadius={8}
            />
            <Input
              flex={1}
              size="$3"
              placeholder="Enter your Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              fontFamily="Poppins"
              backgroundColor="#F7F5E6"
              borderWidth={1}
              borderColor="black"
              borderRadius={8}
            />
            <XStack justifyContent="center" alignItems="center">
              <Anchor
                color="black"
                width={150}
                height={24}
                marginVertical={6}
                href="/forgot-password"
                textAlign="center"
                style={{ fontFamily: "Poppins", fontSize: 13 }}
              >
                Forgot your account?
              </Anchor>
            </XStack>
            <Button
              marginVertical={10}
              width={120}
              height={40}
              alignSelf="center"
              backgroundColor="#9BA88D"
              borderRadius={17}
              onPress={handleLogin}
            >
              <SizableText style={{ fontFamily: "Poppins", color: "white" }}>
                Login
              </SizableText>
            </Button>
            <XStack justifyContent="center" alignItems="center">
              <Anchor
                color="#9BA88D"
                href="/authentication/register"
                textAlign="center"
                style={{ fontFamily: "Poppins", fontSize: 13 }}
                marginVertical={40}
                textDecorationLine="none"
              >
                Don't have an account? Register Now!
              </Anchor>
            </XStack>
          </YStack>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
