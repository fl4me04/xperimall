import { Menu, User2 } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { Button, SizableText, XStack } from "tamagui";

export function Navbar() {
  const buttonTap = () => {
    console.log("Button tapped");
  };

  const router = useRouter();

  return (
    <XStack
      padding={10}
      backgroundColor={"#A7C4A0"}
      width={"100%"}
      height={100}
      justifyContent="space-between"
      alignItems="flex-end"
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
        onPress={buttonTap}
        width={"auto"}
        height={"auto"}
        icon={Menu}
        backgroundColor="transparent"
      />
      <SizableText
        style={{
          justifyContent: "center",
          fontFamily: "LexendGiga",
          fontSize: 17,
          color: "white",
        }}
      >
        CENTRAL PARK JAKARTA
      </SizableText>
      <Button
        animation="bouncy"
        elevation="$4"
        hoverStyle={{
          scale: 1.05,
        }}
        pressStyle={{
          scale: 0.95,
        }}
        onPress={() => router.push("/authentication/login")}
        width={"auto"}
        height={"auto"}
        icon={User2}
        backgroundColor="transparent"
      />
    </XStack>
  );
}
