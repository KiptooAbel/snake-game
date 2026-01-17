// useGameDimensions.ts - Simple hook for basic game dimensions (no mode-based sizing)
import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

// Get device dimensions for responsive design
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export const useGameDimensions = (level: number = 1) => {
  // Calculate consistent game dimensions regardless of mode
  const calculateGameDimensions = () => {
    // Use the full screen width and height
    const availableWidth = windowWidth;
    // Reserve more space for the header/buttons at the top (150px to be safe)
    const headerReservedSpace = 150;
    const availableHeight = windowHeight - headerReservedSpace;
    
    // Calculate appropriate cell size for good gameplay (fixed size)
    const targetCellSize = 20; // Fixed cell size for all modes
    
    // Calculate grid dimensions based on screen size
    const horizontalCells = Math.floor(availableWidth / targetCellSize);
    const verticalCells = Math.floor(availableHeight / targetCellSize);
    
    // Calculate actual cell size to fit perfectly
    const cellWidth = availableWidth / horizontalCells;
    const cellHeight = availableHeight / verticalCells;
    const cellSize = Math.min(cellWidth, cellHeight);
    
    // Calculate the exact board dimensions based on grid cells
    // This ensures the board height matches exactly the grid height
    const exactBoardWidth = horizontalCells * cellSize;
    const exactBoardHeight = verticalCells * cellSize;
    
    return {
      GRID_WIDTH: horizontalCells, // Horizontal grid size
      GRID_HEIGHT: verticalCells,  // Vertical grid size  
      GRID_SIZE: Math.min(horizontalCells, verticalCells), // Compatibility
      CELL_SIZE: cellSize,
      BOARD_WIDTH: exactBoardWidth, // Exact width based on grid cells
      BOARD_HEIGHT: exactBoardHeight, // Exact height based on grid cells
    };
  };

  const [gameDimensions, setGameDimensions] = useState(calculateGameDimensions());

  // Get initial snake position based on current grid size and level
  const getInitialSnake = () => {
    const middleX = Math.floor(gameDimensions.GRID_WIDTH / 2);
    const middleY = Math.floor(gameDimensions.GRID_HEIGHT / 2);
    
    // For level 3, avoid the corner L-walls and center horizontal walls
    if (level === 3) {
      // Place snake in the upper middle area, away from obstacles
      const safeX = middleX;
      const safeY = Math.floor(gameDimensions.GRID_HEIGHT / 3); // Upper third
      return [
        { x: safeX, y: safeY },
        { x: safeX - 1, y: safeY },
      ];
    }
    
    // Default position for levels 1 and 2
    return [
      { x: middleX, y: middleY },
      { x: middleX - 1, y: middleY },
    ];
  };

  return {
    gameDimensions,
    getInitialSnake,
  };
};