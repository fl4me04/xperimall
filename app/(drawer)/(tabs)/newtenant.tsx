import { SafeAreaView } from "react-native-safe-area-context";
import { YStack, SizableText, Button, ScrollView, XStack } from "tamagui";
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
import { useRef } from "react";

const images = [
  require("../../../assets/images/MonsieurSpoon1.jpg"),
  require("../../../assets/images/MonsieurSpoon2.jpg"),
  require("../../../assets/images/MonsieurSpoon3.jpg"),
];

const { width, height } = Dimensions.get("screen");

export default function NewTenant() {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList<any>>(null);

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
            // marginBottom={width * 0.01}
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
            <YStack space={10} justifyContent="center" alignItems="center">
              <SizableText
                style={{
                  fontFamily: "Poppins",
                  fontWeight: "100",
                  fontSize: 28,
                  color: "#2B4433",
                  letterSpacing: 1,
                  alignSelf: "center",
                }}
              >
                Now Open
              </SizableText>
              <SizableText
                style={{
                  fontFamily: "Poppins",
                  fontWeight: "700",
                  fontSize: 28,
                  color: "#2B4433",
                  letterSpacing: 1,
                  alignSelf: "center",
                }}
              >
                Monsieur Spoon!
              </SizableText>
            </YStack>
          </XStack>
          <YStack>
            <View style={styles.sliderContainer}>
              <View style={styles.sliderTop}>
                <FlatList
                  ref={flatListRef}
                  data={images}
                  horizontal
                  pagingEnabled
                  snapToAlignment="center"
                  decelerationRate="fast"
                  snapToInterval={width - 60}
                  initialScrollIndex={1}
                  centerContent
                  showsHorizontalScrollIndicator={false}
                  onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: animatedValue } } }],
                    { useNativeDriver: false }
                  )}
                  keyExtractor={(_, index) => index.toString()}
                  getItemLayout={(_, index) => ({
                    length: width - 60,
                    offset: (width - 60) * index,
                    index,
                  })}
                  style={{ flexGrow: 0, width }}
                  contentContainerStyle={{
                    paddingHorizontal: 31.6,
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
                    outputRange: ["#D9D9D9", "#4A7C59", "#D9D9D9"],
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
          </YStack>
          <YStack
            marginTop={10}
            justifyContent="center"
            alignItems="center"
            style={{
              backgroundColor: "#4A7C59",
              padding: 10,
              borderRadius: 15,
              borderWidth: 1.4,
            }}
          >
            <SizableText
              style={{
                fontSize: 15,
                fontFamily: "Poppins",
                color: "#fff",
                textAlign: "center",
              }}
            >
              Central Park Jakarta - TGF 16 Floor
            </SizableText>
            <SizableText
              style={{
                fontSize: 15,
                fontFamily: "Poppins",
                color: "#fff",
                textAlign: "center",
              }}
            >
              Jl. Letjen S. Parman, Tanjung Duren, Jakarta Barat
            </SizableText>
          </YStack>
          <YStack justifyContent="center" alignItems="center">
            <Button
              height={height * 0.05}
              width={width * 0.5}
              backgroundColor={"#2B4433"}
              borderRadius={"$10"}
              onPress={() => router.push("/(drawer)/(tabs)/mallDirectory")}
            >
              <SizableText
                color="white"
                fontSize={"$4"}
                style={{ fontFamily: "Poppins" }}
              >
                Show Mall Directory
              </SizableText>
            </Button>
          </YStack>
          <YStack marginTop={10} marginBottom={20}>
            <SizableText
              style={{
                fontSize: 15,
                fontFamily: "Poppins",
                color: "#000",
                textAlign: "justify",
              }}
            >
              Monsieur Spoon is a popular French bakery and café chain in
              Indonesia, known for its artisanal pastries, croissants, and
              high-quality coffee. Originally founded in Bali, it has expanded
              to several locations across the island, offering a cozy,
              Parisian-style ambiance. The bakery is particularly famous for its
              buttery, flaky croissants and authentic French bread, attracting
              both locals and tourists looking for a taste of France in
              Indonesia. With a commitment to using premium ingredients and
              traditional baking techniques, Monsieur Spoon has become a go-to
              spot for breakfast, brunch, and indulgent desserts.
            </SizableText>
          </YStack>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sliderContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  sliderTop: {
    height: 420,
    marginBottom: 15,
  },
  imageWrapper: {
    width: width - 60,
    marginHorizontal: 31.2,
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
