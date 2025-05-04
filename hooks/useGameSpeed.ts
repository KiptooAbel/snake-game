// useGameSpeed.ts - Hook for calculating game speed based on score and difficulty
import { useState, useEffect } from 'react';

// Difficulty level configurations for speed
const SPEED_SETTINGS = {
  EASY: {
    baseSpeed: 200,
    speedIncrement: 1, // ms reduction per point
    maxSpeedReduction: 80, // Maximum speed reduction
  },
  MEDIUM: {
    baseSpeed: 150,
    speedIncrement: 2, // ms reduction per point
    maxSpeedReduction: 100, // Maximum speed reduction
  },
  HARD: {
    baseSpeed: 120,
    speedIncrement: 3, // ms reduction per point
    maxSpeedReduction: 120, // Maximum speed reduction
  }
};

export const useGameSpeed = (difficulty: string) => {
  // Calculate game speed based on score and difficulty
  const getSpeed = (score: number) => {
    const { baseSpeed, speedIncrement, maxSpeedReduction } = SPEED_SETTINGS[difficulty];
    const minSpeed = baseSpeed - maxSpeedReduction; // Fastest speed (minimum interval)
    const speedReduction = Math.min(score * speedIncrement, maxSpeedReduction);
    return baseSpeed - speedReduction;
  };
  
  // Apply temporary speed boost (for power-ups)
  const getSpeedBoost = (currentSpeed: number, boostAmount: number) => {
    return Math.max(currentSpeed - boostAmount, 50); // Ensure we don't go too fast
  };
  
  return {
    SPEED_SETTINGS,
    getSpeed,
    getSpeedBoost
  };
};