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
  level: number;
  isPaused: boolean;
  gameOver: boolean;
  gameStarted: boolean;
  showControls: boolean;
  gameStartTime: number | null;
  rewardPoints: number; // Points earned from special fruits to unlock levels
  fruitsEaten: number; // Track how many fruits eaten to trigger special fruits
  hearts: number; // Hearts for continuing after game over
  
  // Game methods
  setScore: (score: number) => void;
  setHighScore: (score: number) => void;
  setMode: (mode: string) => void;
  setLevel: (level: number) => void;
  togglePause: () => void;
  startGame: () => void;
  endGame: () => void;
  restartGame: () => void;
  toggleControls: () => void;
  handleDirectionChange: (direction: Position) => void;
  submitScore: () => Promise<void>;
  addRewardPoints: (points: number) => void;
  incrementFruitsEaten: () => void;
  isLevelUnlocked: (levelNum: number) => boolean;
  canUnlockLevel: (levelNum: number) => boolean;
  unlockLevel: (levelNum: number) => boolean;
  addHeart: () => void;
  useHeart: () => boolean;
  hasHearts: () => boolean;
  buyHearts: (count: number, cost: number) => boolean;
  
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
  const [level, setLevel] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [rewardPoints, setRewardPoints] = useState(0); // Reward points for unlocking levels
  const [fruitsEaten, setFruitsEaten] = useState(0); // Count of fruits eaten
  const [unlockedLevels, setUnlockedLevels] = useState<Set<number>>(new Set([1])); // Level 1 always unlocked
  const [hearts, setHearts] = useState(0); // Hearts for continuing after failure
  
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
    setFruitsEaten(0); // Reset fruits eaten on restart
    setGameOver(false);
    setIsPaused(false);
    setGameStarted(true);
    setGameStartTime(Date.now());
    // Don't clear obstacles here - let GameBoard handle it
  }, []);
  
  // Add reward points (from special fruits)
  const addRewardPoints = useCallback((points: number) => {
    setRewardPoints(prev => prev + points);
  }, []);
  
  // Increment fruits eaten counter
  const incrementFruitsEaten = useCallback(() => {
    setFruitsEaten(prev => prev + 1);
  }, []);
  
  // Check if a level is unlocked (has been purchased)
  const isLevelUnlocked = useCallback((levelNum: number) => {
    return unlockedLevels.has(levelNum);
  }, [unlockedLevels]);
  
  // Check if player can afford to unlock a level
  const canUnlockLevel = useCallback((levelNum: number) => {
    if (unlockedLevels.has(levelNum)) return false; // Already unlocked
    if (levelNum === 2) return rewardPoints >= 50;
    if (levelNum === 3) return rewardPoints >= 150;
    return false;
  }, [rewardPoints, unlockedLevels]);
  
  // Unlock a level by spending gems
  const unlockLevel = useCallback((levelNum: number) => {
    const cost = levelNum === 2 ? 50 : levelNum === 3 ? 150 : 0;
    if (cost > 0 && rewardPoints >= cost && !unlockedLevels.has(levelNum)) {
      setRewardPoints(prev => prev - cost);
      setUnlockedLevels(prev => new Set([...prev, levelNum]));
      return true;
    }
    return false;
  }, [rewardPoints, unlockedLevels]);
  
  // Add a heart
  const addHeart = useCallback(() => {
    setHearts(prev => prev + 1);
  }, []);
  
  // Use a heart to continue playing
  const useHeart = useCallback(() => {
    if (hearts > 0) {
      setHearts(prev => prev - 1);
      return true;
    }
    return false;
  }, [hearts]);
  
  // Check if player has hearts
  const hasHearts = useCallback(() => {
    return hearts > 0;
  }, [hearts]);
  
  // Buy hearts with reward points (gems)
  const buyHearts = useCallback((count: number, cost: number) => {
    if (rewardPoints >= cost) {
      setRewardPoints(prev => prev - cost);
      setHearts(prev => prev + count);
      return true;
    }
    return false;
  }, [rewardPoints]);
  
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
    level,
    isPaused,
    gameOver,
    gameStarted,
    showControls,
    gameStartTime,
    rewardPoints,
    fruitsEaten,
    hearts,
    
    // Methods
    setScore,
    setHighScore,
    setMode,
    setLevel,
    togglePause,
    startGame,
    endGame,
    restartGame,
    toggleControls,
    handleDirectionChange,
    submitScore,
    addRewardPoints,
    incrementFruitsEaten,
    isLevelUnlocked,
    canUnlockLevel,
    unlockLevel,
    addHeart,
    useHeart,
    hasHearts,
    buyHearts,
    
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