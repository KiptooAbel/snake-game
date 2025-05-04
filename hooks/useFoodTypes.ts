// useFoodTypes.ts - Hook for generating food types based on difficulty
import { useState, useEffect } from 'react';

// Food types and their properties
const FOOD_TYPES = {
  REGULAR: { 
    points: 1, 
    probability: { 
      EASY: 0.7, 
      MEDIUM: 0.8, 
      HARD: 0.9 
    }
  },
  GOLDEN: { 
    points: 3, 
    probability: { 
      EASY: 0.2, 
      MEDIUM: 0.15, 
      HARD: 0.08 
    }
  },
  SPEED: { 
    points: 1, 
    effect: "speed",
    probability: { 
      EASY: 0.1, 
      MEDIUM: 0.05, 
      HARD: 0.02 
    }
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