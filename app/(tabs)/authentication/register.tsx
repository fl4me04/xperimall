import React from "react";
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
              placeholder="Enter your E-mail"
              fontFamily={"Poppins"}
              backgroundColor={"#F7F5E6"}
              borderWidth={1}
              borderColor="black"
              borderRadius={8}
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
            />
            <XStack space={10}>
              <SelectGender />
              <Input
                flex={1}
                size="$3"
                placeholder="Date of Birth"
                fontFamily={"Poppins"}
                backgroundColor={"#F7F5E6"}
                borderWidth={1}
                borderColor="black"
                borderRadius={8}
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
            />
            <XStack justifyContent="center" alignItems="center">
              <CheckboxWithLabel size="$3" />
            </XStack>
            <Button
              marginVertical={0}
              width={120}
              height={40}
              alignSelf="center"
              backgroundColor={"#9BA88D"}
              borderRadius={17}
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

export function SelectGender(props: SelectProps) {
  const [val, setVal] = React.useState("");

  return (
    <Select
      value={val}
      onValueChange={setVal}
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
          color={val ? "black" : "#0000006B"}
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
        <Select.Viewport
          // to do animations:
          // animation="quick"
          // animateOnly={['transform', 'opacity']}
          // enterStyle={{ o: 0, y: -10 }}
          // exitStyle={{ o: 0, y: 10 }}
          minWidth={200}
        >
          <Select.Group>
            <Select.Label>Genders</Select.Label>
            {/* for longer lists memoizing these is useful */}
            {React.useMemo(
              () =>
                Genders.map((item, i) => {
                  return (
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
                  );
                }),
              [Genders]
            )}
          </Select.Group>
          {/* Native gets an extra icon */}
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
