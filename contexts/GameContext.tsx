import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { ObstacleType } from '@/components/Obstacle';
import { usePowerUps, PowerUpType } from '@/hooks/usePowerUps';
import { useAuth } from '@/contexts/AuthContext';
import apiService from '@/services/apiService';
import robustGameStorage from '@/services/robustGameStorage';
import safeConsole from '@/utils/safeConsole';

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
  syncGameData: () => Promise<void>; // Sync local data with server
  
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
  const [initError, setInitError] = useState<string | null>(null);
  
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
  const [isStorageLoaded, setIsStorageLoaded] = useState(false);
  
  // Get auth context - must be called unconditionally (React hooks rule)
  const authContext = useAuth();
  const isAuthenticated = authContext?.isAuthenticated || false;
  const setOnSyncGameData = authContext?.setOnSyncGameData;
  
  // Create a ref for sync in progress
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Load game data from local storage on mount
  useEffect(() => {
    const initializeGameData = async () => {
      // Skip local storage completely in production to prevent crashes
      if (!__DEV__) {
        setIsStorageLoaded(true);
        return;
      }
      
      try {
        await loadGameData();
      } catch (error) {
        safeConsole.error('Failed to initialize game data:', error);
        // Set storage loaded anyway to prevent blocking
        setIsStorageLoaded(true);
      }
    };
    
    // Small delay to ensure native modules are ready
    const initTimer = setTimeout(() => {
      initializeGameData();
    }, 50);
    
    // Cleanup timeout on unmount
    return () => {
      clearTimeout(initTimer);
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, []);
  
  // Load game data from local storage
  const loadGameData = async () => {
    try {
      const data = await robustGameStorage.getGameData();
      if (__DEV__) {
        safeConsole.log('📦 Loaded game data from storage:', data);
      }
      
      setRewardPoints(data.gems);
      setHearts(data.hearts);
      setUnlockedLevels(new Set(data.unlockedLevels));
      setHighScore(data.highScore);
      setIsStorageLoaded(true);
    } catch (error) {
      safeConsole.error('Failed to load game data:', error);
      setIsStorageLoaded(true);
    }
  };
  
  // Debounced sync to server - use ref to avoid recreating
  const debouncedSync = useCallback(() => {
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }
    
    syncTimeoutRef.current = setTimeout(async () => {
      if (!isAuthenticated) return;
      
      try {
        safeConsole.log('🔄 Syncing game data with server...');
        
        // Get current local data from storage to ensure we have the latest
        const localData = await robustGameStorage.getGameData();
        
        safeConsole.log('📤 Sending local data to server:', localData);
        
        const serverData = {
          gems: localData.gems,
          hearts: localData.hearts,
          unlocked_levels: localData.unlockedLevels,
          high_score: localData.highScore,
        };
        
        const response = await apiService.syncGameData(serverData);
        
        safeConsole.log('📥 Received server data:', response);
        
        // Merge server data with local data (take the maximum values)
        const mergedGems = Math.max(localData.gems, response.gems || 0);
        const mergedHearts = Math.max(localData.hearts, response.hearts || 0);
        const mergedHighScore = Math.max(localData.highScore, response.high_score || 0);
        
        // Merge unlocked levels (union of both sets)
        const serverLevels = new Set(response.unlocked_levels || [1]);
        const mergedLevels = new Set([...localData.unlockedLevels, ...Array.from(serverLevels)]);
        
        // Only update state if values changed
        setRewardPoints(mergedGems);
        setHearts(mergedHearts);
        setHighScore(mergedHighScore);
        setUnlockedLevels(mergedLevels);
        
        await robustGameStorage.updateLastSync();
        
        safeConsole.log('✅ Game data synced successfully');
      } catch (error) {
        safeConsole.error('❌ Failed to sync game data:', error);
      }
    }, 2000);
  }, [isAuthenticated]); // Only depend on isAuthenticated
  
  // Save gems to local storage whenever they change
  useEffect(() => {
    if (isStorageLoaded && __DEV__) {
      robustGameStorage.saveGems(rewardPoints).catch(() => {});
      safeConsole.log('💎 Saved gems to storage:', rewardPoints);
    }
    
    // If authenticated, debounce sync to server (works in production)
    if (isStorageLoaded && isAuthenticated) {
      debouncedSync();
    }
  }, [rewardPoints, isStorageLoaded, isAuthenticated]);
  
  // Save hearts to local storage whenever they change
  useEffect(() => {
    if (isStorageLoaded && __DEV__) {
      robustGameStorage.saveHearts(hearts).catch(() => {});
      safeConsole.log('❤️ Saved hearts to storage:', hearts);
    }
    
    // If authenticated, debounce sync to server (works in production)
    if (isStorageLoaded && isAuthenticated) {
      debouncedSync();
    }
  }, [hearts, isStorageLoaded, isAuthenticated]);
  
  // Save unlocked levels to local storage whenever they change
  useEffect(() => {
    if (isStorageLoaded && __DEV__) {
      const levelsArray = Array.from(unlockedLevels);
      robustGameStorage.saveUnlockedLevels(levelsArray).catch(() => {});
      safeConsole.log('🔓 Saved unlocked levels to storage:', levelsArray);
    }
    
    // If authenticated, debounce sync to server (works in production)
    if (isStorageLoaded && isAuthenticated) {
      debouncedSync();
    }
  }, [unlockedLevels, isStorageLoaded, isAuthenticated]);
  
  // Save high score to local storage whenever it changes
  useEffect(() => {
    if (isStorageLoaded && __DEV__) {
      robustGameStorage.saveHighScore(highScore).catch(() => {});
      safeConsole.log('🏆 Saved high score to storage:', highScore);
    }
    
    // If authenticated, debounce sync to server (works in production)
    if (isStorageLoaded && isAuthenticated) {
      debouncedSync();
    }
  }, [highScore, isStorageLoaded, isAuthenticated]);
  
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
    safeConsole.log("Setting new direction callback in context");
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
    safeConsole.log('🎯 submitScore called');
    safeConsole.log('   - isAuthenticated:', isAuthenticated);
    safeConsole.log('   - score:', score);
    safeConsole.log('   - gameStartTime:', gameStartTime);
    safeConsole.log('   - API Base URL:', apiService.getApiBaseUrl());
    
    if (!isAuthenticated) {
      safeConsole.log('❌ User not authenticated, skipping score submission');
      return;
    }
    
    if (score === 0) {
      safeConsole.log('❌ Score is 0, skipping score submission');
      return;
    }
    
    if (!gameStartTime) {
      safeConsole.log('❌ No game start time, skipping score submission');
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
      
      safeConsole.log('📤 Submitting score:', scoreData);
      safeConsole.log('📤 API Token available:', !!apiService.getToken());
      
      const result = await apiService.submitScore(scoreData);
      
      safeConsole.log('✅ Score submitted successfully:', result);
    } catch (error) {
      safeConsole.error('❌ Failed to submit score:', error);
      // Log more details about the error
      if (error instanceof Error) {
        safeConsole.error('❌ Error message:', error.message);
        safeConsole.error('❌ Error stack:', error.stack);
      }
    }
  }, [isAuthenticated, score, gameStartTime, getActivePowerUps]);
  
  const endGame = useCallback(() => {
    safeConsole.log('🏁 Game ended - endGame called');
    setGameOver(true);
    setScore(current => {
      safeConsole.log('🏁 Final score:', current);
      if (current > highScore) {
        setHighScore(current);
      }
      return current;
    });
    // Submit score after game ends if user is authenticated
    safeConsole.log('🏁 Calling submitScore...');
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
  
  // Sync game data with server (called on login or when authenticated)
  const syncGameData = useCallback(async () => {
    if (!isAuthenticated) {
      safeConsole.log('🔄 Not authenticated, skipping sync');
      return;
    }
    
    try {
      safeConsole.log('🔄 Syncing game data with server...');
      
      // Get current local data
      const localData = {
        gems: rewardPoints,
        hearts: hearts,
        unlocked_levels: Array.from(unlockedLevels),
        high_score: highScore,
      };
      
      safeConsole.log('📤 Sending local data to server:', localData);
      
      // Send data to server
      const response = await apiService.syncGameData(localData);
      
      safeConsole.log('📥 Received server data:', response);
      
      // Merge server data with local data (take the maximum values)
      const mergedGems = Math.max(rewardPoints, response.gems || 0);
      const mergedHearts = Math.max(hearts, response.hearts || 0);
      const mergedHighScore = Math.max(highScore, response.high_score || 0);
      
      // Merge unlocked levels (union of both sets)
      const serverLevels = new Set(response.unlocked_levels || [1]);
      const mergedLevels = new Set([...Array.from(unlockedLevels), ...Array.from(serverLevels)]);
      
      // Update state with merged data
      setRewardPoints(mergedGems);
      setHearts(mergedHearts);
      setHighScore(mergedHighScore);
      setUnlockedLevels(mergedLevels);
      
      // Update last sync timestamp
      await gameStorageService.updateLastSync();
      
      safeConsole.log('✅ Game data synced successfully');
      safeConsole.log('   - Gems:', mergedGems);
      safeConsole.log('   - Hearts:', mergedHearts);
      safeConsole.log('   - High Score:', mergedHighScore);
      safeConsole.log('   - Unlocked Levels:', Array.from(mergedLevels));
    } catch (error) {
      safeConsole.error('❌ Failed to sync game data:', error);
      // Don't throw error, just log it - we can continue with local data
    }
  }, [isAuthenticated, rewardPoints, hearts, unlockedLevels, highScore]);
  
  // Register sync callback with AuthContext only once
  useEffect(() => {
    // Only register if setOnSyncGameData is available
    if (setOnSyncGameData && typeof setOnSyncGameData === 'function') {
      try {
        setOnSyncGameData(syncGameData);
      } catch (error) {
        safeConsole.error('Failed to register sync callback:', error);
      }
    }
  }, [setOnSyncGameData]); // Only depend on setOnSyncGameData, not syncGameData itself
  
  const toggleControls = useCallback(() => {
    setShowControls(prev => !prev);
  }, []);
  
  // This function will be passed to the ControlPad component
  const handleDirectionChange = useCallback((direction: Position) => {
    safeConsole.log("Handling direction change in context:", direction);
    if (directionChangeCallbackRef.current) {
      safeConsole.log("Calling registered callback!");
      directionChangeCallbackRef.current(direction);
    } else {
      safeConsole.log("No direction callback registered");
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
    syncGameData,
    
    // Power-up methods
    isPowerUpActive,
    activatePowerUp,
    getPowerUpSpeedFactor,
    getActivePowerUps,
    
    // Direction callback setter
    setDirectionChangeCallback
  };
  
  if (initError) {
    // Render minimal UI if initialization failed
    return (
      <GameContext.Provider value={value}>
        {children}
      </GameContext.Provider>
    );
  }
  
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
