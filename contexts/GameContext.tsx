// Modified GameContext.tsx
import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { ObstacleType } from '@/components/Obstacle';
import { usePowerUps, PowerUpType } from '@/hooks/usePowerUps';
import { useAuth } from '@/contexts/AuthContext';
import apiService from '@/services/apiService';

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
  gameStartTime: number | null;
  
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
  submitScore: () => Promise<void>;
  
  // Power-up methods
  isPowerUpActive: (type: PowerUpType) => boolean;
  activatePowerUp: (type: PowerUpType, duration: number, speedFactor?: number) => void;
  getPowerUpSpeedFactor: () => number;
  getActivePowerUps: () => { type: PowerUpType, remainingTime: number }[];
  
  // Direction change callback
  setDirectionChangeCallback: (callback: (direction: Position) => void) => void;
}

// Create the context with a default value
const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
interface GameProviderProps {
  children: React.ReactNode;
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
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  
  // Get auth context
  const { isAuthenticated } = useAuth();
  
  // Get power-ups methods
  const { 
    isPowerUpActive, 
    addPowerUp: activatePowerUp, 
    getSpeedFactor: getPowerUpSpeedFactor,
    getActivePowerUps 
  } = usePowerUps();
  
  // Reference to the direction change callback to ensure it persists
  const directionChangeCallbackRef = useRef<((direction: Position) => void) | null>(null);
  
  // Set the direction change callback
  const setDirectionChangeCallback = useCallback((callback: (direction: Position) => void) => {
    console.log("Setting new direction callback in context");
    directionChangeCallbackRef.current = callback;
  }, []);
  
  // Game methods
  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);
  
  const startGame = useCallback(() => {
    setGameStarted(true);
    setGameOver(false);
    setIsPaused(false);
    setGameStartTime(Date.now());
  }, []);
  
  const submitScore = useCallback(async () => {
    if (!isAuthenticated || score === 0 || !gameStartTime) {
      return;
    }

    try {
      const gameDuration = Math.floor((Date.now() - gameStartTime) / 1000);
      const level = Math.floor(score / 100) + 1; // Simple level calculation
      
      await apiService.submitScore({
        score,
        level,
        game_duration: gameDuration,
        difficulty: difficulty.toLowerCase(),
        game_stats: {
          obstacles_count: obstacles.length,
          power_ups_used: getActivePowerUps().length,
        },
      });
      
      console.log('Score submitted successfully');
    } catch (error) {
      console.error('Failed to submit score:', error);
    }
  }, [isAuthenticated, score, gameStartTime, difficulty, obstacles.length, getActivePowerUps]);
  
  const endGame = useCallback(() => {
    setGameOver(true);
    setScore(current => {
      if (current > highScore) {
        setHighScore(current);
      }
      return current;
    });
    // Submit score after game ends if user is authenticated
    submitScore();
  }, [highScore, submitScore]);
  
  const restartGame = useCallback(() => {
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setGameStarted(true);
    setGameStartTime(Date.now());
    // Don't clear obstacles here - let GameBoard handle it
  }, []);
  
  const toggleControls = useCallback(() => {
    setShowControls(prev => !prev);
  }, []);
  
  // Add a new obstacle
  const addObstacle = useCallback((obstacle: ObstaclePosition) => {
    setObstacles(prev => [...prev, obstacle]);
  }, []);
  
  // Remove an obstacle at a specific position
  const removeObstacle = useCallback((position: Position) => {
    setObstacles(prev => 
      prev.filter(obstacle => 
        obstacle.position.x !== position.x || obstacle.position.y !== position.y
      )
    );
  }, []);
  
  // This function will be passed to the ControlPad component
  const handleDirectionChange = useCallback((direction: Position) => {
    console.log("Handling direction change in context:", direction);
    if (directionChangeCallbackRef.current) {
      console.log("Calling registered callback!");
      directionChangeCallbackRef.current(direction);
    } else {
      console.log("No direction callback registered");
    }
  }, []);
  
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
    gameStartTime,
    
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
    submitScore,
    
    // Power-up methods
    isPowerUpActive,
    activatePowerUp,
    getPowerUpSpeedFactor,
    getActivePowerUps,
    
    // Direction callback setter
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