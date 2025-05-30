import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Menu } from "@tamagui/lucide-icons";
import { Button, SizableText, XStack } from "tamagui";
import { Dimensions } from "react-native";

export function Navbar() {
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
        chromeless
        style={{
          position: "absolute",
          left: 10,
          bottom: 10,
          zIndex: 1,
        }}
      />
      <SizableText
        flex={1}
        textAlign="center"
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