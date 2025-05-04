// GameContext.tsx - Context for managing game state and passing down handlers
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ObstacleType } from '@/components/Obstacle';

// Define obstacle position type
export interface Position {
  x: number;
  y: number;
}

// Define obstacle type with position and type info
export interface ObstaclePosition {
  position: Position;
  type: ObstacleType;
}

// Define the shape of our context
interface GameContextType {
  // Game state
  score: number;
  highScore: number;
  difficulty: string;
  isPaused: boolean;
  gameOver: boolean;
  gameStarted: boolean;
  showControls: boolean;
  obstacles: ObstaclePosition[];
  
  // Game methods
  setScore: (score: number) => void;
  setHighScore: (score: number) => void;
  setDifficulty: (difficulty: string) => void;
  togglePause: () => void;
  startGame: () => void;
  endGame: () => void;
  restartGame: () => void;
  toggleControls: () => void;
  handleDirectionChange: (direction: Position) => void;
  setObstacles: (obstacles: ObstaclePosition[]) => void;
  addObstacle: (obstacle: ObstaclePosition) => void;
  removeObstacle: (position: Position) => void;
  
  // Direction change callback
  directionChangeCallback: ((direction: Position) => void) | null;
  setDirectionChangeCallback: (callback: ((direction: Position) => void) | null) => void;
}

// Create the context with a default value
const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  // Game state
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [difficulty, setDifficulty] = useState("MEDIUM");
  const [isPaused, setIsPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [obstacles, setObstacles] = useState<ObstaclePosition[]>([]);
  
  // Direction change callback - this will be set by the GameBoard component
  const [directionChangeCallback, setDirectionChangeCallback] = useState<((direction: Position) => void) | null>(null);
  
  // Game methods
  const togglePause = () => setIsPaused(prev => !prev);
  
  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
  };
  
  const endGame = () => {
    setGameOver(true);
    if (score > highScore) {
      setHighScore(score);
    }
  };
  
  const restartGame = () => {
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setGameStarted(true);
    setObstacles([]); // Clear obstacles when restarting
  };
  
  const toggleControls = () => setShowControls(prev => !prev);
  
  // Add a new obstacle
  const addObstacle = (obstacle: ObstaclePosition) => {
    setObstacles(prev => [...prev, obstacle]);
  };
  
  // Remove an obstacle at a specific position
  const removeObstacle = (position: Position) => {
    setObstacles(prev => 
      prev.filter(obstacle => 
        obstacle.position.x !== position.x || obstacle.position.y !== position.y
      )
    );
  };
  
  // This function will be passed to the ControlPad component
  const handleDirectionChange = (direction: Position) => {
    if (directionChangeCallback) {
      directionChangeCallback(direction);
    }
  };
  
  // Create value object
  const value: GameContextType = {
    // State
    score,
    highScore,
    difficulty,
    isPaused,
    gameOver,
    gameStarted,
    showControls,
    obstacles,
    
    // Methods
    setScore,
    setHighScore,
    setDifficulty,
    togglePause,
    startGame,
    endGame,
    restartGame,
    toggleControls,
    handleDirectionChange,
    setObstacles,
    addObstacle,
    removeObstacle,
    
    // Direction callback
    directionChangeCallback,
    setDirectionChangeCallback
  };
  
  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use the game context
export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};