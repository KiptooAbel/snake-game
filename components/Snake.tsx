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
  const { isPowerUpActive, level } = useGame();
  
  // Check if ghost mode is active
  const isGhostMode = isPowerUpActive('GHOST_MODE');
  // Check if invincibility is active
  const isInvincible = isPowerUpActive('INVINCIBILITY');
  
  return (
    <>
      {snake.map((segment: Position, index: number) => {
        // Determine if this segment is the head
        const isHead = index === 0;
        
        // Level-based snake colors 
        let colors: [string, string] = isHead 
          ? ["#00ff00", "#00cc00"] // Green tones for head (level 1)
          : ["#00dd00", "#00aa00"]; // Lighter green for body (level 1)
          
        // Level 2 uses brown tones
        if (level === 2) {
          colors = isHead 
            ? ["#8B4513", "#A0522D"] // Brown tones for head
            : ["#CD853F", "#D2691E"]; // Lighter brown for body
        }
        
        // Level 3 uses purple tones
        if (level === 3) {
          colors = isHead 
            ? ["#9C27B0", "#6A1B99"] // Purple tones for head
            : ["#BA68C8", "#8E24AA"]; // Lighter purple for body
        }
          
        // Modify colors for ghost mode
        if (isGhostMode) {
          colors = isHead 
            ? level === 1 
              ? ["rgba(0, 255, 0, 0.5)", "rgba(0, 204, 0, 0.5)"] // Green for level 1
              : level === 2
                ? ["rgba(139, 69, 19, 0.5)", "rgba(160, 82, 45, 0.5)"] // Brown for level 2
                : ["rgba(156, 39, 176, 0.5)", "rgba(106, 27, 153, 0.5)"] // Purple for level 3
            : level === 1
              ? ["rgba(0, 221, 0, 0.5)", "rgba(0, 170, 0, 0.5)"] // Green for level 1
              : level === 2
                ? ["rgba(205, 133, 63, 0.5)", "rgba(210, 105, 30, 0.5)"] // Brown for level 2
                : ["rgba(186, 104, 200, 0.5)", "rgba(142, 36, 170, 0.5)"]; // Purple for level 3
        }
        
        // Modify colors for invincibility (golden variations)
        if (isInvincible) {
          colors = isHead 
            ? level === 1
              ? ["#FFC107", "#FF8F00"] // Amber/gold for level 1
              : level === 2
                ? ["#D4AF37", "#B8860B"] // Dark golden brown for level 2
                : ["#FFD700", "#DAA520"] // Gold for level 3
            : level === 1
              ? ["#FFCA28", "#FFA000"] // Light amber for level 1
              : level === 2
                ? ["#DEB887", "#BC9A6A"] // Light golden brown for level 2
                : ["#FFF8DC", "#F0E68C"]; // Light gold for level 3
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
    borderColor: "rgba(212, 175, 55, 0.8)", // Golden brown shield
    backgroundColor: "rgba(212, 175, 55, 0.2)",
  },
});