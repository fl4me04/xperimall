import { useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Platform, Modal, View, Dimensions } from "react-native";
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
import React from "react";

const { width, height } = Dimensions.get("window");

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
  const [showSuccessDialog, setShowSuccessDialog] = React.useState(false);

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

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleRegister = async () => {
    setError("");

    if (name.length < 4) {
      setError("Name must be at least 4 characters long");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters long and contain at least one number");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    const age = calculateAge(date);
    if (age < 13) {
      setError("You must be at least 13 years old to register");
      return;
    }

    if (!termsAccepted) {
      setError("Please accept the Terms & Conditions");
      return;
    }

    if (!name || !email || !password || !confirmPassword || !gender || !dob) {
      setError("All fields are required!");
      return;
    }

    const formattedDob = parseDate(dob);
    if (!formattedDob) {
      setError("Invalid date format! Use DD-MM-YYYY.");
      return;
    }

    try {
      const response = await fetch(
        "https://xperimall-backend.onrender.com/authentication/register",
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
        if (data.message && data.message.toLowerCase().includes("Duplicate entry")) {
          setError("Email already exists!");
        } else {
          throw new Error(data.message || "Registration failed");
        }
        return;
      }

      setShowSuccessDialog(true);
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
            backgroundColor: "#2B4433",
            borderRadius: 20,
            padding: 20,
            width: "90%",
            maxWidth: 400,
            maxHeight: "80%",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: [
              { translateX: -width * 0.45 },
              { translateY: -height * 0.4 },
            ],
          }}
        >
          <Dialog.Title
            style={{
              fontFamily: "Inter",
              color: "#fff",
              fontSize: 20,
              fontWeight: "700",
              marginBottom: 10,
              textAlign: "center",
            }}
          >
            Terms and Conditions
          </Dialog.Title>
          <ScrollView
            style={{
              maxHeight: height * 0.5,
              marginBottom: 10,
            }}
            showsVerticalScrollIndicator={true}
          >
            <YStack space={10}>
              <SizableText
                style={{
                  fontFamily: "Inter",
                  lineHeight: 24,
                  color: "#fff",
                  fontSize: 14,
                }}
              >
                1. Acceptance of Terms{"\n"}
                By accessing and using this application, you accept and agree to
                be bound by the terms and provision of this agreement.{"\n\n"}
                2. Use License{"\n"}
                Permission is granted to temporarily download one copy of the
                application per device for personal, non-commercial transitory
                viewing only.{"\n\n"}
                3. User Account{"\n"}
                You are responsible for maintaining the confidentiality of your
                account and password.{"\n\n"}
                4. Privacy Policy{"\n"}
                Your use of this application is also governed by our Privacy
                Policy.{"\n\n"}
                5. Disclaimer{"\n"}
                The materials on this application are provided on an 'as is'
                basis.{"\n\n"}
                6. Limitations{"\n"}
                In no event shall this application or its suppliers be liable
                for any damages.{"\n\n"}
                7. Accuracy of Materials{"\n"}
                The materials appearing in this application could include
                technical, typographical, or photographic errors.{"\n\n"}
                8. Links{"\n"}
                This application has not reviewed all of the sites linked to its
                application and is not responsible for the contents of any such
                linked site.{"\n\n"}
                9. Modifications{"\n"}
                This application may revise these terms of service at any time
                without notice.{"\n\n"}
                10. Governing Law{"\n"}
                These terms and conditions are governed by and construed in
                accordance with the laws.
              </SizableText>
            </YStack>
          </ScrollView>
          <XStack space="$3" justifyContent="center" marginTop={10}>
            <Button
              onPress={() => {
                setShowTerms(false);
                setTermsAccepted(true);
              }}
              backgroundColor="#4A7C59"
              borderRadius={20}
              width={100}
              style={{
                borderWidth: 0,
              }}
            >
              <SizableText style={{ fontFamily: "Inter", color: "white" }}>
                Accept
              </SizableText>
            </Button>
            <Button
              onPress={() => setShowTerms(false)}
              backgroundColor="#F7F5E6"
              borderRadius={20}
              width={100}
              style={{
                borderWidth: 1,
                borderColor: "#000",
              }}
            >
              <SizableText style={{ fontFamily: "Inter", color: "#5A5A4D" }}>
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
            // marginBottom={width * 0.01}
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
                zIndex: 10,
                pointerEvents: "auto",
              }}
            />
          </XStack>
          <YStack padding={25}>
            <YStack space={15} justifyContent="center">
              <SizableText
                width={width * 0.9}
                alignSelf="center"
                style={{
                  fontSize: Math.min(23, width * 0.055),
                  lineHeight: Math.min(23, width * 0.055) * 1.3,
                  color: "#2B4433",
                  fontFamily: "Inter",
                  flexWrap: "wrap",
                  flexShrink: 1,
                  textAlign: "center",
                }}
              >
                Sign Up
              </SizableText>
              <YStack space={10}>
                <Input
                  flex={1}
                  placeholder="Enter your Name"
                  style={{
                    width: "100%",
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#000",
                    padding: 10,
                    backgroundColor: "#F7F5E6",
                    fontFamily: "Inter",
                  }}
                  value={name}
                  onChangeText={setName}
                />
                <Input
                  flex={1}
                  placeholder="Enter your E-mail"
                  style={{
                    width: "100%",
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#000",
                    padding: 10,
                    backgroundColor: "#F7F5E6",
                    fontFamily: "Inter",
                  }}
                  value={email}
                  onChangeText={setEmail}
                />
                <Input
                  flex={1}
                  placeholder="Enter your Password"
                  style={{
                    width: "100%",
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#000",
                    padding: 10,
                    backgroundColor: "#F7F5E6",
                    fontFamily: "Inter",
                  }}
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
                <Input
                  flex={1}
                  placeholder="Re-enter your Password"
                  style={{
                    width: "100%",
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#000",
                    padding: 10,
                    backgroundColor: "#F7F5E6",
                    fontFamily: "Inter",
                  }}
                  secureTextEntry
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
                        fontFamily: "Inter",
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
                            fontFamily: "Inter",
                            color: dob ? "black" : "#0000006B",
                          }}
                        >
                          {dob || "Date Of Birth"}
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
                  placeholder="Referral Code (Optional)"
                  style={{
                    width: "100%",
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: "#000",
                    padding: 10,
                    backgroundColor: "#F7F5E6",
                    fontFamily: "Inter",
                  }}
                  value={referralCode}
                  onChangeText={setReferralCode}
                />
              </YStack>
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
                  style={{ fontFamily: "Inter", color: "#5A5A4D" }}
                >
                  I agree to the{" "}
                  <SizableText
                    style={{
                      color: "#4A7C59",
                      textDecorationLine: "underline",
                      fontFamily: "Inter",
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
                <SizableText style={{ fontFamily: "Inter", color: "white" }}>
                  Register
                </SizableText>
              </Button>
              <XStack justifyContent="center" alignItems="center">
                <Button
                  backgroundColor="transparent"
                  onPress={() =>
                    router.push("/(drawer)/(tabs)/authentication/login")
                  }
                  style={{ fontFamily: "Inter", fontSize: 13 }}
                  marginVertical={30}
                >
                  <SizableText
                    style={{
                      color: "#2B4433",
                      fontFamily: "Inter",
                      fontSize: 13,
                    }}
                  >
                    Have an account? Login Now!
                  </SizableText>
                </Button>
              </XStack>
            </YStack>
          </YStack>
          <TermsAndConditionsModal />
        </YStack>

        <Dialog
          modal
          open={showSuccessDialog}
          onOpenChange={(open) => {
            setShowSuccessDialog(open);
            if (!open) {
              router.push("/authentication/login");
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
                Registration Successful
              </Dialog.Title>
              <Dialog.Description
                style={{
                  fontFamily: "Inter",
                  color: "#fff",
                  fontSize: 16,
                  marginBottom: 10,
                }}
              >
                Your account has been created successfully!
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
                    Login
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
          style={{ fontFamily: "Inter", fontSize: 13 }}
        />
      </Select.Trigger>

      <Adapt platform="native">
        <Sheet
          native={!!props.native}
          modal
          dismissOnSnapToBottom
          snapPoints={[25]}
          position={0}
          zIndex={100000}
        >
          <Sheet.Frame padding="$4">
            <Sheet.Handle />
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
            <Select.Label style={{ fontFamily: "Inter", color: "#2B4433" }}>Select Gender</Select.Label>
            {React.useMemo(
              () =>
                Genders.map((item, i) => (
                  <Select.Item
                    index={i}
                    key={item.name}
                    value={item.name.toLowerCase()}
                  >
                    <Select.ItemText style={{ fontFamily: "Inter" }}>{item.name}</Select.ItemText>
                    <Select.ItemIndicator marginLeft="auto">
                      <Check size={16} color="#4A7C59" />
                    </Select.ItemIndicator>
                  </Select.Item>
                )),
              [Genders]
            )}
          </Select.Group>
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

      <Label size={size} htmlFor={id} style={{ fontFamily: "Inter" }}>
        {label}
      </Label>
    </XStack>
  );
}
