import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  View,
} from "react-native";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import React from "react";

const images = [
  require("@/assets/images/CPNS.jpg"),
  require("@/assets/images/Car.jpg"),
  require("@/assets/images/360Club.jpg"),
];

export default function Slider() {
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("screen").width
  );
  const [screenHeight, setScreenHeight] = useState(
    Dimensions.get("screen").height
  );

  const animatedValue = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList<any>>(null);

  useEffect(() => {
    const onChange = ({
      screen,
    }: {
      screen: { width: number; height: number };
    }) => {
      setScreenWidth(screen.width);
      setScreenHeight(screen.height);
    };

    const subscription = Dimensions.addEventListener("change", onChange);
    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    flatListRef.current?.scrollToIndex({
      index: Math.floor(images.length / 2),
      animated: false,
    });
  }, []);

  const dynamicStyles = StyleSheet.create({
    container: { flex: 6 },
    topContainer: { flex: 5 },
    bottomContainer: {
      flex: 1,
      width: screenWidth,
      justifyContent: "flex-start",
      alignItems: "center",
    },
    imageContainer: {
      justifyContent: "flex-end",
      paddingBottom: screenWidth * 0.07,
      alignItems: "center",
      width: screenWidth,
    },
    image: {
      width: screenWidth - screenWidth * 0.13,
      height: screenHeight * 0.3,
      // resizeMode: "contain",
      borderRadius: 40,
    },
    pagingDot: {
      width: 7,
      height: 7,
      backgroundColor: "#4A7C59",
      borderRadius: 7,
    },
    dotContainer: { width: 20, padding: 10 },
  });

  return (
    <View style={dynamicStyles.container}>
      <View style={dynamicStyles.topContainer}>
        <Animated.FlatList
          ref={flatListRef}
          data={images}
          horizontal
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: animatedValue } } }],
            { useNativeDriver: false }
          )}
          pagingEnabled={true}
          keyExtractor={(_, index) => index.toString()}
          initialScrollIndex={Math.floor(images.length / 2)}
          getItemLayout={(data, index) => ({
            length: screenWidth,
            offset: screenWidth * index,
            index,
          })}
          renderItem={({ item }) => {
            return (
              <View style={dynamicStyles.imageContainer}>
                <Image style={dynamicStyles.image} source={item} />
              </View>
            );
          }}
        />
      </View>
      <View style={dynamicStyles.bottomContainer}>
        <FlatList
          data={images}
          horizontal
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ index }) => {
            const inputRange = [
              (index - 1) * screenWidth,
              index * screenWidth,
              (index + 1) * screenWidth,
            ];
            const colorOutputRange = ["#D9D9D9", "#4A7C59", "#D9D9D9"];
            const scaleOutputRange = [1, 1, 1];
            const dotScale = animatedValue.interpolate({
              inputRange,
              outputRange: scaleOutputRange,
              extrapolate: "clamp",
            });
            const color = animatedValue.interpolate({
              inputRange,
              outputRange: colorOutputRange,
              extrapolate: "clamp",
            });
            return (
              <View style={dynamicStyles.dotContainer}>
                <PagingDot color={color} scale={dotScale} />
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}

const PagingDot: FunctionComponent<{
  scale: Animated.AnimatedInterpolation<number>;
  color: Animated.AnimatedInterpolation<string>;
}> = ({ scale, color }) => {
  return (
    <Animated.View
      style={[
        {
          width: 7,
          height: 7,
          backgroundColor: "#4A7C59",
          borderRadius: 7,
        },
        { backgroundColor: color, transform: [{ scale }] },
      ]}
    />
  );
};
