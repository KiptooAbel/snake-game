// components/PowerUpIndicator.tsx
import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { PowerUpType } from "../hooks/usePowerUps";

interface PowerUpIndicatorProps {
  type: PowerUpType;
  remainingTime: number;
  maxTime: number;
}

export default function PowerUpIndicator({ 
  type, 
  remainingTime, 
  maxTime 
}: PowerUpIndicatorProps) {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  
  // Flash animation when time is running out
  useEffect(() => {
    if (remainingTime < 2000) { // Last 2 seconds
      Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0.4,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      fadeAnim.setValue(1);
    }
    
    return () => {
      fadeAnim.stopAnimation();
    };
  }, [remainingTime < 2000]);
  
  // Get color and icon based on power-up type
  const getPowerUpProperties = () => {
    switch(type) {
      case 'SPEED_BOOST':
        return { color: "#8B4513", icon: "⚡", label: "SPEED+" }; // Brown theme
      case 'SPEED_SLOW':
        return { color: "#9C27B0", icon: "🐢", label: "SLOW" }; // Purple theme
      case 'DOUBLE_POINTS':
        return { color: "#A0522D", icon: "×2", label: "2× PTS" }; // Dark brown
      case 'INVINCIBILITY':
        return { color: "#D4AF37", icon: "🛡️", label: "INVNC" }; // Golden brown
      case 'GHOST_MODE':
        return { color: "#BA68C8", icon: "👻", label: "GHOST" }; // Light purple
      default:
        return { color: "#8B4513", icon: "?", label: "UNKN" }; // Default brown
    }
  };
  
  const { color, icon, label } = getPowerUpProperties();
  
  // Calculate progress percentage
  const progress = (remainingTime / maxTime) * 100;
  
  return (
    <Animated.View 
      style={[
        styles.container,
        { opacity: fadeAnim, borderColor: color }
      ]}
    >
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.label}>{label}</Text>
      
      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View 
          style={[
            styles.progressBar,
            { width: `${progress}%`, backgroundColor: color }
          ]} 
        />
      </View>
      
      {/* Time remaining in seconds */}
      <Text style={styles.timeText}>
        {Math.ceil(remainingTime / 1000)}s
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(139, 69, 19, 0.8)", // Brown background with transparency
    padding: 5,
    borderRadius: 5,
    marginRight: 5,
    borderWidth: 1,
  },
  icon: {
    fontSize: 16,
    marginRight: 5,
  },
  label: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
    marginRight: 5,
  },
  progressContainer: {
    width: 40,
    height: 6,
    backgroundColor: "rgba(160, 82, 45, 0.4)", // Brown theme background
    borderRadius: 3,
    overflow: "hidden",
    marginRight: 5,
  },
  progressBar: {
    height: "100%",
  },
  timeText: {
    color: "white",
    fontSize: 10,
    minWidth: 20,
    textAlign: "right",
  },
});