import React, { useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Adapt,
  Anchor,
  Button,
  Checkbox,
  CheckboxProps,
  FontSizeTokens,
  getFontSize,
  Input,
  Label,
  ScrollView,
  Select,
  SelectProps,
  Sheet,
  SizableText,
  View,
  XStack,
  YStack,
} from "tamagui";
import { Navbar } from "@/components/Navbar";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
} from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "tamagui/linear-gradient";

export default function register() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [dob, setDob] = React.useState(""); 
  const [open, setOpen] = React.useState(false);
  const [referralCode, setReferralCode] = React.useState("");
  const [error, setError] = React.useState("");
  const [name, setName] = React.useState("");

  const showDatePicker = useCallback(() => {
    console.log("Opening date picker...");
    setDatePickerVisible(true);
  }, []);
  
  function formatDate(date: Date | null): string {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  
  function parseDate(text: string): string | null {
    const regex = /^(\d{2})-(\d{2})-(\d{4})$/;
    const match = text.match(regex);
    if (!match) return null;
  
    const day = match[1];
    const month = match[2];
    const year = match[3];
  
    return `${year}-${month}-${day}`; // Ubah ke format YYYY-MM-DD
  }
  
  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword || !gender || !dob) {
      setError("All fields are required!");
      return;
    }
  
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
  
    const formattedDob = parseDate(dob);
    if (!formattedDob) {
      setError("Invalid date format! Use DD-MM-YYYY.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8080/authentication/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          gender,
          dob: formattedDob, // Format sudah benar
          referralCode,
        }),
      });
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }
  
      alert("Registration Successful!");
      router.push("/authentication/login");
    } catch (error) {
      console.error("Error:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };
  
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Navbar />
        <YStack
          padding={25}
          style={{ justifyContent: "center", alignItems: "flex-start" }}
          borderRadius={100}
        >
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
            <SizableText
              style={{ fontSize: 24, color: "#9BA88D", fontFamily: "Poppins" }}
            >
              Sign Up
            </SizableText>
            <Input
              flex={1}
              size="$3"
              placeholder="Enter your Name"
              fontFamily={"Poppins"}
              backgroundColor={"#F7F5E6"}
              borderWidth={1}
              borderColor="black"
              borderRadius={8}
              value={name}
              onChangeText={setName}
            />
            <Input
              flex={1}
              size="$3"
              placeholder="Enter your E-mail"
              fontFamily={"Poppins"}
              backgroundColor={"#F7F5E6"}
              borderWidth={1}
              borderColor="black"
              borderRadius={8}
              value={email}
              onChangeText={setEmail}
            />
            <Input
              flex={1}
              size="$3"
              placeholder="Enter your Password"
              fontFamily={"Poppins"}
              backgroundColor={"#F7F5E6"}
              borderWidth={1}
              borderColor="black"
              borderRadius={8}
              value={password}
              onChangeText={setPassword}
            />
            <Input
              flex={1}
              size="$3"
              placeholder="Re-enter your Password"
              fontFamily={"Poppins"}
              backgroundColor={"#F7F5E6"}
              borderWidth={1}
              borderColor="black"
              borderRadius={8}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <XStack space={10}>
              <SelectGender gender={gender} setGender={setGender} />
              <Input
                flex={1}
                size="$3"
                placeholder="Date Of Birth (DD-MM-YYYY)"
                fontFamily={"Poppins"}
                backgroundColor={"#F7F5E6"}
                borderWidth={1}
                borderColor="black"
                borderRadius={8}
                value={dob}
                onChangeText={setDob}
                keyboardType="numeric"
              />
            </XStack>
            <Input
              flex={1}
              size="$3"
              placeholder="Referral Code (Optional)"
              fontFamily={"Poppins"}
              backgroundColor={"#F7F5E6"}
              borderWidth={1}
              borderColor="black"
              borderRadius={8}
              value={referralCode}
              onChangeText={setReferralCode}
            />
            <XStack justifyContent="center" alignItems="center">
              <CheckboxWithLabel size="$3" />
            </XStack>
            {error ? (
              <SizableText style={{ color: "red", textAlign: "center" }}>{error}</SizableText>
            ) : null}

            <Button
              marginVertical={0}
              width={120}
              height={40}
              alignSelf="center"
              backgroundColor={"#9BA88D"}
              borderRadius={17}
              onPress={handleRegister}
            >
              <SizableText style={{ fontFamily: "Poppins", color: "white" }}>
                Register
              </SizableText>
            </Button>
            <XStack justifyContent="center" alignItems="center">
              <Anchor
                color={"#9BA88D"}
                width={"247.19"}
                height={"24"}
                href="/authentication/login"
                textAlign="center"
                style={{ fontFamily: "Poppins", fontSize: 13 }}
                marginVertical={40}
                textDecorationLine="none"
              >
                Have an account? Login Now!
              </Anchor>
            </XStack>
          </YStack>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
export function SelectGender({
  gender,
  setGender,
  ...props
}: SelectProps & { gender: string; setGender: (value: string) => void }) {
  return (
    <Select
      value={gender}
      onValueChange={setGender}
      disablePreventBodyScroll
      {...props}
    >
      <Select.Trigger
        flex={1}
        size="$3"
        width={190}
        backgroundColor={"#F7F5E6"}
        borderWidth={1}
        borderColor="black"
        borderRadius={8}
        iconAfter={ChevronDown}
      >
        <Select.Value
          placeholder="Gender"
          color={gender ? "black" : "#0000006B"} 
          style={{ fontFamily: "Poppins", fontSize: 13 }}
        />
      </Select.Trigger>

      <Adapt platform="native">
        <Sheet
          native={!!props.native}
          modal
          dismissOnSnapToBottom
          animation="medium"
        >
          <Sheet.Frame>
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay
            backgroundColor="$shadowColor"
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Adapt>

      <Select.Content zIndex={20000}>
        <Select.ScrollUpButton
          alignItems="center"
          justifyContent="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStack zIndex={10}>
            <ChevronUp size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={["$background", "transparent"]}
            borderRadius="$4"
          />
        </Select.ScrollUpButton>
        <Select.Viewport minWidth={200}>
          <Select.Group>
            <Select.Label>Genders</Select.Label>
            {React.useMemo(
              () =>
                Genders.map((item, i) => (
                  <Select.Item index={i} key={item.name} value={item.name.toLowerCase()}>
                    <Select.ItemText>{item.name}</Select.ItemText>
                    <Select.ItemIndicator marginLeft="auto">
                      <Check size={16} />
                    </Select.ItemIndicator>
                  </Select.Item>
                )),
              [Genders]
            )}
          </Select.Group>
          {props.native && (
            <YStack
              position="absolute"
              right={0}
              top={0}
              bottom={0}
              alignItems="center"
              justifyContent="center"
              width={"$4"}
              pointerEvents="none"
            >
              <ChevronDown
                size={getFontSize((props.size as FontSizeTokens) ?? "$true")}
              />
            </YStack>
          )}
        </Select.Viewport>

        <Select.ScrollDownButton
          alignItems="center"
          justifyContent="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStack zIndex={10}>
            <ChevronDown size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={["transparent", "$background"]}
            borderRadius="$4"
          />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select>
  );
}

const Genders = [{ name: "Male" }, { name: "Female" }];

export function CheckboxWithLabel({
  size,
  label = "I agree to the Terms & Conditions",
  ...checkboxProps
}: CheckboxProps & { label?: string }) {
  const id = `checkbox-${(size || "").toString().slice(1)}`;
  return (
    <XStack width={300} alignItems="center" gap="$3" justifyContent="center">
      <Checkbox id={id} size={size} {...checkboxProps}>
        <Checkbox.Indicator>
          <Check />
        </Checkbox.Indicator>
      </Checkbox>

      <Label size={size} htmlFor={id} style={{ fontFamily: "Poppins" }}>
        {label}
      </Label>
    </XStack>
  );
}
function setDatePickerVisible(arg0: boolean) {
  throw new Error("Function not implemented.");
}

