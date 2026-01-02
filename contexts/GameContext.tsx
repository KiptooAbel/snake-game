// Modified GameContext.tsx
import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

// Local storage keys
const STORAGE_KEYS = {
  GEMS: '@game_gems',
  HEARTS: '@game_hearts',
  UNLOCKED_LEVELS: '@game_unlocked_levels',
  HIGH_SCORE: '@game_high_score',
};

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  console.log('🎮 GameProvider rendering');
  
  // Game state
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
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
  const [localDataLoaded, setLocalDataLoaded] = useState(false); // Track if local data has been loaded
  
  // Get auth context with proper null handling
  let isAuthenticated = false;
  let authContext: any = null;
  try {
    authContext = useAuth();
    isAuthenticated = authContext?.isAuthenticated || false;
  } catch (error) {
    // AuthContext not available yet, use default
    console.log('AuthContext not available in GameProvider, using defaults');
  }
  
  // Load local data on mount (for non-authenticated users)
  useEffect(() => {
    const loadLocalData = async () => {
      if (!authContext?.user && !localDataLoaded) {
        try {
          console.log('📱 Loading local game data...');
          
          const [gemsStr, heartsStr, levelsStr, highScoreStr] = await Promise.all([
            AsyncStorage.getItem(STORAGE_KEYS.GEMS),
            AsyncStorage.getItem(STORAGE_KEYS.HEARTS),
            AsyncStorage.getItem(STORAGE_KEYS.UNLOCKED_LEVELS),
            AsyncStorage.getItem(STORAGE_KEYS.HIGH_SCORE),
          ]);
          
          if (gemsStr !== null) {
            const gems = parseInt(gemsStr, 10);
            console.log('💎 Loaded local gems:', gems);
            setRewardPoints(gems);
          }
          
          if (heartsStr !== null) {
            const localHearts = parseInt(heartsStr, 10);
            console.log('❤️ Loaded local hearts:', localHearts);
            setHearts(localHearts);
          } else {
            // Default hearts for new users
            setHearts(5);
            await AsyncStorage.setItem(STORAGE_KEYS.HEARTS, '5');
          }
          
          if (levelsStr !== null) {
            const levels = JSON.parse(levelsStr);
            console.log('🔓 Loaded local unlocked levels:', levels);
            setUnlockedLevels(new Set([1, ...levels]));
          }
          
          if (highScoreStr !== null) {
            const localHighScore = parseInt(highScoreStr, 10);
            console.log('🏆 Loaded local high score:', localHighScore);
            setHighScore(localHighScore);
          }
          
          setLocalDataLoaded(true);
        } catch (error) {
          console.error('❌ Failed to load local game data:', error);
          // Set defaults on error
          setHearts(5);
          setLocalDataLoaded(true);
        }
      }
    };
    
    loadLocalData();
  }, [authContext?.user, localDataLoaded]);
  
  // Sync game data with user data from AuthContext when user logs in
  useEffect(() => {
    if (authContext?.user) {
      console.log('👤 User data loaded, syncing game state:', authContext.user);
      
      // Sync gems (reward points)
      if (typeof authContext.user.gems === 'number') {
        console.log('💎 Syncing gems:', authContext.user.gems);
        setRewardPoints(authContext.user.gems);
      }
      
      // Sync hearts
      if (typeof authContext.user.hearts === 'number') {
        console.log('❤️ Syncing hearts:', authContext.user.hearts);
        setHearts(authContext.user.hearts);
      }
      
      // Sync unlocked levels
      if (Array.isArray(authContext.user.unlocked_levels)) {
        console.log('🔓 Syncing unlocked levels:', authContext.user.unlocked_levels);
        setUnlockedLevels(new Set([1, ...authContext.user.unlocked_levels]));
      }
    } else if (localDataLoaded) {
      // If user logs out, load local data
      console.log('👤 No user, using local data');
    }
  }, [authContext?.user, localDataLoaded]);
  
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
      
      const scoreData = {
        score,
        level,
        game_duration: gameDuration,
        difficulty: 'normal',
        game_stats: {
          obstacles_count: 0, // Since obstacles are removed
          power_ups_used: getActivePowerUps().length,
        },
      };
      
      console.log('📤 Submitting score:', scoreData);
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
  }, [isAuthenticated, score, gameStartTime, getActivePowerUps]);
  
  const endGame = useCallback(() => {
    console.log('🏁 Game ended - endGame called');
    setGameOver(true);
    setScore(current => {
      console.log('🏁 Final score:', current);
      if (current > highScore) {
        const newHighScore = current;
        setHighScore(newHighScore);
        
        // Save high score locally if not authenticated
        if (!authContext?.user) {
          AsyncStorage.setItem(STORAGE_KEYS.HIGH_SCORE, newHighScore.toString()).catch((err: Error) =>
            console.error('Failed to save high score locally:', err)
          );
        }
      }
      return current;
    });
    // Submit score after game ends if user is authenticated
    console.log('🏁 Calling submitScore...');
    submitScore();
  }, [highScore, submitScore, authContext]);
  
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
    setRewardPoints(prev => {
      const newValue = prev + points;
      // Sync with server if authenticated, otherwise save locally
      if (authContext?.user) {
        authContext.updateGems(points).catch((err: Error) => 
          console.error('Failed to sync gems with server:', err)
        );
      } else {
        AsyncStorage.setItem(STORAGE_KEYS.GEMS, newValue.toString()).catch((err: Error) =>
          console.error('Failed to save gems locally:', err)
        );
      }
      return newValue;
    });
  }, [authContext]);
  
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
      const newGems = rewardPoints - cost;
      setRewardPoints(newGems);
      setUnlockedLevels(prev => {
        const newLevels = new Set([...prev, levelNum]);
        const levelsArray = Array.from(newLevels).filter(l => l !== 1);
        
        // Sync with server if authenticated, otherwise save locally
        if (authContext?.user) {
          authContext.updateGems(-cost).catch((err: Error) => 
            console.error('Failed to sync gems with server:', err)
          );
          authContext.unlockLevel(levelNum).catch((err: Error) => 
            console.error('Failed to sync unlocked level with server:', err)
          );
        } else {
          AsyncStorage.setItem(STORAGE_KEYS.GEMS, newGems.toString()).catch((err: Error) =>
            console.error('Failed to save gems locally:', err)
          );
          AsyncStorage.setItem(STORAGE_KEYS.UNLOCKED_LEVELS, JSON.stringify(levelsArray)).catch((err: Error) =>
            console.error('Failed to save unlocked levels locally:', err)
          );
        }
        
        return newLevels;
      });
      
      return true;
    }
    return false;
  }, [rewardPoints, unlockedLevels, authContext]);
  
  // Add a heart
  const addHeart = useCallback(() => {
    setHearts(prev => {
      const newValue = prev + 1;
      // Sync with server if authenticated, otherwise save locally
      if (authContext?.user) {
        authContext.updateHearts(1).catch((err: Error) => 
          console.error('Failed to sync hearts with server:', err)
        );
      } else {
        AsyncStorage.setItem(STORAGE_KEYS.HEARTS, newValue.toString()).catch((err: Error) =>
          console.error('Failed to save hearts locally:', err)
        );
      }
      return newValue;
    });
  }, [authContext]);
  
  // Use a heart to continue playing
  const useHeart = useCallback(() => {
    if (hearts > 0) {
      setHearts(prev => {
        const newValue = prev - 1;
        // Sync with server if authenticated, otherwise save locally
        if (authContext?.user) {
          authContext.updateHearts(-1).catch((err: Error) => 
            console.error('Failed to sync hearts with server:', err)
          );
        } else {
          AsyncStorage.setItem(STORAGE_KEYS.HEARTS, newValue.toString()).catch((err: Error) =>
            console.error('Failed to save hearts locally:', err)
          );
        }
        return newValue;
      });
      return true;
    }
    return false;
  }, [hearts, authContext]);
  
  // Check if player has hearts
  const hasHearts = useCallback(() => {
    return hearts > 0;
  }, [hearts]);
  
  // Buy hearts with reward points (gems)
  const buyHearts = useCallback((count: number, cost: number) => {
    if (rewardPoints >= cost) {
      const newGems = rewardPoints - cost;
      setRewardPoints(newGems);
      setHearts(prev => {
        const newHearts = prev + count;
        
        // Sync with server if authenticated, otherwise save locally
        if (authContext?.user) {
          authContext.updateGems(-cost).catch((err: Error) => 
            console.error('Failed to sync gems with server:', err)
          );
          authContext.updateHearts(count).catch((err: Error) => 
            console.error('Failed to sync hearts with server:', err)
          );
        } else {
          AsyncStorage.setItem(STORAGE_KEYS.GEMS, newGems.toString()).catch((err: Error) =>
            console.error('Failed to save gems locally:', err)
          );
          AsyncStorage.setItem(STORAGE_KEYS.HEARTS, newHearts.toString()).catch((err: Error) =>
            console.error('Failed to save hearts locally:', err)
          );
        }
        
        return newHearts;
      });
      
      return true;
    }
    return false;
  }, [rewardPoints, authContext]);
  
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