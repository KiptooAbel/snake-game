// Modified GameBoard.tsx with power-up integration and styles
import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Snake from "@/components/Snake";
import Food from "@/components/Food";
import Obstacle from "@/components/Obstacle";
import GameOver from "@/components/GameOver";
import PowerUpsDisplay from "@/components/PowerUpsDisplay";
import { useGameDimensions } from "@/hooks/useGameDimensions";
import { useFoodTypes } from "@/hooks/useFoodTypes";
import { useGameSpeed } from "@/hooks/useGameSpeed";
import { useObstacles } from "@/hooks/useObstacles";
import { useGame, Position, ObstaclePosition } from "@/contexts/GameContext";

const GameBoard: React.FC = () => {
  // Get game state and methods from context
  const {
    mode,
    gameStarted,
    gameOver,
    isPaused,
    score,
    highScore,
    setScore,
    startGame,
    endGame,
    restartGame,
    setDirectionChangeCallback,
    // Power-up related methods
    isPowerUpActive,
    activatePowerUp,
    getPowerUpSpeedFactor
  } = useGame();

  // Get game dimensions (no longer mode-dependent)
  const { gameDimensions, getInitialSnake } = useGameDimensions();
  const { GRID_SIZE, GRID_WIDTH, GRID_HEIGHT, CELL_SIZE, BOARD_WIDTH, BOARD_HEIGHT } = gameDimensions;
  
  // Get food types and their probabilities
  const { generateFoodType, getFoodProperties } = useFoodTypes(mode);
  
  // Get game speed based on score and mode
  const { getSpeed } = useGameSpeed(mode);
  
  // Get obstacle utilities (now returns empty/no-op functions)
  const { 
    generateInitialObstacles, 
    generateObstacle, 
    shouldAddObstacle, 
    checkObstacleCollision 
  } = useObstacles();
  
  // Game state
  const INITIAL_DIRECTION: Position = { x: 1, y: 0 };
  const [snake, setSnake] = useState(getInitialSnake());
  const [direction, setDirection] = useState<Position>(INITIAL_DIRECTION);
  const [nextDirection, setNextDirection] = useState<Position>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Position>({ x: 10, y: 10 });
  const [foodType, setFoodType] = useState<string>("REGULAR");
  const [lastScore, setLastScore] = useState<number>(0);
  
  // Refs for game loop and current direction
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const directionRef = useRef<Position>(INITIAL_DIRECTION);
  
  // Keep the ref up to date with the state
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);
  
  // Effect to handle game restarts
  useEffect(() => {
    if (gameStarted && gameOver) {
      // Game was restarted after game over
      resetGame();
    } else if (gameStarted && !gameOver) {
      // Normal game start
      if (snake.length === getInitialSnake().length) {
        // This is a fresh start, reset everything
        resetGame();
      }
    }
  }, [gameStarted, gameOver]);
  
  // Initialize obstacles when the game starts for the first time - REMOVED
  // No obstacles logic needed anymore

  // Reset obstacles when difficulty changes - REMOVED  
  // No obstacles logic needed anymore
  
  // Generate food in a position not occupied by the snake or obstacles
  const generateFood = () => {
    return generateFoodForSnake(snake);
  };

  // Set up initial food position
  useEffect(() => {
    const initialSnake = getInitialSnake();
    setFood(generateFoodForSnake(initialSnake));
  }, [gameDimensions]);

  // Update snake position when difficulty changes
  useEffect(() => {
    if (gameStarted) {
      resetGame();
    } else {
      setSnake(getInitialSnake());
    }
  }, [gameDimensions]);

  // Reset game - completely reset all game state
  const resetGame = () => {
    const initialSnake = getInitialSnake();
    setSnake(initialSnake);
    setDirection(INITIAL_DIRECTION);
    setNextDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFoodType("REGULAR");
    
    // Generate new food position
    const newFood = generateFoodForSnake(initialSnake);
    setFood(newFood);
    
    // Generate new obstacles - REMOVED (no obstacles)
  };
  
  // Generate food that doesn't conflict with snake or obstacles
  const generateFoodForSnake = (currentSnake: Position[]) => {
    let newFood: Position;
    let attempts = 0;
    const maxAttempts = 100;
    
    // Define safe margin from edges (at least 1 cell from edge, more for larger grids)
    const edgeMargin = Math.max(1, Math.min(3, Math.floor((GRID_WIDTH || GRID_SIZE) * 0.1)));
    const minX = edgeMargin;
    const maxX = (GRID_WIDTH || GRID_SIZE) - edgeMargin - 1;
    const minY = edgeMargin;
    const maxY = (GRID_HEIGHT || GRID_SIZE) - edgeMargin - 1;
    
    do {
      newFood = {
        x: Math.floor(Math.random() * (maxX - minX + 1)) + minX,
        y: Math.floor(Math.random() * (maxY - minY + 1)) + minY,
      };
      attempts++;
    } while (
      attempts < maxAttempts && (
        // Check collision with snake
        currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)
        // No obstacle collision check needed
      )
    );
    
    return newFood;
  };

  // Game loop
  useEffect(() => {
    if (gameOver || isPaused || !gameStarted) return;
    
    const moveSnake = () => {
      // Update current direction to next direction
      setDirection(nextDirection);
      
      let newSnake = [...snake];
      let head = { 
        x: newSnake[0].x + nextDirection.x, 
        y: newSnake[0].y + nextDirection.y 
      };

      // Handle wall collisions with wrap-around using new grid dimensions
      if (head.x < 0) head.x = (GRID_WIDTH || GRID_SIZE) - 1;
      if (head.x >= (GRID_WIDTH || GRID_SIZE)) head.x = 0;
      if (head.y < 0) head.y = (GRID_HEIGHT || GRID_SIZE) - 1;
      if (head.y >= (GRID_HEIGHT || GRID_SIZE)) head.y = 0;

      // Check for collision with self - add check for invincibility and ghost mode
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        if (!isPowerUpActive('INVINCIBILITY') && !isPowerUpActive('GHOST_MODE')) {
          endGame();
          return;
        }
      }
      
      // Check for collision with obstacles - REMOVED (no obstacles)
      // No obstacle collision needed

      newSnake.unshift(head);

      // Check for food collision
      if (head.x === food.x && head.y === food.y) {
        // Get food properties
        const foodProps = getFoodProperties(foodType);
        
        // Handle power-up effects
        if (foodProps.powerUpEffect) {
          // Activate the power-up
          activatePowerUp(
            foodProps.powerUpEffect,
            foodProps.duration,
            foodProps.speedFactor
          );
        }
        
        // Calculate points to add based on food type
        let pointsToAdd = foodProps.points;
        
        // Double points if the power-up is active
        if (isPowerUpActive('DOUBLE_POINTS')) {
          pointsToAdd *= 2;
        }
        
        const newScore = score + pointsToAdd;
        setScore(newScore);
        setLastScore(newScore);
        
        // Check if we should add a new obstacle - REMOVED (no obstacles)
        // No obstacle logic needed
        
        const newFood = generateFoodForSnake(newSnake);
        setFood(newFood);
        setFoodType(generateFoodType());
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    };

    // Modify speed calculation to consider power-ups
    const speed = getSpeed(score) * getPowerUpSpeedFactor();
    gameLoopRef.current = setInterval(moveSnake, speed);
    
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [
    snake, 
    gameOver, 
    isPaused, 
    gameStarted, 
    nextDirection, 
    score, 
    mode, 
    isPowerUpActive, 
    getPowerUpSpeedFactor
  ]);

  // Handle direction changes from controls and gestures
  const handleDirectionChange = useCallback((newDir: Position) => {
    console.log("Direction changing to:", newDir);
    
    // Get the current direction from the ref, not the state
    const currentDir = directionRef.current;
    
    // Prevent 180-degree turns
    if (
      (currentDir.x === 1 && newDir.x === -1) ||
      (currentDir.x === -1 && newDir.x === 1) ||
      (currentDir.y === 1 && newDir.y === -1) ||
      (currentDir.y === -1 && newDir.y === 1)
    ) {
      console.log("Prevented 180-degree turn");
      return;
    }
    
    // Debug logs for left button issue
    if (newDir.x === -1 && newDir.y === 0) {
      console.log("LEFT DIRECTION CHANGE ACCEPTED!");
      console.log("Current direction:", currentDir);
      console.log("Setting next direction to LEFT");
    }
    
    // Set the next direction
    setNextDirection(newDir);
  }, []);

  // Register the direction change handler on mount
  useEffect(() => {
    console.log("Registering direction change callback");
    setDirectionChangeCallback(handleDirectionChange);
  }, [handleDirectionChange]);

  const swipeGesture = Gesture.Pan()
    .minDistance(30) // Reduced minimum distance for better responsiveness
    .shouldCancelWhenOutside(false)
    .onEnd((event) => {
      if (gameOver || isPaused || !gameStarted) return;
      
      try {
        const { translationX, translationY } = event;
        
        // Require minimum swipe distance to prevent accidental triggers
        const minSwipeDistance = 20; // Reduced for better sensitivity
        if (Math.abs(translationX) < minSwipeDistance && Math.abs(translationY) < minSwipeDistance) {
          return;
        }
        
        if (Math.abs(translationX) > Math.abs(translationY)) {
          if (translationX > 0) {
            handleDirectionChange({ x: 1, y: 0 });
          } else if (translationX < 0) {
            handleDirectionChange({ x: -1, y: 0 });
          }
        } else {
          if (translationY > 0) {
            handleDirectionChange({ x: 0, y: 1 });
          } else if (translationY < 0) {
            handleDirectionChange({ x: 0, y: -1 });
          }
        }
      } catch (error) {
        console.error('Swipe gesture error:', error);
      }
    });

  return (
    <GestureDetector gesture={swipeGesture}>
      <View 
        style={[
          styles.fullScreenGameBoard, 
          { 
            width: BOARD_WIDTH, 
            height: BOARD_HEIGHT,
          }
        ]}
      >
        {/* Add PowerUpsDisplay here */}
        <PowerUpsDisplay />
        
        {gameOver ? (
          <GameOver 
            score={score} 
            highScore={highScore} 
            onRestart={restartGame}
            difficulty={mode} 
          />
        ) : (
          <>
            {!gameStarted ? (
              <TouchableOpacity 
                style={styles.startButton}
                onPress={startGame}
              >
                <Text style={styles.startButtonText}>START GAME</Text>
                <Text style={styles.difficultyLabel}>Mode: {mode}</Text>
                <Text style={styles.startHint}>Tap to change mode</Text>
              </TouchableOpacity>
            ) : (
              <>
                {/* No obstacles rendered */}
                
                <Snake snake={snake} cellSize={CELL_SIZE} />
                <Food 
                  position={food} 
                  cellSize={CELL_SIZE} 
                  foodType={foodType as any} 
                  difficulty={mode} 
                />
                
                {isPaused && (
                  <View style={styles.pauseOverlay}>
                    <Text style={styles.pauseText}>PAUSED</Text>
                    <TouchableOpacity 
                      style={styles.resumeButton}
                      onPress={() => isPaused && startGame()}
                    >
                      <Text style={styles.buttonText}>Resume</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
          </>
        )}
      </View>
    </GestureDetector>
  );
};

// Add the styles definition that was missing
const styles = StyleSheet.create({
  fullScreenGameBoard: {
    backgroundColor: "#0a0a0a", // Slightly darker background for game area distinction
    position: "relative",
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: "#333", // Subtle top border for additional visual separation
  },
  gameBoardContainer: {
    backgroundColor: "#111", // Darker background for container
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#333",
    overflow: "hidden",
    position: "relative",
    marginHorizontal: 10,
    marginVertical: 5,
    justifyContent: "center", // Center the game board within the taller container
    alignItems: "center",
  },
  gameBoard: {
    backgroundColor: "#222",
    borderRadius: 8, // Slightly reduced border radius
    borderWidth: 1, // Reduced border width
    borderColor: "#444",
    overflow: "hidden",
    position: "relative",
  },
  pauseOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  pauseText: {
    fontSize: 36,
    color: "white",
    fontWeight: "bold",
    marginBottom: 20,
  },
  resumeButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  startButton: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.85)", // Darker overlay for better distinction
  },
  startButtonText: {
    fontSize: 32,
    color: "#4CAF50",
    fontWeight: "bold",
    marginBottom: 15,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  difficultyLabel: {
    fontSize: 18,
    color: "white",
    marginBottom: 10,
  },
  startHint: {
    fontSize: 14,
    color: "#AAA",
  },
  powerUpIndicator: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 8,
    borderRadius: 5,
    zIndex: 10,
  },
  powerUpText: {
    color: "white",
    fontWeight: "bold",
  }
});

export default GameBoard;