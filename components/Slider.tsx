import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  View,
} from "react-native";
import React, { FunctionComponent, useEffect, useRef } from "react";

const images = [
  require("@/assets/images/CPNS.jpg"),
  require("@/assets/images/Car.jpg"),
  require("@/assets/images/360Club.jpg"),
];

const { width } = Dimensions.get("screen");

export default function Slider() {
  const animatedValue = useRef(new Animated.Value(0)).current;

  const flatListRef = useRef<FlatList<any>>(null);

  useEffect(() => {
    flatListRef.current?.scrollToIndex({
      index: Math.floor(images.length / 2),
      animated: false,
    });
  }, []);

  return (
    <View style={style.container}>
      <View style={style.topContainer}>
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
            length: width,
            offset: width * index,
            index,
          })}
          renderItem={({ item }) => {
            return (
              <View style={style.imageContainer}>
                <Image style={style.image} source={item} />
              </View>
            );
          }}
        />
      </View>
      <View style={style.bottomContainer}>
        <FlatList
          data={images}
          horizontal
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ index }) => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];
            const colorOutputRange = ["#D9D9D9", "#9BA88D", "#D9D9D9"];
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
              <View style={style.dotContainer}>
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
        style.pagingDot,
        { backgroundColor: color, transform: [{ scale }] },
      ]}
    />
  );
};

const style = StyleSheet.create({
  container: { flex: 6 },
  topContainer: { flex: 5 },
  bottomContainer: {
    flex: 1,
    width,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  imageContainer: {
    justifyContent: "flex-end",
    paddingBottom: 40,
    alignItems: "center",
    width,
  },
  image: { width: width - 50, height: 206, borderRadius: 40 },
  pagingDot: {
    width: 7,
    height: 7,
    backgroundColor: "#9BA88D",
    borderRadius: 7,
  },
  dotContainer: { width: 20, padding: 10 },
});
