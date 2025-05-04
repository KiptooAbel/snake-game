// useGameDimensions.ts - Hook for calculating game dimensions based on difficulty
import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

// Get device dimensions for responsive design
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

// Difficulty level configurations
const DIFFICULTY_SETTINGS = {
  EASY: {
    gridSize: 15,
    baseSpeed: 200,
    speedIncrement: 1, // ms reduction per point
    maxSpeedReduction: 80, // Maximum speed reduction
  },
  MEDIUM: {
    gridSize: 20,
    baseSpeed: 150,
    speedIncrement: 2, // ms reduction per point
    maxSpeedReduction: 100, // Maximum speed reduction
  },
  HARD: {
    gridSize: 25,
    baseSpeed: 120,
    speedIncrement: 3, // ms reduction per point
    maxSpeedReduction: 120, // Maximum speed reduction
  }
};

export const useGameDimensions = (difficulty: string) => {
  // Calculate dimensions based on the current difficulty
  const calculateGameDimensions = () => {
    const gridSize = DIFFICULTY_SETTINGS[difficulty].gridSize;
    const cellSize = Math.floor(Math.min(windowWidth, windowHeight) / gridSize);
    
    return {
      GRID_SIZE: gridSize,
      CELL_SIZE: cellSize,
      BOARD_WIDTH: gridSize * cellSize,
      BOARD_HEIGHT: gridSize * cellSize
    };
  };
  
  const [gameDimensions, setGameDimensions] = useState(calculateGameDimensions());
  
  // Update dimensions when difficulty changes
  useEffect(() => {
    setGameDimensions(calculateGameDimensions());
  }, [difficulty]);
  
  // Get initial snake position based on current grid size
  const getInitialSnake = () => {
    const middleX = Math.floor(gameDimensions.GRID_SIZE / 2);
    const middleY = Math.floor(gameDimensions.GRID_SIZE / 2);
    return [
      { x: middleX, y: middleY },
      { x: middleX - 1, y: middleY },
    ];
  };
  
  return {
    gameDimensions,
    getInitialSnake,
    DIFFICULTY_SETTINGS
  };
};