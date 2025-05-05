// Modified Snake.tsx with ghost mode effects
import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useGame } from "@/contexts/GameContext";

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
  // Get power-up states from context
  const { isPowerUpActive } = useGame();
  
  // Check if ghost mode is active
  const isGhostMode = isPowerUpActive('GHOST_MODE');
  // Check if invincibility is active
  const isInvincible = isPowerUpActive('INVINCIBILITY');
  
  return (
    <>
      {snake.map((segment: Position, index: number) => {
        // Determine if this segment is the head
        const isHead = index === 0;
        
        // Different colors based on power-ups and segment type
        let colors = isHead 
          ? ["#00ff00", "#00cc00"] 
          : ["#00dd00", "#00aa00"];
          
        // Modify colors for ghost mode
        if (isGhostMode) {
          colors = isHead 
            ? ["rgba(0, 255, 0, 0.5)", "rgba(0, 204, 0, 0.5)"] 
            : ["rgba(0, 221, 0, 0.5)", "rgba(0, 170, 0, 0.5)"];
        }
        
        // Modify colors for invincibility
        if (isInvincible) {
          colors = isHead 
            ? ["#FFC107", "#FF8F00"] 
            : ["#FFCA28", "#FFA000"];
        }
        
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
                borderRadius: cellSize / 3,
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
            
            {/* Add special effects for power-ups */}
            {isHead && isInvincible && (
              <View
                style={[
                  styles.shield,
                  {
                    width: cellSize * 1.4,
                    height: cellSize * 1.4,
                    borderRadius: cellSize * 0.7,
                  },
                ]}
              />
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
  shield: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "rgba(255, 193, 7, 0.7)",
    backgroundColor: "rgba(255, 193, 7, 0.2)",
  },
});