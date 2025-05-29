import { Dimensions, SafeAreaView } from "react-native";
import React, { useState, useEffect } from "react";
import {
  Anchor,
  Button,
  Dialog,
  Input,
  ScrollView,
  SizableText,
  XStack,
  YStack,
} from "tamagui";
import { Navbar } from "@/components/Navbar";
import { ArrowLeft } from "@tamagui/lucide-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

export default function Login() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showFillFieldsDialog, setShowFillFieldsDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [returnTo, setReturnTo] = useState<"/(drawer)/(tabs)" | string>("/(drawer)/(tabs)");

  useEffect(() => {
    if (params.returnTo) {
      setReturnTo(params.returnTo as string);
    }
  }, [params]);

  const handleLogin = async () => {
    if (!email || !password) {
      setShowFillFieldsDialog(true);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/authentication/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Store the JWT token
        await AsyncStorage.setItem("token", data.token);
        // Store user data
        const userData = {
          name: data.username,
          email: email,
        };
        await AsyncStorage.setItem("userData", JSON.stringify(userData));
        setEmail("");
        setPassword("");
        setShowSuccessDialog(true);
        // Use router.replace to navigate to the return path
        router.replace(returnTo as any);
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Error logging in");
    }
  };

  const handleBack = () => {
    router.replace("/(drawer)/(tabs)");
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
          >
            <Button
              circular
              size="$2"
              background="#2B4433"
              icon={<ArrowLeft size={20} color={"white"} />}
              onPress={handleBack}
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
          </XStack>
          <YStack padding={25}>
            <YStack space={15} justifyContent="center">
              <SizableText
                style={{ fontSize: 26, color: "#000", fontFamily: "Poppins" }}
              >
                Sign In
              </SizableText>
              <YStack space={10}>
                <Input
                  flex={1}
                  placeholder="Enter your E-mail"
                  value={email}
                  onChangeText={setEmail}
                  style={{
                    width: "100%",
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#000",
                    padding: 10,
                    backgroundColor: "#F7F5E6",
                    fontFamily: "Poppins",
                  }}
                />
                <Input
                  flex={1}
                  placeholder="Enter your Password"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  style={{
                    width: "100%",
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#000",
                    padding: 10,
                    backgroundColor: "#F7F5E6",
                    fontFamily: "Poppins",
                  }}
                  onSubmitEditing={handleLogin}
                />
              </YStack>
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
                backgroundColor="#4A7C59"
                borderRadius={17}
                onPress={handleLogin}
              >
                <SizableText style={{ fontFamily: "Poppins", color: "white" }}>
                  Login
                </SizableText>
              </Button>
              <XStack justifyContent="center" alignItems="center">
                <Button
                  backgroundColor="transparent"
                  onPress={() =>
                    router.push("/(drawer)/(tabs)/authentication/register")
                  }
                  style={{ fontFamily: "Poppins", fontSize: 13 }}
                  marginVertical={40}
                >
                  <SizableText
                    style={{
                      color: "#2B4433",
                      fontFamily: "Poppins",
                      fontSize: 13,
                    }}
                  >
                    Don't have an account? Register Now!
                  </SizableText>
                </Button>
              </XStack>
            </YStack>
          </YStack>
        </YStack>

        <Dialog
          modal
          open={showFillFieldsDialog}
          onOpenChange={setShowFillFieldsDialog}
        >
          <Dialog.Portal>
            <Dialog.Overlay
              key="overlay-fill-fields"
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
              key="content-fill-fields"
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
                Incomplete Fields
              </Dialog.Title>
              <Dialog.Description
                style={{
                  fontFamily: "Poppins",
                  color: "#fff",
                  fontSize: 16,
                  marginBottom: 10,
                }}
              >
                Please fill in all fields.
              </Dialog.Description>
              <XStack space="$3" justifyContent="flex-end">
                <Dialog.Close displayWhenAdapted asChild>
                  <Button
                    backgroundColor="#4A7C59"
                    color="#fff"
                    borderRadius={20}
                    width={100}
                    onPress={() => setShowFillFieldsDialog(false)}
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
              router.push("/");
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
                }}
              >
                Login Successful
              </Dialog.Title>
              <Dialog.Description
                style={{
                  fontFamily: "Poppins",
                  color: "#fff",
                  fontSize: 16,
                  marginBottom: 10,
                }}
              >
                You have logged in successfully!
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
                    Continue
                  </Button>
                </Dialog.Close>
              </XStack>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog>
      </ScrollView>
    </SafeAreaView>
  );
}
