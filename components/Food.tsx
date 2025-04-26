import React from "react";
import { View, StyleSheet } from "react-native";

// Define a type for the position prop
type Position = {
  x: number;
  y: number;
};

// Add TypeScript annotations
interface FoodProps {
  position: Position;
}

export default function Food({ position }: FoodProps) {
  return (
    <View
      style={[styles.food, { left: position.x * 20, top: position.y * 20 }]}
    />
  );
}

const styles = StyleSheet.create({
  food: {
    width: 20,
    height: 20,
    backgroundColor: "red",
    position: "absolute",
  },
});
