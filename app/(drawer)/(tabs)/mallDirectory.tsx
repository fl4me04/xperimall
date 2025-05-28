import { Navbar } from "@/components/Navbar";
import { ArrowLeft } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  ScrollView,
  SizableText,
  Text,
  View,
  XStack,
  YStack,
} from "tamagui";
import { AntDesign } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";

const { width, height } = Dimensions.get("window");

const foodList = [
  "Auntie Anne’s",
  "Bakmi GM",
  "Beard Papa’s",
  "Baskin Robbins",
  "Chatime",
  "Cold Stone",
  "HokBen",
  "J.CO Donuts & Coffee",
  "Krispy Kreme",
  "Pepper Lunch Express",
  "Shihlin Taiwan Street Snacks",
  "Starbucks",
];

const fashionList = [
  "Adidas",
  "H&M",
  "Zara",
  "Uniqlo",
  "Nike",
  "Pull&Bear",
  "Stradivarius",
  "Mango",
  "Victoria’s Secret",
  "Sephora",
];

export default function mallDirectory() {
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
            marginBottom={width * 0.02}
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
              }}
            />
            <XStack marginLeft={25}>
              <DropdownComponent />
            </XStack>
          </XStack>
          <YStack space={10} justifyContent="center">
            <XStack
              width={width * 0.5}
              style={{
                backgroundColor: "#4A7C59",
                padding: 7,
                borderRadius: 20,
                borderWidth: 1.4,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <SizableText
                style={{ fontSize: 20, color: "#fff", fontWeight: "500" }}
              >
                Food & Beverages
              </SizableText>
            </XStack>
            <YStack space={5} padding={10} marginTop={-10}>
              {foodList.map((item, index) => (
                <SizableText
                  key={index}
                  style={{
                    fontSize: 17,
                    fontFamily: "Poppins",
                    fontWeight: "500",
                    color: "#2B4433",
                  }}
                >
                  • {item}
                </SizableText>
              ))}
            </YStack>
          </YStack>
          <YStack space={10} justifyContent="center">
            <XStack
              width={width * 0.5}
              style={{
                backgroundColor: "#4A7C59",
                padding: 7,
                borderRadius: 20,
                borderWidth: 1.4,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <SizableText
                style={{ fontSize: 20, color: "#fff", fontWeight: "500" }}
              >
                Fashion
              </SizableText>
            </XStack>
            <YStack space={5} padding={10} marginTop={-10}>
              {fashionList.map((item, index) => (
                <SizableText
                  key={index}
                  style={{
                    fontSize: 17,
                    fontFamily: "Poppins",
                    fontWeight: "500",
                    color: "#2B4433",
                  }}
                >
                  • {item}
                </SizableText>
              ))}
            </YStack>
          </YStack>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}

const data = [
  { label: "Lower Ground", value: "1" },
  { label: "Lower Ground Mezzanine", value: "2" },
  { label: "Ground Floor", value: "3" },
  { label: "Upper Ground Floor", value: "4" },
  { label: "1st Floor", value: "5" },
  { label: "2nd Floor", value: "6" },
  { label: "3rd Floor", value: "7" },
];

const DropdownComponent = () => {
  const [value, setValue] = useState(null);

  interface DropdownItem {
    label: string;
    value: string;
  }

  interface RenderItemProps {
    item: DropdownItem;
  }

  const renderItem = (item: DropdownItem) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
        {item.value === value && (
          <AntDesign style={styles.icon} color="black" name="check" size={20} />
        )}
      </View>
    );
  };

  return (
    <Dropdown
      style={styles.dropdown}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      iconStyle={styles.iconStyle}
      data={data}
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder="Select Floor"
      value={value}
      onChange={(item) => {
        setValue(item.value);
      }}
      // renderLeftIcon={() => (
      //   <AntDesign
      //     style={styles.icon}
      //     color="#2B4433"
      //     name="infocirlce"
      //     size={28}
      //   />
      // )}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  dropdown: {
    margin: 16,
    width: width * 0.6,
    height: 50,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
  },
  icon: {
    marginRight: 12,
  },
  item: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textItem: {
    flex: 1,
    fontSize: 18,
    fontFamily: "Poppins",
    color: "#2B4433",
  },
  placeholderStyle: {
    fontSize: 28,
    fontFamily: "Poppins",
    color: "#2B4433",
    fontWeight: "600",
  },
  selectedTextStyle: {
    fontSize: 28,
    fontFamily: "Poppins",
    color: "#2B4433",
    fontWeight: "600",
  },
  iconStyle: {
    width: 30,
    height: 30,
  },
});
