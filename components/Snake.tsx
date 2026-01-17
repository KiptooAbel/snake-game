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
        
        // Enhanced level-based snake colors with better gradients
        let colors: [string, string] = isHead 
          ? ["#00ff41", "#00cc33"] // Bright neon green for head (level 1)
          : ["#00dd00", "#00aa00"]; // Lighter green for body (level 1)
          
        // Level 2 uses orange-red tones to match walls
        if (level === 2) {
          colors = isHead 
            ? ["#FF6B35", "#FF8F5C"] // Orange-red for head
            : ["#FF9F70", "#FFB88C"]; // Lighter orange for body
        }
        
        // Level 3 uses purple tones
        if (level === 3) {
          colors = isHead 
            ? ["#BA68C8", "#9C27B0"] // Bright purple for head
            : ["#CE93D8", "#AB47BC"]; // Lighter purple for body
        }
          
        // Modify colors for ghost mode
        if (isGhostMode) {
          colors = isHead 
            ? level === 1 
              ? ["rgba(0, 255, 65, 0.4)", "rgba(0, 204, 51, 0.4)"]
              : level === 2
                ? ["rgba(255, 107, 53, 0.4)", "rgba(255, 143, 92, 0.4)"]
                : ["rgba(186, 104, 200, 0.4)", "rgba(156, 39, 176, 0.4)"]
            : level === 1
              ? ["rgba(0, 221, 0, 0.4)", "rgba(0, 170, 0, 0.4)"]
              : level === 2
                ? ["rgba(255, 159, 112, 0.4)", "rgba(255, 184, 140, 0.4)"]
                : ["rgba(206, 147, 216, 0.4)", "rgba(171, 71, 188, 0.4)"];
        }
        
        // Modify colors for invincibility (golden variations)
        if (isInvincible) {
          colors = isHead 
            ? ["#FFD700", "#FFA000"] // Gold for head
            : ["#FFEB3B", "#FFC107"]; // Light gold for body
        }
        
        // Enhanced shadow and glow effects
        const shadowStyle = {
          shadowColor: colors[0],
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: isHead ? 0.8 : 0.5,
          shadowRadius: isHead ? 8 : 5,
          elevation: isHead ? 10 : 6,
        };
        
        // Make the snake segments rounded
        return (
          <LinearGradient
            key={index}
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.segment,
              shadowStyle,
              {
                left: segment.x * cellSize,
                top: segment.y * cellSize,
                width: cellSize,
                height: cellSize,
                borderRadius: cellSize / 3,
              },
            ]}
          >
            {/* Glossy highlight effect */}
            <View style={[styles.glossyHighlight, { 
              width: cellSize * 0.4, 
              height: cellSize * 0.4,
              borderRadius: cellSize * 0.2 
            }]} />
            
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
                    width: cellSize * 1.5,
                    height: cellSize * 1.5,
                    borderRadius: cellSize * 0.75,
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
    overflow: 'visible',
  },
  glossyHighlight: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  eye: {
    position: "absolute",
    backgroundColor: "#000",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  shield: {
    position: "absolute",
    borderWidth: 3,
    borderColor: "rgba(255, 215, 0, 0.9)",
    backgroundColor: "rgba(255, 215, 0, 0.15)",
    top: '50%',
    left: '50%',
    marginLeft: -0.75,
    marginTop: -0.75,
    transform: [{ scale: 1 }],
  },
});