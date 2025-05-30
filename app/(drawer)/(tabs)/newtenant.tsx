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
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useEffect, useState } from "react";

const tenantImages = {
  1: [
    require("../../../assets/images/MonsieurSpoon1.jpg"),
    require("../../../assets/images/MonsieurSpoon2.jpg"),
    require("../../../assets/images/MonsieurSpoon3.jpg"),
  ],
  2: [
    require("../../../assets/images/SushiTei1.png"),
    require("../../../assets/images/SushiTei2.png"),
    require("../../../assets/images/SushiTei3.png"),
  ],
  3: [
    require("../../../assets/images/CoffeeBeanTea1.png"),
    require("../../../assets/images/CoffeeBeanTea2.png"),
    require("../../../assets/images/CoffeeBeanTea3.png"),
  ],
  4: [
    require("../../../assets/images/HM1.png"),
    require("../../../assets/images/HM2.png"),
    require("../../../assets/images/HM3.png"),
  ],
};

const { width, height } = Dimensions.get("screen");

interface Tenant {
  id: number;
  name: string;
  description: string;
  location: string;
  floor_id: number;
}

export default function NewTenant() {
  const { id } = useLocalSearchParams();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList<any>>(null);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const response = await fetch(`https://xperimall-backend.onrender.com/api/tenants/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch tenant');
        }
        const data = await response.json();
        setTenant(data);
      } catch (error) {
        console.error('Error fetching tenant:', error);
      }
    };

    fetchTenant();
  }, [id]);

  if (!tenant) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <Navbar />
        <YStack flex={1} justifyContent="center" alignItems="center">
          <SizableText>Loading...</SizableText>
        </YStack>
      </SafeAreaView>
    );
  }

  const currentImages = tenantImages[tenant.id as keyof typeof tenantImages] || tenantImages[1];

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
                  fontSize: 20,
                  color: "#2B4433",
                  letterSpacing: 1,
                  alignSelf: "center",
                }}
              >
                {tenant.name}!
              </SizableText>
            </YStack>
          </XStack>
          <YStack>
            <View style={styles.sliderContainer}>
              <View style={styles.sliderTop}>
                <FlatList
                  ref={flatListRef}
                  data={currentImages}
                  horizontal
                  pagingEnabled
                  snapToAlignment="center"
                  decelerationRate="fast"
                  snapToInterval={width * 0.8}
                  initialScrollIndex={0}
                  centerContent
                  showsHorizontalScrollIndicator={false}
                  onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: animatedValue } } }],
                    { useNativeDriver: false }
                  )}
                  keyExtractor={(_, index) => index.toString()}
                  getItemLayout={(_, index) => ({
                    length: width * 0.8,
                    offset: width * 0.8 * index,
                    index,
                  })}
                  style={{ flexGrow: 0, width: width }}
                  contentContainerStyle={{
                    paddingHorizontal: (width - width * 0.8) / 2,
                  }}
                  renderItem={({ item }) => (
                    <View style={[styles.imageWrapper, { width: width * 0.8, overflow: 'hidden' }]}>
                      <Image source={item} style={styles.image} />
                    </View>
                  )}
                />
              </View>
              <View style={styles.dotsWrapper}>
                {currentImages.map((_, index) => {
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
              Central Park Jakarta - {tenant.location}
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
              {tenant.description}
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
    alignItems: "center",
    justifyContent: "center",
  },
  imageWrapper: {
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
