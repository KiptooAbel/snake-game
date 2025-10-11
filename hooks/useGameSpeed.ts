// useGameSpeed.ts - Hook for calculating game speed based on score and mode
import { useState, useEffect } from 'react';

// Mode level configurations for speed
const SPEED_SETTINGS = {
  EASY: {
    baseSpeed: 200,
    speedIncrement: 1, // ms reduction per point
    maxSpeedReduction: 80, // Maximum speed reduction
  },
  NORMAL: {
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

export const useGameSpeed = (mode: string) => {
  // Calculate game speed based on score and mode
  const getSpeed = (score: number) => {
    const modeKey = mode as keyof typeof SPEED_SETTINGS;
    const settings = SPEED_SETTINGS[modeKey] || SPEED_SETTINGS.NORMAL;
    const { baseSpeed, speedIncrement, maxSpeedReduction } = settings;
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