import { SafeAreaView } from "react-native-safe-area-context";
import { YStack, SizableText, Button, ScrollView } from "tamagui";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  View,
} from "react-native";
import { Navbar } from "@/components/Navbar";
import { ArrowLeft } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import { useRef, useEffect } from "react";

const images = [
  require("../../../assets/images/newTenant1.png"),
  require("../../../assets/images/newTenant2.png"),
  require("../../../assets/images/newTenant3.png"),
];

const { width } = Dimensions.get("screen");

export default function NewTenant() {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList<any>>(null);

  /*useEffect(() => {
    let index = 0;
    let forward = true;

    const interval = setInterval(() => {
      if (forward) {
        index++;
        if (index >= images.length - 1) forward = false;
      } else {
        index--;
        if (index <= 0) forward = true;
      }

      flatListRef.current?.scrollToIndex({ index, animated: true });
    }, );

    return () => clearInterval(interval);
  }, []);*/

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <Navbar />
        <YStack paddingTop={25} paddingLeft={25}>
          <Button
            circular
            size="$2"
            background="#9BA88D"
            icon={<ArrowLeft size={20} color={"white"} />}
            onPress={() => router.back()}
          />
          <SizableText
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              fontSize: 30,
              color: "#9BA88D",
              fontFamily: "Poppins",
              fontWeight: "lighter",
              textAlign: "center",
              marginBottom: 6,
              marginTop: 25,
            }}
          >
            NOW OPEN
          </SizableText>
        </YStack>

        <YStack
          width={"auto"}
          height={"auto"}
          paddingHorizontal={28}
          space={2}
          paddingBottom={5}
          alignItems="center"
          justifyContent="center"
          paddingTop={8}
        >
          <SizableText
            style={{
              fontSize: 32,
              color: "#9BA88D",
              fontFamily: "Poppins",
              fontWeight: "600",
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            MONSIEUR SPOON!
          </SizableText>
        </YStack>

        {/* SLIDER */}
        <View style={styles.sliderContainer}>
          <View style={styles.sliderTop}>
            <FlatList
              ref={flatListRef}
              data={images}
              horizontal
              pagingEnabled
              snapToAlignment="center"
              decelerationRate="fast"
              snapToInterval={width - 90}
              initialScrollIndex={1.001}
              centerContent
              showsHorizontalScrollIndicator={false}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: animatedValue } } }],
                { useNativeDriver: false }
              )}
              keyExtractor={(_, index) => index.toString()}
              getItemLayout={(_, index) => ({
                length: width - 90,
                offset: (width - 90) * index,
                index,
              })}
              style={{ flexGrow: 0, width }}
              contentContainerStyle={{
                paddingHorizontal: 16,
              }}
              renderItem={({ item }) => (
                <View style={styles.imageWrapper}>
                  <Image source={item} style={styles.image} />
                </View>
              )}
            />
          </View>
          <View style={styles.dotsWrapper}>
            {images.map((_, index) => {
              const inputRange = [
                (index - 1) * width,
                index * width,
                (index + 1) * width,
              ];
              const dotColor = animatedValue.interpolate({
                inputRange,
                outputRange: ["#D9D9D9", "#9BA88D", "#D9D9D9"],
                extrapolate: "clamp",
              });
              return (
                <Animated.View
                  key={index}
                  style={[styles.dot, { backgroundColor: dotColor }]}
                />
              );
            })}
          </View>
        </View>

        <YStack
          space="$2"
          alignItems="center"
          paddingHorizontal={28}
          paddingTop={20}
        >
          <Button
            backgroundColor="#F7F5E6"
            borderRadius={18}
            paddingVertical={33}
            paddingHorizontal={35}
            marginTop={6}
            borderWidth={0.5}
            borderColor={"black"}
          >
            <SizableText
              color="black"
              fontSize={14}
              textAlign="center"
              style={{ fontFamily: "Poppins", lineHeight: 18 }}
            >
              <SizableText
                fontFamily="Poppins"
                fontSize={14}
                style={{ fontWeight: "bold" }}
              >
                Central Park Jakarta - TGF 16 Floor
              </SizableText>
              {"\n"}
              Jl. Letjen S. Parman, Tanjung Duren, Jakarta Barat
            </SizableText>
          </Button>

          <Button
            marginVertical={10}
            width={200}
            height={30}
            fontSize={24}
            alignSelf="center"
            backgroundColor="#9BA88D"
            borderRadius={25}
            marginTop={10}
            marginBottom={1}
          >
            <SizableText style={{ fontFamily: "Poppins", color: "white" }}>
              Show Mall Directory
            </SizableText>
          </Button>
        </YStack>

        <YStack paddingTop="$4" paddingHorizontal={40}>
          <SizableText
            size="$6"
            color="black"
            marginBottom={17}
            textAlign="justify"
            style={{ fontFamily: "Poppins" }}
          >
            Monsieur Spoon is a popular French bakery and café chain in
            Indonesia, known for its artisanal pastries, croissants, and
            high-quality coffee. Originally founded in Bali, it has expanded to
            several locations across the island, offering a cozy, Parisian-style
            ambiance. The bakery is particularly famous for its buttery, flaky
            croissants and authentic French bread, attracting both locals and
            tourists looking for a taste of France in Indonesia.
          </SizableText>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sliderContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  sliderTop: {
    height: 420,
    marginBottom: 10,
  },
  imageWrapper: {
    width: width - 90, // ✅ Lebih kecil dari screen
    marginHorizontal: 11,
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
    zIndex: 1,
  },
  image: {
    width: "100%",
    height: 420,
    borderRadius: 20,
    resizeMode: "cover",
  },
  dotsWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 7,
    backgroundColor: "#9BA88D",
    marginHorizontal: 6,
  },
});
