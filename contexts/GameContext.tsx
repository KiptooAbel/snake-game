// GameContext.tsx - Context for managing game state and passing down handlers
import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  
  // Game methods
  setScore: (score: number) => void;
  setHighScore: (score: number) => void;
  setDifficulty: (difficulty: string) => void;
  togglePause: () => void;
  startGame: () => void;
  endGame: () => void;
  restartGame: () => void;
  toggleControls: () => void;
  handleDirectionChange: (direction: { x: number, y: number }) => void;
  
  // Direction change callback
  directionChangeCallback: ((direction: { x: number, y: number }) => void) | null;
  setDirectionChangeCallback: (callback: ((direction: { x: number, y: number }) => void) | null) => void;
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
  
  // Direction change callback - this will be set by the GameBoard component
  const [directionChangeCallback, setDirectionChangeCallback] = useState<((direction: { x: number, y: number }) => void) | null>(null);
  
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
  };
  
  const toggleControls = () => setShowControls(prev => !prev);
  
  // This function will be passed to the ControlPad component
  const handleDirectionChange = (direction: { x: number, y: number }) => {
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