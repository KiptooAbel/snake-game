// useGameSpeed.ts - Hook for calculating game speed based on score
import { useState, useEffect } from 'react';

// Speed configuration (formerly NORMAL mode)
const SPEED_SETTINGS = {
  baseSpeed: 150,
  speedIncrement: 2, // ms reduction per point
  maxSpeedReduction: 100, // Maximum speed reduction
};

export const useGameSpeed = () => {
  // Calculate game speed based on score
  const getSpeed = (score: number) => {
    const { baseSpeed, speedIncrement, maxSpeedReduction } = SPEED_SETTINGS;
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