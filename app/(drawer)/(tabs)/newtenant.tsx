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
import { Navbar } from "@/components/Navbar"; // Pastikan path ini benar
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

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

// Konfigurasi Carousel
const ACTUAL_ITEM_WIDTH = screenWidth * 0.8; // Lebar visual gambar utama
const SPACE_BETWEEN_ITEMS = 16; // Jarak antar gambar (misalnya 16px)
const TOTAL_ITEM_WIDTH_FOR_SNAP = ACTUAL_ITEM_WIDTH + SPACE_BETWEEN_ITEMS; // Lebar total per item untuk snapping

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
              backgroundColor="#2B4433"
              icon={<ArrowLeft size={20} color={"white"} />}
              onPress={() => router.back()} // Menggunakan router.back() lebih umum
              position="absolute"
              left={0}
              top={0} 
              zIndex={1} // Pastikan button di atas elemen lain jika ada tumpukan
            />
            <YStack space={5} justifyContent="center" alignItems="center">
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
              <SizableText
                style={{
                  fontFamily: "Poppins",
                  fontWeight: "700",
                  fontSize: 20,
                  lineHeight: 20 * 1.3,
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
              {/* Container FlatList tidak perlu diubah dari sebelumnya */}
              <View style={styles.sliderTop}> 
                <FlatList
                  ref={flatListRef}
                  data={currentImages}
                  horizontal
                  pagingEnabled={false} // pagingEnabled bisa jadi true atau false, tergantung efek yang diinginkan dengan snapToInterval
                  snapToAlignment="start" // Coba "start"
                  decelerationRate="fast"
                  snapToInterval={TOTAL_ITEM_WIDTH_FOR_SNAP}
                  initialScrollIndex={0}
                  // centerContent // Mungkin tidak diperlukan jika paddingHorizontal sudah benar
                  showsHorizontalScrollIndicator={false}
                  onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: animatedValue } } }],
                    { useNativeDriver: false }
                  )}
                  keyExtractor={(_, index) => index.toString()}
                  getItemLayout={(_, index) => ({
                    length: TOTAL_ITEM_WIDTH_FOR_SNAP,
                    offset: TOTAL_ITEM_WIDTH_FOR_SNAP * index,
                    index,
                  })}
                  style={{ width: screenWidth, flexGrow: 0 }}
                  contentContainerStyle={{
                    // Padding ini memastikan area KONTEN gambar utama (ACTUAL_ITEM_WIDTH) berada di tengah.
                    // Sisa ruang di sisi kiri dan kanan akan diisi oleh bagian dari SPACE_BETWEEN_ITEMS dan area kosong.
                    paddingHorizontal: (screenWidth - ACTUAL_ITEM_WIDTH) / 2,
                  }}
                  renderItem={({ item, index }) => (
                    <View 
                      style={[
                        styles.imageWrapper, 
                        { 
                          width: ACTUAL_ITEM_WIDTH,
                          // Memberi jarak di kanan, kecuali untuk item terakhir
                          marginRight: index === currentImages.length - 1 ? 0 : SPACE_BETWEEN_ITEMS,
                        }
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
              <SizableText
                color="white"
                fontSize={"$4"}
                fontFamily="Poppins"
              >
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
    // width: ACTUAL_ITEM_WIDTH, // Diatur inline
    height: 420, 
    // alignItems: "center", // Tidak selalu perlu jika image 100%
    // justifyContent: "center", // Tidak selalu perlu jika image 100%
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