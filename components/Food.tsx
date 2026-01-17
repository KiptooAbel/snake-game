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
                'DOUBLE_POINTS' | 'INVINCIBILITY' | 'GHOST_MODE' |
                'RUBY' | 'EMERALD' | 'DIAMOND' | 'HEART'; // Added reward fruits and heart

// Add TypeScript annotations
interface FoodProps {
  position: Position;
  cellSize: number;
  foodType?: FoodType;
}

export default function Food({ 
  position, 
  cellSize, 
  foodType = 'REGULAR'
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
      case 'RUBY':
        return {
          color: "#E91E63", // Ruby red/pink
          secondaryColor: "#C2185B", // Darker ruby
          pulseDuration: 300,
          pulseScale: 1.5,
          rotationDuration: 1000,
          symbol: "💎",
        };
      case 'EMERALD':
        return {
          color: "#4CAF50", // Emerald green
          secondaryColor: "#2E7D32", // Darker emerald
          pulseDuration: 250,
          pulseScale: 1.6,
          rotationDuration: 900,
          symbol: "💎",
        };
      case 'DIAMOND':
        return {
          color: "#00BCD4", // Diamond cyan/blue
          secondaryColor: "#0097A7", // Darker diamond
          pulseDuration: 200,
          pulseScale: 1.7,
          rotationDuration: 800,
          symbol: "💎",
        };
      case 'HEART':
        return {
          color: "#FF1744", // Bright red for heart
          secondaryColor: "#C62828", // Darker red
          pulseDuration: 350,
          pulseScale: 1.5,
          rotationDuration: 1200,
          symbol: "❤️",
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
        <>
          {/* Outer glow */}
          <Animated.View
            style={[
              styles.glow,
              {
                width: cellSize * 2,
                height: cellSize * 2,
                borderRadius: cellSize,
                opacity: pulseAnim.interpolate({
                  inputRange: [1, foodProps.pulseScale],
                  outputRange: [0.2, 0.5],
                }),
                backgroundColor: `${foodProps.color}30`,
              },
            ]}
          />
          {/* Inner glow */}
          <Animated.View
            style={[
              styles.innerGlow,
              {
                width: cellSize * 1.3,
                height: cellSize * 1.3,
                borderRadius: cellSize * 0.65,
                opacity: pulseAnim.interpolate({
                  inputRange: [1, foodProps.pulseScale],
                  outputRange: [0.4, 0.8],
                }),
                backgroundColor: `${foodProps.color}50`,
              },
            ]}
          />
        </>
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
      
      {/* Main food shape with enhanced shadow */}
      <LinearGradient
        colors={[foodProps.color, foodProps.secondaryColor]}
        style={[
          styles.food,
          { 
            width: cellSize * 0.8, 
            height: cellSize * 0.8,
            shadowColor: foodProps.color,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: foodType !== 'REGULAR' ? 8 : 4,
            elevation: foodType !== 'REGULAR' ? 10 : 5,
          },
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Glossy highlight */}
        <View style={[styles.glossy, {
          width: cellSize * 0.3,
          height: cellSize * 0.3,
          borderRadius: cellSize * 0.15,
        }]} />
      </LinearGradient>
      
      {/* Power-up symbol */}
      {foodType !== 'REGULAR' && (
        <View style={styles.symbolContainer}>
          <Animated.Text 
            style={[
              styles.symbol,
              { fontSize: cellSize * 0.45 }
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  glossy: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  stem: {
    position: "absolute",
    backgroundColor: "#654321",
    top: -5,
    borderRadius: 2,
  },
  leaf: {
    position: "absolute",
    backgroundColor: "#2E7D32",
    top: -3,
    right: -5,
    borderRadius: 10,
    transform: [{ rotate: "45deg" }],
  },
  glow: {
    position: "absolute",
  },
  innerGlow: {
    position: "absolute",
  },
  symbolContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  symbol: {
    color: "white",
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.9)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});