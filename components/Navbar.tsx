import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Menu, User2 } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { Drawer } from "react-native-drawer-layout";
import { Button, SizableText, XStack } from "tamagui";
import { Dimensions, StyleSheet } from "react-native";

export function Navbar() {
  const { width } = Dimensions.get("window");

  const buttonTap = () => {
    console.log("Button tapped");
  };

  const navigation = useNavigation();

  return (
    <XStack
      padding={10}
      backgroundColor={"#4A7C59"}
      width={"100%"}
      height={100}
      justifyContent="center"
      alignItems="flex-end"
      position="absolute"
      top={0}
      left={0}
      right={0}
      zIndex={100}
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
          fontSize: 17,
          color: "white",
        }}
      >
        CENTRAL PARK JAKARTA
      </SizableText>
    </XStack>
  );
}
