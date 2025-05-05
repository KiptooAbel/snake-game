// Modified useFoodTypes.ts - Extended with power-up types
import { useState, useEffect } from 'react';

// Food types and their properties
const FOOD_TYPES = {
  REGULAR: { 
    points: 1, 
    probability: { EASY: 0.60, MEDIUM: 0.70, HARD: 0.80 },
    powerUpEffect: null,
    duration: 0
  },
  GOLDEN: { 
    points: 3, 
    probability: { EASY: 0.15, MEDIUM: 0.10, HARD: 0.05 },
    powerUpEffect: null,
    duration: 0
  },
  SPEED_BOOST: { 
    points: 1, 
    probability: { EASY: 0.07, MEDIUM: 0.05, HARD: 0.04 },
    powerUpEffect: "SPEED_BOOST",
    duration: 5000, // 5 seconds
    speedFactor: 0.7 // 30% speed increase
  },
  SPEED_SLOW: { 
    points: 1, 
    probability: { EASY: 0.06, MEDIUM: 0.05, HARD: 0.04 },
    powerUpEffect: "SPEED_SLOW",
    duration: 5000,
    speedFactor: 1.5 // 50% speed decrease
  },
  DOUBLE_POINTS: { 
    points: 1, 
    probability: { EASY: 0.05, MEDIUM: 0.04, HARD: 0.03 },
    powerUpEffect: "DOUBLE_POINTS",
    duration: 10000 // 10 seconds
  },
  INVINCIBILITY: { 
    points: 1, 
    probability: { EASY: 0.04, MEDIUM: 0.03, HARD: 0.02 },
    powerUpEffect: "INVINCIBILITY",
    duration: 5000 // 5 seconds
  },
  GHOST_MODE: { 
    points: 1, 
    probability: { EASY: 0.03, MEDIUM: 0.03, HARD: 0.02 },
    powerUpEffect: "GHOST_MODE",
    duration: 8000 // 8 seconds
  }
};

export const useFoodTypes = (difficulty: string) => {
  // Generate a food type based on probability distribution for current difficulty
  const generateFoodType = (): string => {
    const random = Math.random();
    let cumulativeProbability = 0;
    
    // Check each food type's probability for the current difficulty
    for (const [type, props] of Object.entries(FOOD_TYPES)) {
      cumulativeProbability += props.probability[difficulty];
      if (random <= cumulativeProbability) {
        return type;
      }
    }
    
    // Default to regular food if something goes wrong
    return "REGULAR";
  };
  
  // Get food properties for a specific type
  const getFoodProperties = (foodType: string) => {
    return FOOD_TYPES[foodType] || FOOD_TYPES.REGULAR;
  };
  
  return {
    FOOD_TYPES,
    generateFoodType,
    getFoodProperties
  };
};