// components/PowerUpsDisplay.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import PowerUpIndicator from "./PowerUpIndicator";
import { usePowerUps } from "../hooks/usePowerUps";
import { useFoodTypes } from "../hooks/useFoodTypes";

export default function PowerUpsDisplay() {
  const { getActivePowerUps } = usePowerUps();
  const { FOOD_TYPES } = useFoodTypes("MEDIUM"); // Just to get durations
  
  // Get active power-ups
  const activePowerUps = getActivePowerUps();
  
  if (activePowerUps.length === 0) {
    return null;
  }
  
  return (
    <View style={styles.container}>
      {activePowerUps.map((powerUp) => {
        const foodType = powerUp.type;
        // Get the maximum duration for this power-up
        const maxDuration = FOOD_TYPES[foodType]?.duration || 5000;
        
        return (
          <PowerUpIndicator
            key={powerUp.type}
            type={powerUp.type}
            remainingTime={powerUp.remainingTime}
            maxTime={maxDuration}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    zIndex: 100,
  },
});