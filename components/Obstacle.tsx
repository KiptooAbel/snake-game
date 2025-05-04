// Obstacle.tsx - Component for rendering game obstacles
import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

// Define obstacle types
export type ObstacleType = 'STATIC' | 'PULSING' | 'MOVING';

// Add TypeScript annotations
interface ObstacleProps {
  position: { x: number; y: number };
  cellSize: number;
  type?: ObstacleType;
  isMoving?: boolean;
}

export default function Obstacle({ 
  position, 
  cellSize, 
  type = 'STATIC',
  isMoving = false
}: ObstacleProps) {
  // Create animations for effects
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const moveAnim = useRef(new Animated.Value(0)).current;
  
  // Get colors and styles based on obstacle type
  const getObstacleColors = () => {
    switch(type) {
      case 'PULSING':
        return ["#9C27B0", "#7B1FA2"]; // Purple gradient
      case 'MOVING':
        return ["#FF9800", "#F57C00"]; // Orange gradient
      default: // STATIC
        return ["#607D8B", "#455A64"]; // Blue-grey gradient
    }
  };

  useEffect(() => {
    // Create pulsing animation for pulsing obstacles
    if (type === 'PULSING') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
    
    // Create movement animation for moving obstacles
    if (type === 'MOVING' || isMoving) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(moveAnim, {
            toValue: 5,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(moveAnim, {
            toValue: -5,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(moveAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }

    // Reset animations when obstacle position changes
    return () => {
      pulseAnim.setValue(1);
      moveAnim.setValue(0);
    };
  }, [position.x, position.y, type, isMoving]);

  // Get obstacle shape based on type
  const getObstacleShape = () => {
    switch(type) {
      case 'PULSING':
        return { borderRadius: cellSize / 2 }; // Circle
      case 'MOVING':
        return { 
          borderRadius: cellSize / 4,
          transform: [{ rotate: '45deg' }] 
        }; // Diamond
      default: // STATIC
        return { borderRadius: cellSize / 8 }; // Rounded square
    }
  };

  const colors = getObstacleColors();
  const shapeStyle = getObstacleShape();

  return (
    <Animated.View
      style={[
        styles.obstacleContainer,
        {
          left: position.x * cellSize,
          top: position.y * cellSize,
          width: cellSize,
          height: cellSize,
          transform: [
            { scale: type === 'PULSING' ? pulseAnim : 1 },
            { translateX: type === 'MOVING' || isMoving ? moveAnim : 0 },
          ],
        },
      ]}
    >
      <LinearGradient
        colors={colors}
        style={[
          styles.obstacle,
          { 
            width: cellSize * 0.85, 
            height: cellSize * 0.85 
          },
          shapeStyle
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Add spikes to static obstacles */}
      {type === 'STATIC' && (
        <>
          <View style={[
            styles.spike,
            { 
              width: 0,
              height: 0,
              borderLeftWidth: cellSize * 0.15,
              borderRightWidth: cellSize * 0.15,
              borderBottomWidth: cellSize * 0.25,
              top: -cellSize * 0.2,
              left: cellSize * 0.35,
            }
          ]} />
          <View style={[
            styles.spike,
            { 
              width: 0,
              height: 0,
              borderLeftWidth: cellSize * 0.15,
              borderRightWidth: cellSize * 0.15,
              borderBottomWidth: cellSize * 0.25,
              bottom: -cellSize * 0.2,
              left: cellSize * 0.35,
              transform: [{ rotate: '180deg' }]
            }
          ]} />
        </>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  obstacleContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  obstacle: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  spike: {
    position: "absolute",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#455A64",
  }
});