import React, { useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Platform, Modal, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
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
  XStack,
  YStack,
  Dialog,
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
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [date, setDate] = React.useState(new Date(2010, 0, 1));
  const [open, setOpen] = React.useState(false);
  const [referralCode, setReferralCode] = React.useState("");
  const [error, setError] = React.useState("");
  const [name, setName] = React.useState("");
  const [termsAccepted, setTermsAccepted] = React.useState(false);
  const [showTerms, setShowTerms] = React.useState(false);

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      const formattedDate = formatDate(selectedDate);
      setDob(formattedDate);
    }
  };

  function formatDate(date: Date): string {
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

    return `${year}-${month}-${day}`;
  }

  const handleRegister = async () => {
    if (!termsAccepted) {
      setError("Please accept the Terms & Conditions");
      return;
    }

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
      const response = await fetch(
        "http://localhost:8080/authentication/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            password,
            gender,
            dob: formattedDob,
            referralCode,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        if (
          data.message &&
          data.message.toLowerCase().includes("Duplicate entry")
        ) {
          setError("Email already exists!");
        } else {
          throw new Error(data.message || "Registration failed");
        }
        return;
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

  const TermsAndConditionsModal = () => (
    <Dialog modal open={showTerms} onOpenChange={setShowTerms}>
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
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: 20,
            width: "90%",
            maxWidth: 400,
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: [{ translateX: -200 }, { translateY: -200 }],
          }}
        >
          <Dialog.Title style={{ 
            fontFamily: "Poppins", 
            color: "#4A7C59",
            fontSize: 20,
            fontWeight: "700",
            marginBottom: 10
          }}>
            Terms and Conditions
          </Dialog.Title>
          <Dialog.Description style={{ fontFamily: "Poppins" }}>
            <ScrollView style={{ maxHeight: 300 }}>
              <SizableText style={{ 
                fontFamily: "Poppins", 
                lineHeight: 20,
                color: "#5A5A4D",
                fontSize: 14
              }}>
                1. Acceptance of Terms{"\n\n"}
                By accessing and using this application, you accept and agree to
                be bound by the terms and provision of this agreement.{"\n\n"}
                2. Use License{"\n\n"}
                Permission is granted to temporarily download one copy of the
                application per device for personal, non-commercial transitory
                viewing only.{"\n\n"}
                3. User Account{"\n\n"}
                You are responsible for maintaining the confidentiality of your
                account and password.{"\n\n"}
                4. Privacy Policy{"\n\n"}
                Your use of this application is also governed by our Privacy
                Policy.{"\n\n"}
                5. Disclaimer{"\n\n"}
                The materials on this application are provided on an 'as is'
                basis.{"\n\n"}
                6. Limitations{"\n\n"}
                In no event shall this application or its suppliers be liable
                for any damages.{"\n\n"}
                7. Accuracy of Materials{"\n\n"}
                The materials appearing in this application could include
                technical, typographical, or photographic errors.{"\n\n"}
                8. Links{"\n\n"}
                This application has not reviewed all of the sites linked to its
                application and is not responsible for the contents of any such
                linked site.{"\n\n"}
                9. Modifications{"\n\n"}
                This application may revise these terms of service at any time
                without notice.{"\n\n"}
                10. Governing Law{"\n\n"}
                These terms and conditions are governed by and construed in
                accordance with the laws.
              </SizableText>
            </ScrollView>
          </Dialog.Description>
          <XStack space="$3" justifyContent="flex-end" marginTop={10}>
            <Button
              onPress={() => {
                setShowTerms(false);
                setTermsAccepted(true);
              }}
              backgroundColor="#4A7C59"
              borderRadius={20}
              width={100}
              style={{
                borderTopWidth: 0,
                borderRightWidth: 0,
                borderBottomWidth: 0,
                borderLeftWidth: 0,
              }}
            >
              <SizableText style={{ fontFamily: "Poppins", color: "white" }}>
                Accept
              </SizableText>
            </Button>
            <Button
              onPress={() => setShowTerms(false)}
              backgroundColor="#F7F5E6"
              borderRadius={20}
              width={100}
              style={{
                borderTopWidth: 1,
                borderRightWidth: 1,
                borderBottomWidth: 1,
                borderLeftWidth: 1,
                borderColor: "#000",
              }}
            >
              <SizableText style={{ fontFamily: "Poppins", color: "#5A5A4D" }}>
                Close
              </SizableText>
            </Button>
          </XStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, backgroundColor: "#fff" }}
      >
        <Navbar />
        <YStack
          padding={25}
          style={{ justifyContent: "center", alignItems: "flex-start" }}
          borderRadius={100}
        >
          <Button
            circular
            size="$2"
            background="#4A7C59"
            icon={<ArrowLeft size={20} color={"white"} />}
            onPress={() => router.push("/(drawer)/(tabs)")}
          />
        </YStack>
        <YStack padding={50} marginVertical={80}>
          <YStack space={10} justifyContent="center">
            <SizableText
              style={{ fontSize: 24, color: "#000", fontFamily: "Poppins" }}
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
              secureTextEntry
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
              secureTextEntry
              borderRadius={8}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <XStack space={10}>
              <SelectGender gender={gender} setGender={setGender} />
              {Platform.OS === "web" ? (
                <input
                  type="date"
                  style={{
                    flex: 1,
                    fontFamily: "Poppins",
                    backgroundColor: "#F7F5E6",
                    borderWidth: 1,
                    borderColor: "black",
                    borderRadius: 8,
                    padding: 10,
                    height: 40,
                  }}
                  value={
                    dob ? dob.split("-").reverse().join("-") : "2010-01-01"
                  }
                  onChange={(e) => {
                    const [year, month, day] = e.target.value.split("-");
                    setDob(`${day}-${month}-${year}`);
                  }}
                  max={new Date().toISOString().split("T")[0]}
                />
              ) : (
                <>
                  <Button
                    flex={1}
                    size="$3"
                    backgroundColor={"#F7F5E6"}
                    borderWidth={1}
                    borderColor="black"
                    borderRadius={8}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <SizableText
                      style={{
                        fontFamily: "Poppins",
                        color: dob ? "black" : "#0000006B",
                      }}
                    >
                      {dob || "Date Of Birth (DD-MM-YYYY)"}
                    </SizableText>
                  </Button>
                  {showDatePicker && (
                    <DateTimePicker
                      value={date}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) {
                          setDate(selectedDate);
                          const formattedDate = formatDate(selectedDate);
                          setDob(formattedDate);
                        }
                      }}
                      maximumDate={new Date()}
                    />
                  )}
                </>
              )}
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
            <XStack justifyContent="center" alignItems="center" space={10}>
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setShowTerms(true);
                  } else {
                    setTermsAccepted(false);
                  }
                }}
                size="$3"
              >
                <Checkbox.Indicator>
                  <Check size={16} />
                </Checkbox.Indicator>
              </Checkbox>
              <Label
                htmlFor="terms"
                style={{ fontFamily: "Poppins", color: "#5A5A4D" }}
              >
                I agree to the{" "}
                <SizableText
                  style={{
                    color: "#4A7C59",
                    textDecorationLine: "underline",
                    fontFamily: "Poppins",
                  }}
                  onPress={() => setShowTerms(true)}
                >
                  Terms & Conditions
                </SizableText>
              </Label>
            </XStack>
            {error ? (
              <SizableText style={{ color: "red", textAlign: "center" }}>
                {error}
              </SizableText>
            ) : null}

            <Button
              marginVertical={0}
              width={120}
              height={40}
              alignSelf="center"
              backgroundColor={"#4A7C59"}
              borderRadius={17}
              onPress={handleRegister}
            >
              <SizableText style={{ fontFamily: "Poppins", color: "white" }}>
                Register
              </SizableText>
            </Button>
            <XStack justifyContent="center" alignItems="center">
              <Button
                backgroundColor="transparent"
                onPress={() => router.push("/(drawer)/(tabs)/authentication/login")}
                style={{ fontFamily: "Poppins", fontSize: 13 }}
                marginVertical={40}
              >
                <SizableText style={{ color: "#4A7C59", fontFamily: "Poppins", fontSize: 13 }}>
                  Have an account? Login Now!
                </SizableText>
              </Button>
            </XStack>
          </YStack>
        </YStack>
        <TermsAndConditionsModal />
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
                  <Select.Item
                    index={i}
                    key={item.name}
                    value={item.name.toLowerCase()}
                  >
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
