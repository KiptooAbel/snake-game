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
  mode: string;
  isPaused: boolean;
  gameOver: boolean;
  gameStarted: boolean;
  showControls: boolean;
  gameStartTime: number | null;
  
  // Game methods
  setScore: (score: number) => void;
  setHighScore: (score: number) => void;
  setMode: (mode: string) => void;
  togglePause: () => void;
  startGame: () => void;
  endGame: () => void;
  restartGame: () => void;
  toggleControls: () => void;
  handleDirectionChange: (direction: Position) => void;
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
  const [mode, setMode] = useState("NORMAL");
  const [isPaused, setIsPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showControls, setShowControls] = useState(true);
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
    console.log('🎯 submitScore called');
    console.log('   - isAuthenticated:', isAuthenticated);
    console.log('   - score:', score);
    console.log('   - gameStartTime:', gameStartTime);
    console.log('   - API Base URL:', apiService.getApiBaseUrl());
    
    if (!isAuthenticated) {
      console.log('❌ User not authenticated, skipping score submission');
      return;
    }
    
    if (score === 0) {
      console.log('❌ Score is 0, skipping score submission');
      return;
    }
    
    if (!gameStartTime) {
      console.log('❌ No game start time, skipping score submission');
      return;
    }

    try {
      const gameDuration = Math.floor((Date.now() - gameStartTime) / 1000);
      const level = Math.floor(score / 100) + 1; // Simple level calculation
      
      // Map frontend mode values to backend expected values
      const modeMap: { [key: string]: string } = {
        'EASY': 'easy',
        'NORMAL': 'normal',
        'HARD': 'hard'
      };
      
      const backendDifficulty = modeMap[mode] || mode.toLowerCase();
      
      const scoreData = {
        score,
        level,
        game_duration: gameDuration,
        difficulty: backendDifficulty,
        game_stats: {
          obstacles_count: 0, // Since obstacles are removed
          power_ups_used: getActivePowerUps().length,
        },
      };
      
      console.log('📤 Submitting score:', scoreData);
      console.log('📤 Original mode:', mode, '→ Mapped difficulty:', backendDifficulty);
      console.log('📤 API Token available:', !!apiService.getToken());
      
      const result = await apiService.submitScore(scoreData);
      
      console.log('✅ Score submitted successfully:', result);
    } catch (error) {
      console.error('❌ Failed to submit score:', error);
      // Log more details about the error
      if (error instanceof Error) {
        console.error('❌ Error message:', error.message);
        console.error('❌ Error stack:', error.stack);
      }
    }
  }, [isAuthenticated, score, gameStartTime, mode, getActivePowerUps]);
  
  const endGame = useCallback(() => {
    console.log('🏁 Game ended - endGame called');
    setGameOver(true);
    setScore(current => {
      console.log('🏁 Final score:', current);
      if (current > highScore) {
        setHighScore(current);
      }
      return current;
    });
    // Submit score after game ends if user is authenticated
    console.log('🏁 Calling submitScore...');
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
    mode,
    isPaused,
    gameOver,
    gameStarted,
    showControls,
    gameStartTime,
    
    // Methods
    setScore,
    setHighScore,
    setMode,
    togglePause,
    startGame,
    endGame,
    restartGame,
    toggleControls,
    handleDirectionChange,
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
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};