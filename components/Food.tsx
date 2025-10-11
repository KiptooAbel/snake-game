// Modified Food.tsx
import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

// Define a type for the position prop
type Position = {
  x: number;
  y: number;
};

// Define all food types
type FoodType = 'REGULAR' | 'GOLDEN' | 'SPEED_BOOST' | 'SPEED_SLOW' | 
                'DOUBLE_POINTS' | 'INVINCIBILITY' | 'GHOST_MODE';

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
          symbol: "★",
        };
      case 'SPEED_BOOST':
        return {
          color: "#8B4513", // Brown theme
          secondaryColor: "#A0522D", // Darker brown
          pulseDuration: 300,
          pulseScale: 1.25,
          rotationDuration: 1200,
          symbol: "⚡",
        };
      case 'SPEED_SLOW':
        return {
          color: "#9C27B0", // Purple theme
          secondaryColor: "#6A1B99", // Darker purple
          pulseDuration: 600,
          pulseScale: 1.2,
          rotationDuration: 2500,
          symbol: "🐢",
        };
      case 'DOUBLE_POINTS':
        return {
          color: "#A0522D", // Dark brown
          secondaryColor: "#8B4513", // Medium brown
          pulseDuration: 400,
          pulseScale: 1.3,
          rotationDuration: 2000,
          symbol: "×2",
        };
      case 'INVINCIBILITY':
        return {
          color: "#D4AF37", // Golden brown
          secondaryColor: "#B8860B", // Darker golden brown
          pulseDuration: 350,
          pulseScale: 1.4,
          rotationDuration: 1500,
          symbol: "🛡️",
        };
      case 'GHOST_MODE':
        return {
          color: "#BA68C8", // Light purple
          secondaryColor: "#8E24AA", // Medium purple
          pulseDuration: 450,
          pulseScale: 1.35,
          rotationDuration: 2200,
          symbol: "👻",
        };
      default: // REGULAR
        return {
          color: "#F44336", // Red
          secondaryColor: "#B71C1C", // Darker red
          pulseDuration: 500,
          pulseScale: 1.2,
          rotationDuration: 2000,
          symbol: "",
        };
    }
  };
  
  const foodProps = getFoodProperties();

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

    // Add bounce animation for power-up food types
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
    if (foodType !== 'REGULAR') {
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
              backgroundColor: `${foodProps.color}40`, // Add transparency
            },
          ]}
        />
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
      <LinearGradient
        colors={[foodProps.color, foodProps.secondaryColor]}
        style={[
          styles.food,
          { width: cellSize * 0.8, height: cellSize * 0.8 },
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Power-up symbol */}
      {foodType !== 'REGULAR' && (
        <View style={styles.symbolContainer}>
          <Animated.Text 
            style={[
              styles.symbol,
              { fontSize: cellSize * 0.4 }
            ]}
          >
            {foodProps.symbol}
          </Animated.Text>
        </View>
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
  },
  symbolContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  symbol: {
    color: "white",
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
});