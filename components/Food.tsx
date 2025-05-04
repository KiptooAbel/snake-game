// Enhanced Food.tsx with difficulty-specific food types
import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

// Define a type for the position prop
type Position = {
  x: number;
  y: number;
};

// Define food types
type FoodType = 'REGULAR' | 'GOLDEN' | 'SPEED';

// Add TypeScript annotations
interface FoodProps {
  position: Position;
  cellSize: number;
  foodType?: FoodType;
  difficulty?: string;
}

export default function Food({ 
  position, 
  cellSize, 
  foodType = 'REGULAR',
  difficulty = 'MEDIUM'
}: FoodProps) {
  // Create animations for effects
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  // Define food properties based on type
  const getFoodProperties = () => {
    switch(foodType) {
      case 'GOLDEN':
        return {
          color: "#FFD700", // Gold
          secondaryColor: "#FFA000", // Darker gold
          pulseDuration: 400,
          pulseScale: 1.3,
          rotationDuration: 1800,
          points: 3,
        };
      case 'SPEED':
        return {
          color: "#2196F3", // Blue
          secondaryColor: "#0D47A1", // Darker blue
          pulseDuration: 300,
          pulseScale: 1.25,
          rotationDuration: 1500,
          points: 1,
          effect: "speed",
        };
      default: // REGULAR
        return {
          color: "#F44336", // Red
          secondaryColor: "#B71C1C", // Darker red
          pulseDuration: 500,
          pulseScale: 1.2,
          rotationDuration: 2000,
          points: 1,
        };
    }
  };
  
  const foodProps = getFoodProperties();

  // Determine if special foods should appear based on difficulty
  const shouldShowSpecialFood = () => {
    // Higher chances for special food in easier modes
    if (difficulty === 'EASY') return Math.random() < 0.3;
    if (difficulty === 'MEDIUM') return Math.random() < 0.2;
    if (difficulty === 'HARD') return Math.random() < 0.1;
    return false;
  };

  useEffect(() => {
    // Create pulsing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: foodProps.pulseScale,
          duration: foodProps.pulseDuration,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: foodProps.pulseDuration,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Create rotation animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: foodProps.rotationDuration,
        useNativeDriver: true,
      })
    ).start();

    // Add bounce animation for special food
    if (foodType !== 'REGULAR') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: -5,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }

    // Reset animations when food position changes
    return () => {
      pulseAnim.setValue(1);
      rotateAnim.setValue(0);
      bounceAnim.setValue(0);
    };
  }, [position.x, position.y, foodType]);

  // Calculate rotation for the animation
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  // Render special effects for different food types
  const renderFoodEffects = () => {
    if (foodType === 'GOLDEN') {
      return (
        <Animated.View
          style={[
            styles.glow,
            {
              width: cellSize * 1.5,
              height: cellSize * 1.5,
              opacity: pulseAnim.interpolate({
                inputRange: [1, foodProps.pulseScale],
                outputRange: [0.3, 0.6],
              }),
            },
          ]}
        />
      );
    }
    
    if (foodType === 'SPEED') {
      return (
        <View style={styles.speedEffectContainer}>
          {[...Array(4)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.speedLine,
                {
                  transform: [{ rotate: `${i * 90}deg` }],
                  width: cellSize * 0.8,
                  height: 2,
                  top: cellSize / 2,
                  left: (cellSize - cellSize * 0.8) / 2,
                },
              ]}
            />
          ))}
        </View>
      );
    }
    
    return null;
  };

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
            { translateY: bounceAnim },
          ],
        },
      ]}
    >
      {/* Food effects in background */}
      {renderFoodEffects()}
      
      {/* Main food shape */}
      {foodType === 'REGULAR' ? (
        <View 
          style={[
            styles.food, 
            { 
              width: cellSize * 0.8, 
              height: cellSize * 0.8,
              backgroundColor: foodProps.color,
            }
          ]} 
        />
      ) : (
        <LinearGradient
          colors={[foodProps.color, foodProps.secondaryColor]}
          style={[
            styles.food,
            { width: cellSize * 0.8, height: cellSize * 0.8 },
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      )}
      
      {/* Apple stem and leaf only for regular food */}
      {foodType === 'REGULAR' && (
        <>
          <View 
            style={[
              styles.stem, 
              { width: cellSize * 0.1, height: cellSize * 0.2 }
            ]} 
          />
          <View 
            style={[
              styles.leaf, 
              { width: cellSize * 0.3, height: cellSize * 0.2 }
            ]} 
          />
        </>
      )}
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
  glow: {
    position: "absolute",
    borderRadius: 100,
    backgroundColor: "rgba(255, 215, 0, 0.3)",
  },
  speedEffectContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  speedLine: {
    position: "absolute",
    backgroundColor: "rgba(33, 150, 243, 0.8)",
  },
});