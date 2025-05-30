import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Menu } from "@tamagui/lucide-icons";
import { Button, SizableText, XStack } from "tamagui";
import { Dimensions } from "react-native";

export function Navbar() {
  const navigation = useNavigation();
  const { width, height } = Dimensions.get("window");

  // Responsive values
  const padding = Math.max(10, width * 0.025);
  const navHeight = Math.max(60, height * 0.12);
  const fontSize = Math.max(15, width * 0.045);
  const buttonLeft = Math.max(10, width * 0.025);
  const buttonBottom = Math.max(10, navHeight * 0.1);

  return (
    <XStack
      padding={padding}
      backgroundColor={"#4A7C59"}
      width={"100%"}
      height={navHeight}
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
          left: buttonLeft,
          bottom: buttonBottom,
          zIndex: 1,
        }}
      />
      <SizableText
        flex={1}
        textAlign="center"
        style={{
          fontFamily: "LexendGiga",
          fontSize: fontSize,
          color: "white",
        }}
      >
        CENTRAL PARK JAKARTA
      </SizableText>
    </XStack>
  );
}
