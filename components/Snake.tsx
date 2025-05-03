// Enhanced Snake.tsx with improved styling
import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

// Define types for the snake's segments
type Position = {
  x: number;
  y: number;
};

interface SnakeProps {
  snake: Position[];
  cellSize: number;
}

export default function Snake({ snake, cellSize }: SnakeProps) {
  return (
    <>
      {snake.map((segment: Position, index: number) => {
        // Determine if this segment is the head
        const isHead = index === 0;
        
        // Different colors for head and body
        const colors = isHead 
          ? ["#00ff00", "#00cc00"] 
          : ["#00dd00", "#00aa00"];
        
        // Calculate border radius based on neighboring segments
        let borderRadius = cellSize / 3;
        
        // Make the snake segments rounded
        return (
          <LinearGradient
            key={index}
            colors={colors}
            style={[
              styles.segment,
              {
                left: segment.x * cellSize,
                top: segment.y * cellSize,
                width: cellSize,
                height: cellSize,
                borderRadius: borderRadius,
              },
            ]}
          >
            {/* Eyes for the snake head */}
            {isHead && (
              <>
                <View
                  style={[
                    styles.eye,
                    {
                      width: cellSize / 5,
                      height: cellSize / 5,
                      top: cellSize / 4,
                      left: cellSize / 4,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.eye,
                    {
                      width: cellSize / 5,
                      height: cellSize / 5,
                      top: cellSize / 4,
                      right: cellSize / 4,
                    },
                  ]}
                />
              </>
            )}
          </LinearGradient>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  segment: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  eye: {
    position: "absolute",
    backgroundColor: "black",
    borderRadius: 50,
  },
});