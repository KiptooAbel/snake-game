// Enhanced Food.tsx with improved styling
import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";

// Define a type for the position prop
type Position = {
  x: number;
  y: number;
};

// Add TypeScript annotations
interface FoodProps {
  position: Position;
  cellSize: number;
}

export default function Food({ position, cellSize }: FoodProps) {
  // Create animation for pulsing effect
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Create pulsing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Create rotation animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();

    // Reset animations when food position changes
    return () => {
      pulseAnim.setValue(1);
      rotateAnim.setValue(0);
    };
  }, [position.x, position.y]);

  // Calculate rotation for the animation
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View
      style={[
        styles.foodContainer,
        {
          left: position.x * cellSize,
          top: position.y * cellSize,
          width: cellSize,
          height: cellSize,
          transform: [
            { scale: pulseAnim },
            { rotate: spin },
          ],
        },
      ]}
    >
      {/* Apple shape */}
      <View style={[styles.food, { width: cellSize * 0.8, height: cellSize * 0.8 }]} />
      {/* Apple stem */}
      <View style={[styles.stem, { width: cellSize * 0.1, height: cellSize * 0.2 }]} />
      {/* Apple leaf */}
      <View style={[styles.leaf, { width: cellSize * 0.3, height: cellSize * 0.2 }]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  foodContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  food: {
    backgroundColor: "red",
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  stem: {
    position: "absolute",
    backgroundColor: "brown",
    top: -5,
    borderRadius: 2,
  },
  leaf: {
    position: "absolute",
    backgroundColor: "green",
    top: -3,
    right: -5,
    borderRadius: 10,
    transform: [{ rotate: "45deg" }],
  },
});