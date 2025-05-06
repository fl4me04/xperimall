import { defaultConfig } from "@tamagui/config/v4";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { createTamagui, TamaguiProvider } from "tamagui";

const config = createTamagui(defaultConfig);

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Poppins: require("../assets/fonts/Poppins-Medium.ttf"),
    LexendGiga: require("../assets/fonts/LexendGiga-ExtraLight.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <TamaguiProvider config={config}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(drawer)" />
        {/* <Stack.Screen
          name="authentication/login"
          options={{ presentation: "modal" }}
        /> */}
      </Stack>
      <StatusBar style="auto" />
    </TamaguiProvider>
  );
}
