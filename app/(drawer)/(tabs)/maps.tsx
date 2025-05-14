import { Navbar } from "@/components/Navbar";
import {
  ArrowLeft,
  Check,
  ChevronDown,
} from "@tamagui/lucide-icons";
import { router } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, Image, Dimensions } from "react-native";
import {
  Button,
  Select,
  SelectProps,
  SizableText,
  XStack,
  YStack,
} from "tamagui";

export default function TabTwoScreen() {
  const [selectedImage, setSelectedImage] = React.useState(
    require("../../../assets/images/lowerGroundFloor.png")
  );

  const screenWidth = Dimensions.get("window").width; // Get screen width
  const screenHeight = Dimensions.get("window").height; // Get screen height

  const handleFloorChange = (floor: string) => {
    const floorImages: Record<string, any> = {
      "lower ground floor": require("../../../assets/images/lowerGroundFloor.png"),
      "lower ground mezzanine floor": require("../../../assets/images/lowerGroundMezzanine.png"),
      "ground floor": require("../../../assets/images/groundFloor.png"),
      "upper ground floor": require("../../../assets/images/upperGroundFloor.png"),
      "1st floor": require("../../../assets/images/1stFloor.png"),
      "2nd floor": require("../../../assets/images/2ndFloor.png"),
      "3rd floor": require("../../../assets/images/3rdFloor.png"),
    };

    setSelectedImage(floorImages[floor] || null);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Navbar />
        <YStack width={"100%"} height={"auto"} padding={screenWidth * 0.05} flex={1}>
          <XStack
            alignItems="flex-start"
            position="relative"
            justifyContent="center"
            height={screenHeight * 0.08}
          >
            <Button
              circular
              size="$2"
              background="#9BA88D"
              icon={<ArrowLeft size={20} color={"white"} />}
              onPress={() => router.push("/(drawer)/(tabs)")}
              style={{
                position: "absolute",
                left: 0,
              }}
            />
          </XStack>
          <YStack flex={1} justifyContent="center" alignItems="center">
            <YStack flex={1} justifyContent="center" alignItems="center">
              <YStack>
                <SizableText
                  style={{
                    fontWeight: "500",
                    fontSize: screenWidth * 0.08, // Responsive font size
                    color: "#9BA88D",
                  }}
                >
                  Map
                </SizableText>
              </YStack>
            </YStack>

            <YStack justifyContent="center" alignItems="center">
              <Image
                source={selectedImage}
                style={{
                  width: screenWidth * 0.9, // 90% of screen width
                  height: screenWidth * 0.9 * 0.75, // Maintain aspect ratio (4:3)
                  resizeMode: "contain",
                }}
              />
            </YStack>

            <YStack flex={1} justifyContent="center" alignItems="center">
              <XStack width={"100%"} gap={screenWidth * 0.02}>
                <SelectDemoItem
                  id="select-demo-1"
                  onFloorChange={handleFloorChange}
                />
              </XStack>
            </YStack>
          </YStack>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}

export function SelectDemoItem(
  props: SelectProps & { onFloorChange: (floor: string) => void }
) {
  const [val, setVal] = React.useState("lower ground floor");

  const handleValueChange = (value: string) => {
    setVal(value);
    props.onFloorChange(value);
  };

  const screenWidth = Dimensions.get("window").width; // Get screen width

  return (
    <Select
      value={val}
      onValueChange={handleValueChange}
      disablePreventBodyScroll
      {...props}
    >
      <Select.Trigger
        maxWidth={screenWidth * 0.6} // 60% of screen width
        iconAfter={ChevronDown}
        style={{
          backgroundColor: "#F8F6E8",
          borderRadius: 25,
          paddingHorizontal: screenWidth * 0.04, // Responsive padding
          paddingVertical: screenWidth * 0.02,
          borderWidth: 1,
          borderColor: "#D6D6C2",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <Select.Value
          style={{
            color: "#5A5A4D",
            fontWeight: "600",
            fontSize: screenWidth * 0.04, // Responsive font size
          }}
        />
      </Select.Trigger>

      <Select.Content zIndex={200000}>
        <Select.Viewport
          style={{
            padding: screenWidth * 0.02,
            backgroundColor: "#F8F6E8",
          }}
        >
          <Select.Group>
            <Select.Label
              style={{
                backgroundColor: "transparent",
                fontSize: screenWidth * 0.035, // Responsive font size
                fontWeight: "600",
                color: "#fff",
                marginBottom: screenWidth * 0.02,
              }}
            >
              Select Floor
            </Select.Label>
            {items.map((item, i) => (
              <Select.Item
                index={i}
                key={item.name}
                value={item.name.toLowerCase()}
                style={{
                  paddingVertical: screenWidth * 0.02,
                  paddingHorizontal: screenWidth * 0.04,
                  borderRadius: 15,
                  backgroundColor:
                    val === item.name.toLowerCase() ? "#A7C4A0" : "transparent",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Select.ItemText
                  style={{
                    color: "#5A5A4D",
                    fontWeight: "500",
                    fontSize: screenWidth * 0.04, // Responsive font size
                  }}
                >
                  {item.name}
                </Select.ItemText>
                <Select.ItemIndicator marginLeft="auto">
                  <Check size={16} color="#5A5A4D" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Viewport>
      </Select.Content>
    </Select>
  );
}

const items = [
  { name: "Lower Ground Floor" },
  { name: "Lower Ground Mezzanine Floor" },
  { name: "Ground Floor" },
  { name: "Upper Ground Floor" },
  { name: "1st Floor" },
  { name: "2nd Floor" },
  { name: "3rd Floor" },
];