// useObstacles.ts - Hook for obstacle generation and management
import { useState, useEffect } from 'react';
import { ObstacleType } from '@/components/Obstacle';
import { Position, ObstaclePosition } from '@/contexts/GameContext';

// Difficulty settings for obstacles
const OBSTACLE_SETTINGS = {
  EASY: {
    initialCount: 3,
    maxCount: 5,
    addFrequency: 20, // Add a new obstacle every 20 points
    types: ['STATIC'] as ObstacleType[], // Only static obstacles in easy mode
  },
  MEDIUM: {
    initialCount: 5,
    maxCount: 8,
    addFrequency: 15, // Add a new obstacle every 15 points
    types: ['STATIC', 'PULSING'] as ObstacleType[], // Static and pulsing obstacles
  },
  HARD: {
    initialCount: 7,
    maxCount: 12,
    addFrequency: 10, // Add a new obstacle every 10 points
    types: ['STATIC', 'PULSING', 'MOVING'] as ObstacleType[], // All obstacle types
  }
};

export const useObstacles = (difficulty: string, gridSize: number) => {
  // Get settings based on difficulty
  const getSettings = () => {
    const difficultyKey = difficulty as keyof typeof OBSTACLE_SETTINGS;
    return OBSTACLE_SETTINGS[difficultyKey] || OBSTACLE_SETTINGS.MEDIUM;
  };
  
  // Generate initial obstacles
  const generateInitialObstacles = (): ObstaclePosition[] => {
    const settings = getSettings();
    const obstacles: ObstaclePosition[] = [];
    
    // Create obstacles based on initial count for current difficulty
    for (let i = 0; i < settings.initialCount; i++) {
      obstacles.push(generateObstacle());
    }
    
    return obstacles;
  };
  
  // Generate a single obstacle
  const generateObstacle = (
    avoidPositions: Position[] = []
  ): ObstaclePosition => {
    const settings = getSettings();
    let position: Position = { x: 0, y: 0 }; // Initialize with default values
    let isOverlapping = true;
    
    // Define safe margin from edges (at least 1 cell from edge)
    const edgeMargin = Math.max(1, Math.min(3, Math.floor(gridSize * 0.1)));
    const minPos = edgeMargin;
    const maxPos = gridSize - edgeMargin - 1;
    
    // Keep generating positions until we find one that doesn't overlap
    while (isOverlapping) {
      position = {
        x: Math.floor(Math.random() * (maxPos - minPos + 1)) + minPos,
        y: Math.floor(Math.random() * (maxPos - minPos + 1)) + minPos,
      };
      
      // Check if position overlaps with any positions to avoid
      isOverlapping = avoidPositions.some(
        pos => pos.x === position.x && pos.y === position.y
      );
      
      // Don't place obstacles in the center starting area
      const centerX = Math.floor(gridSize / 2);
      const centerY = Math.floor(gridSize / 2);
      if (
        Math.abs(position.x - centerX) < 3 &&
        Math.abs(position.y - centerY) < 3
      ) {
        isOverlapping = true;
      }
    }
    
    // Select a random obstacle type from available types for this difficulty
    const typeIndex = Math.floor(Math.random() * settings.types.length);
    const type = settings.types[typeIndex];
    
    return {
      position,
      type,
    };
  };
  
  // Check if we should add a new obstacle based on score
  const shouldAddObstacle = (score: number, currentObstacleCount: number): boolean => {
    const settings = getSettings();
    
    // Only add if we're below the max count
    if (currentObstacleCount >= settings.maxCount) {
      return false;
    }
    
    // Add new obstacle when score is divisible by frequency
    // (e.g., on scores 20, 40, 60... in EASY mode)
    return score > 0 && score % settings.addFrequency === 0;
  };
  
  // Check if position collides with any obstacle
  const checkObstacleCollision = (
    position: Position,
    obstacles: ObstaclePosition[]
  ): boolean => {
    return obstacles.some(
      obstacle => 
        obstacle.position.x === position.x && 
        obstacle.position.y === position.y
    );
  };
  
  return {
    OBSTACLE_SETTINGS,
    generateInitialObstacles,
    generateObstacle,
    shouldAddObstacle,
    checkObstacleCollision,
  };
};