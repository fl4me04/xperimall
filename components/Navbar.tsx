import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Menu, User2 } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { Drawer } from "react-native-drawer-layout";
import { Button, SizableText, XStack } from "tamagui";
import { Dimensions, StyleSheet } from "react-native";

export function Navbar() {
  const { width } = Dimensions.get("window"); // Get screen width
  const isSmallScreen = width < 600; // Define a breakpoint for responsiveness

  const buttonTap = () => {
    console.log("Button tapped");
  };

  const navigation = useNavigation();

  const router = useRouter();

  return (
    <XStack
      padding={isSmallScreen ? 5 : 10} // Adjust padding based on screen size
      backgroundColor={"#A7C4A0"}
      width={"100%"}
      height={isSmallScreen ? 80 : 100} // Adjust height based on screen size
      justifyContent="center"
      alignItems="flex-end"
      position="relative"
    >
      <Button
        animation="bouncy"
        elevation="$4"
        hoverStyle={{
          scale: 1.05,
        }}
        pressStyle={{
          scale: 0.95,
        }}
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        width={"auto"}
        height={"auto"}
        icon={<Menu color="white" />}
        backgroundColor="transparent"
        style={{
          position: "absolute",
          left: 10,
        }}
      />
      <SizableText
        style={{
          fontFamily: "LexendGiga",
          fontSize: isSmallScreen ? 14 : 17, // Adjust font size based on screen size
          color: "white",
        }}
      >
        CENTRAL PARK JAKARTA
      </SizableText>
    </XStack>
  );
}