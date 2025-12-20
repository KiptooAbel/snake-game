// Modified useFoodTypes.ts - Extended with power-up types
import { useState, useEffect } from 'react';

// Food types and their properties (using normal difficulty probabilities)
const FOOD_TYPES = {
  REGULAR: { 
    points: 5, 
    probability: 0.70,
    powerUpEffect: null,
    duration: 0
  },
  GOLDEN: { 
    points: 3, 
    probability: 0.10,
    powerUpEffect: null,
    duration: 0
  },
  SPEED_BOOST: { 
    points: 1, 
    probability: 0.05,
    powerUpEffect: "SPEED_BOOST",
    duration: 5000, // 5 seconds
    speedFactor: 0.7 // 30% speed increase
  },
  SPEED_SLOW: { 
    points: 1, 
    probability: 0.05,
    powerUpEffect: "SPEED_SLOW",
    duration: 5000,
    speedFactor: 1.5 // 50% speed decrease
  },
  DOUBLE_POINTS: { 
    points: 1, 
    probability: 0.04,
    powerUpEffect: "DOUBLE_POINTS",
    duration: 10000 // 10 seconds
  },
  INVINCIBILITY: { 
    points: 1, 
    probability: 0.03,
    powerUpEffect: "INVINCIBILITY",
    duration: 5000 // 5 seconds
  },
  GHOST_MODE: { 
    points: 1, 
    probability: 0.03,
    powerUpEffect: "GHOST_MODE",
    duration: 8000 // 8 seconds
  },
  // Special Reward Fruits (appear after eating certain number of regular fruits)
  RUBY: {
    points: 5, // Regular score points
    rewardPoints: 10, // Special reward points for unlocking levels
    probability: 0, // Not spawned randomly
    powerUpEffect: null,
    duration: 0
  },
  EMERALD: {
    points: 10,
    rewardPoints: 25,
    probability: 0,
    powerUpEffect: null,
    duration: 0
  },
  DIAMOND: {
    points: 20,
    rewardPoints: 50,
    probability: 0,
    powerUpEffect: null,
    duration: 0
  },
  HEART: {
    points: 5,
    probability: 0, // Not spawned randomly
    powerUpEffect: null,
    duration: 0,
    givesHeart: true // Special property to indicate it gives a heart
  }
};

export const useFoodTypes = () => {
  // Generate a food type based on probability distribution
  const generateFoodType = (): string => {
    const random = Math.random();
    let cumulativeProbability = 0;
    
    // Check each food type's probability
    for (const [type, props] of Object.entries(FOOD_TYPES)) {
      cumulativeProbability += props.probability;
      if (random <= cumulativeProbability) {
        return type;
      }
    }
    
    // Default to regular food if something goes wrong
    return "REGULAR";
  };
  
  // Get food properties for a specific type
  const getFoodProperties = (foodType: string) => {
    const typeKey = foodType as keyof typeof FOOD_TYPES;
    return FOOD_TYPES[typeKey] || FOOD_TYPES.REGULAR;
  };
  
  return {
    FOOD_TYPES,
    generateFoodType,
    getFoodProperties
  };
};