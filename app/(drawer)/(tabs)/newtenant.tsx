import { SafeAreaView } from "react-native-safe-area-context";
import { YStack, SizableText, Button, ScrollView, XStack } from "tamagui";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  View,
  NativeScrollEvent, // Ditambahkan
  NativeSyntheticEvent, // Ditambahkan
} from "react-native";
import { Navbar } from "@/components/Navbar"; // Pastikan path ini benar
import { ArrowLeft } from "@tamagui/lucide-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useEffect, useState } from "react";
import React from "react";

const { width, height } = Dimensions.get("window");

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

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

const ACTUAL_ITEM_WIDTH = screenWidth * 0.8;
const SPACE_BETWEEN_ITEMS = 16;
const TOTAL_ITEM_WIDTH_FOR_SNAP = ACTUAL_ITEM_WIDTH + SPACE_BETWEEN_ITEMS;

// Konfigurasi Auto Scroll
const AUTOSCROLL_DELAY = 4000; // Jeda waktu per slide (ms)
const USER_INTERACTION_RESUME_DELAY = 6000; // Jeda sebelum auto scroll aktif lagi setelah interaksi user (ms)

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

  const [currentIndex, setCurrentIndex] = useState(0); // State untuk indeks aktif
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const resumeScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const response = await fetch(
          `https://xperimall-backend.onrender.com/api/tenants/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch tenant");
        }
        const data = await response.json();
        setTenant(data);
      } catch (error) {
        console.error("Error fetching tenant:", error);
      }
    };

    fetchTenant();
  }, [id]);

  const currentImages = tenant
    ? tenantImages[tenant.id as keyof typeof tenantImages] || tenantImages[1]
    : [];

  const middleIndex =
    currentImages.length > 0 ? Math.floor(currentImages.length / 2) : 0;

  // Scroll to middle when images or tenant change
  useEffect(() => {
    if (currentImages.length > 0 && flatListRef.current) {
      setCurrentIndex(middleIndex);
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: middleIndex,
          animated: false,
        });
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenant, currentImages.length]);

  const stopAutoScroll = () => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
    if (resumeScrollTimeoutRef.current) {
      clearTimeout(resumeScrollTimeoutRef.current);
      resumeScrollTimeoutRef.current = null;
    }
  };

  const startAutoScroll = () => {
    stopAutoScroll(); // Hapus timer yang mungkin sudah ada
    if (currentImages.length <= 1) return; // Tidak perlu auto scroll jika gambar hanya 1 atau kurang

    intervalIdRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % currentImages.length;
        if (flatListRef.current) {
          flatListRef.current.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
        }
        return nextIndex;
      });
    }, AUTOSCROLL_DELAY);
  };

  useEffect(() => {
    // Mulai auto scroll jika ada tenant dan lebih dari 1 gambar
    if (tenant && currentImages.length > 1) {
      startAutoScroll();
    }
    // Cleanup function: dipanggil saat komponen unmount atau dependensi berubah
    return () => {
      stopAutoScroll();
    };
  }, [tenant, currentImages.length]); // Dependensi: auto scroll dimulai/diupdate jika tenant atau jumlah gambar berubah

  const onScrollBeginDrag = () => {
    stopAutoScroll(); // Hentikan auto scroll saat pengguna mulai drag manual
  };

  const onMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    // Hitung indeks baru berdasarkan posisi scroll, pastikan tidak keluar batas
    const newCalculatedIndex = Math.round(offsetX / TOTAL_ITEM_WIDTH_FOR_SNAP);
    const newIndex = Math.max(
      0,
      Math.min(currentImages.length - 1, newCalculatedIndex)
    );

    setCurrentIndex(newIndex); // Update state currentIndex

    // Jadwalkan auto scroll untuk dimulai lagi setelah jeda
    if (resumeScrollTimeoutRef.current)
      clearTimeout(resumeScrollTimeoutRef.current);
    resumeScrollTimeoutRef.current = setTimeout(() => {
      startAutoScroll();
    }, USER_INTERACTION_RESUME_DELAY);
  };

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Navbar />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: "#fff",
          paddingTop: 80,
        }}
      >
        <YStack
          width={"auto"}
          height={"auto"}
          padding={screenWidth * 0.07}
          space={screenWidth * 0.03}
          paddingBottom={screenWidth * 0.01}
        >
          <XStack
            alignItems="center"
            position="relative"
            justifyContent="center"
            height={screenWidth * 0.115}
            marginBottom={screenWidth * 0.04}
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
                zIndex: 10,
                pointerEvents: "auto",
              }}
            />
            <YStack justifyContent="center" alignItems="center">
              <SizableText
                style={{
                  fontFamily: "Poppins",
                  fontWeight: "100",
                  fontSize: 28,
                  lineHeight: 28 * 1.3,
                  color: "#2B4433",
                  letterSpacing: 1,
                  alignSelf: "center",
                }}
              >
                Now Open
              </SizableText>
              <XStack
                width={width * 0.5}
                justifyContent="center"
                alignItems="center"
              >
                <SizableText
                  style={{
                    fontFamily: "Poppins",
                    fontWeight: "700",
                    fontSize: Math.min(22, width * 0.8),
                    lineHeight: Math.min(22, width * 0.8) * 1.1,
                    color: "#2B4433",
                    alignSelf: "center",
                    textAlign: "center",
                  }}
                >
                  {tenant.name}!
                </SizableText>
              </XStack>
            </YStack>
          </XStack>

          <YStack>
            <View style={styles.sliderContainer}>
              <View style={styles.sliderTop}>
                <FlatList
                  ref={flatListRef}
                  data={currentImages}
                  horizontal
                  pagingEnabled={false}
                  snapToAlignment="start"
                  decelerationRate="fast"
                  snapToInterval={TOTAL_ITEM_WIDTH_FOR_SNAP}
                  initialScrollIndex={middleIndex} // Mulai dari gambar pertama
                  showsHorizontalScrollIndicator={false}
                  onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: animatedValue } } }],
                    { useNativeDriver: false }
                  )}
                  onScrollBeginDrag={onScrollBeginDrag} // Tambahkan ini
                  onMomentumScrollEnd={onMomentumScrollEnd} // Tambahkan ini
                  keyExtractor={(_, index) => index.toString()}
                  getItemLayout={(_, index) => ({
                    length: TOTAL_ITEM_WIDTH_FOR_SNAP,
                    offset: TOTAL_ITEM_WIDTH_FOR_SNAP * index,
                    index,
                  })}
                  style={{ width: screenWidth, flexGrow: 0 }}
                  contentContainerStyle={{
                    paddingHorizontal: (screenWidth - ACTUAL_ITEM_WIDTH) / 2,
                  }}
                  renderItem={({ item, index }) => (
                    <View
                      style={[
                        styles.imageWrapper,
                        {
                          width: ACTUAL_ITEM_WIDTH,
                          marginRight:
                            index === currentImages.length - 1
                              ? 0
                              : SPACE_BETWEEN_ITEMS,
                        },
                      ]}
                    >
                      <Image source={item} style={styles.image} />
                    </View>
                  )}
                />
              </View>
              <View style={styles.dotsWrapper}>
                {currentImages.map((_, index) => {
                  const inputRange = [
                    (index - 1) * TOTAL_ITEM_WIDTH_FOR_SNAP,
                    index * TOTAL_ITEM_WIDTH_FOR_SNAP,
                    (index + 1) * TOTAL_ITEM_WIDTH_FOR_SNAP,
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

          {/* ... sisa kode YStack lainnya ... */}
          <YStack
            marginTop={20}
            justifyContent="center"
            alignItems="center"
            backgroundColor="#4A7C59"
            padding={15}
            borderRadius={15}
            borderWidth={1.4}
            borderColor="#4A7C59"
            space={5}
          >
            <SizableText
              style={{
                fontSize: 15,
                fontFamily: "Poppins",
                color: "#fff",
                textAlign: "center",
                lineHeight: 15 * 1.4,
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
                lineHeight: 15 * 1.4,
              }}
            >
              Jl. Letjen S. Parman, Tanjung Duren, Jakarta Barat
            </SizableText>
          </YStack>

          <YStack marginTop={20} justifyContent="center" alignItems="center">
            <Button
              height={screenHeight * 0.05}
              width={screenWidth * 0.5}
              backgroundColor={"#2B4433"}
              borderRadius={"$10"}
              onPress={() => router.push("/(drawer)/(tabs)/mallDirectory")}
            >
              <SizableText color="white" fontSize={"$4"} fontFamily="Poppins">
                Show Mall Directory
              </SizableText>
            </Button>
          </YStack>

          <YStack marginTop={20} marginBottom={20}>
            <SizableText
              style={{
                fontSize: 15,
                fontFamily: "Poppins",
                color: "#000",
                textAlign: "justify",
                lineHeight: 15 * 1.5,
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
    width: screenWidth,
  },
  imageWrapper: {
    height: 420,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    resizeMode: "cover",
  },
  dotsWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 7,
    backgroundColor: "#9BA88D",
    marginHorizontal: 6,
  },
});
