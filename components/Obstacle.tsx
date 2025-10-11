// Empty Obstacle component (obstacles removed)
import React from "react";

// Define obstacle types for compatibility
export type ObstacleType = 'STATIC' | 'PULSING' | 'MOVING';

// Add TypeScript annotations
interface ObstacleProps {
  position: { x: number; y: number };
  cellSize: number;
  type?: ObstacleType;
  isMoving?: boolean;
}

export default function Obstacle({ 
  position, 
  cellSize, 
  type = 'STATIC',
  isMoving = false
}: ObstacleProps) {
  // No obstacles rendered anymore
  return null;
}