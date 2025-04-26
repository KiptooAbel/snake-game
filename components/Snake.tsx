import React from "react";
import { View, StyleSheet } from "react-native";

// Define a type for the snake's segments
type Position = {
  x: number;
  y: number;
};

interface SnakeProps {
  snake: Position[];
}

export default function Snake({ snake }: SnakeProps) {
  return snake.map((segment: Position, index: number) => (
    <View
      key={index}
      style={[styles.snake, { left: segment.x * 20, top: segment.y * 20 }]}
    />
  ));
}

const styles = StyleSheet.create({
  snake: {
    width: 20,
    height: 20,
    backgroundColor: "lime",
    position: "absolute",
  },
});
