// useGameDimensions.ts - Hook for calculating game dimensions based on difficulty
import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

// Get device dimensions for responsive design
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

// Define difficulty type
type DifficultyType = 'EASY' | 'MEDIUM' | 'HARD';

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
    const difficultyKey = difficulty as DifficultyType;
    const baseGridSize = DIFFICULTY_SETTINGS[difficultyKey]?.gridSize || DIFFICULTY_SETTINGS.MEDIUM.gridSize;
    
    // Use the full screen width and height
    const availableWidth = windowWidth;
    // Reserve space only for the header/buttons at the top (about 100px)
    const availableHeight = windowHeight - 100;
    
    // Calculate appropriate cell size for full screen
    const targetCellSize = 20; // Target cell size for good gameplay
    
    // Calculate grid dimensions based on screen size
    const horizontalCells = Math.floor(availableWidth / targetCellSize);
    const verticalCells = Math.floor(availableHeight / targetCellSize);
    
    // Calculate actual cell size to fit perfectly
    const cellWidth = availableWidth / horizontalCells;
    const cellHeight = availableHeight / verticalCells;
    const cellSize = Math.min(cellWidth, cellHeight);
    
    return {
      GRID_WIDTH: horizontalCells, // Horizontal grid size
      GRID_HEIGHT: verticalCells,  // Vertical grid size  
      GRID_SIZE: baseGridSize, // Keep for compatibility, but we'll use GRID_WIDTH/HEIGHT
      CELL_SIZE: cellSize,
      BOARD_WIDTH: windowWidth, // Full screen width
      BOARD_HEIGHT: windowHeight - 100, // Full screen height minus header space
    };
  };
  
  const [gameDimensions, setGameDimensions] = useState(calculateGameDimensions());
  
  // Update dimensions when difficulty changes
  useEffect(() => {
    setGameDimensions(calculateGameDimensions());
  }, [difficulty]);
  
  // Get initial snake position based on current grid size
  const getInitialSnake = () => {
    const middleX = Math.floor(gameDimensions.GRID_WIDTH / 2);
    const middleY = Math.floor(gameDimensions.GRID_HEIGHT / 2);
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