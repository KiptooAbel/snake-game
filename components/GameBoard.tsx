// GameBoard.tsx - Fixed version with specific focus on left button
import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Snake from "@/components/Snake";
import Food from "@/components/Food";
import Obstacle from "@/components/Obstacle";
import GameOver from "@/components/GameOver";
import { useGameDimensions } from "@/hooks/useGameDimensions";
import { useFoodTypes } from "@/hooks/useFoodTypes";
import { useGameSpeed } from "@/hooks/useGameSpeed";
import { useObstacles } from "@/hooks/useObstacles";
import { useGame, Position, ObstaclePosition } from "@/contexts/GameContext";

const GameBoard: React.FC = () => {
  // Get game state and methods from context
  const {
    difficulty,
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
    obstacles,
    setObstacles,
    addObstacle
  } = useGame();

  // Get game dimensions based on difficulty
  const { gameDimensions, getInitialSnake } = useGameDimensions(difficulty);
  const { GRID_SIZE, CELL_SIZE, BOARD_WIDTH, BOARD_HEIGHT } = gameDimensions;
  
  // Get food types and their probabilities
  const { generateFoodType } = useFoodTypes(difficulty);
  
  // Get game speed based on score and difficulty
  const { getSpeed } = useGameSpeed(difficulty);
  
  // Get obstacle utilities based on grid size and difficulty
  const { 
    generateInitialObstacles, 
    generateObstacle, 
    shouldAddObstacle, 
    checkObstacleCollision 
  } = useObstacles(difficulty, GRID_SIZE);
  
  // Game state
  const INITIAL_DIRECTION: Position = { x: 1, y: 0 };
  const [snake, setSnake] = useState(getInitialSnake());
  const [direction, setDirection] = useState<Position>(INITIAL_DIRECTION);
  const [nextDirection, setNextDirection] = useState<Position>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Position>({ x: 10, y: 10 });
  const [foodType, setFoodType] = useState<string>("REGULAR");
  const [lastScore, setLastScore] = useState<number>(0);
  
  // Refs for game loop and current direction
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const directionRef = useRef<Position>(INITIAL_DIRECTION);
  
  // Keep the ref up to date with the state
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);
  
  // Initialize obstacles when the game starts
  useEffect(() => {
    if (gameStarted && obstacles.length === 0) {
      const initialObstacles = generateInitialObstacles();
      setObstacles(initialObstacles);
    }
  }, [gameStarted]);
  
  // Reset obstacles when difficulty changes
  useEffect(() => {
    if (gameStarted) {
      const initialObstacles = generateInitialObstacles();
      setObstacles(initialObstacles);
    }
  }, [difficulty]);
  
  // Generate food in a position not occupied by the snake or obstacles
  const generateFood = () => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (
      // Check collision with snake
      snake.some(segment => segment.x === newFood.x && segment.y === newFood.y) ||
      // Check collision with obstacles
      checkObstacleCollision(newFood, obstacles)
    );
    
    // Determine new food type
    const newFoodType = generateFoodType();
    setFoodType(newFoodType);
    
    return newFood;
  };

  // Set up initial food position
  useEffect(() => {
    setFood(generateFood());
  }, [gameDimensions]);

  // Update snake position when difficulty changes
  useEffect(() => {
    if (gameStarted) {
      resetGame();
    } else {
      setSnake(getInitialSnake());
    }
  }, [gameDimensions]);

  // Reset game
  const resetGame = () => {
    setSnake(getInitialSnake());
    setDirection(INITIAL_DIRECTION);
    setNextDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFoodType("REGULAR");
    setFood(generateFood());
    setObstacles(generateInitialObstacles());
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

      // Handle wall collisions with wrap-around
      if (head.x < 0) head.x = GRID_SIZE - 1;
      if (head.x >= GRID_SIZE) head.x = 0;
      if (head.y < 0) head.y = GRID_SIZE - 1;
      if (head.y >= GRID_SIZE) head.y = 0;

      // Check for collision with self
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        endGame();
        return;
      }
      
      // Check for collision with obstacles
      if (checkObstacleCollision(head, obstacles)) {
        endGame();
        return;
      }

      newSnake.unshift(head);

      // Check for food collision
      if (head.x === food.x && head.y === food.y) {
        // Calculate points to add based on food type
        let pointsToAdd = 1;
        if (foodType === "GOLDEN") pointsToAdd = 3;
        
        const newScore = score + pointsToAdd;
        setScore(newScore);
        setLastScore(newScore);
        
        // Check if we should add a new obstacle based on score
        if (shouldAddObstacle(newScore, obstacles.length)) {
          const newObstacle = generateObstacle([
            ...newSnake.map(segment => ({ x: segment.x, y: segment.y })),
            food
          ]);
          addObstacle(newObstacle);
        }
        
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    };

    // Set up dynamic game speed based on score and difficulty
    gameLoopRef.current = setInterval(moveSnake, getSpeed(score));
    
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [snake, gameOver, isPaused, gameStarted, nextDirection, score, difficulty, obstacles]);

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
    .activateAfterLongPress(0)
    .shouldCancelWhenOutside(false)
    .onEnd((event) => {
      if (gameOver || isPaused || !gameStarted) return;
      
      const { translationX, translationY } = event;
      
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
    });

  return (
    <GestureDetector gesture={swipeGesture}>
      <View 
        style={[
          styles.gameBoard, 
          { 
            width: BOARD_WIDTH, 
            height: BOARD_HEIGHT 
          }
        ]}
      >
        {gameOver ? (
          <GameOver 
            score={score} 
            highScore={highScore} 
            onRestart={restartGame}
            difficulty={difficulty} 
          />
        ) : (
          <>
            {!gameStarted ? (
              <TouchableOpacity 
                style={styles.startButton}
                onPress={startGame}
              >
                <Text style={styles.startButtonText}>START GAME</Text>
                <Text style={styles.difficultyLabel}>Difficulty: {difficulty}</Text>
                <Text style={styles.startHint}>Tap to change difficulty</Text>
              </TouchableOpacity>
            ) : (
              <>
                {/* Render all obstacles */}
                {obstacles.map((obstacle, index) => (
                  <Obstacle
                    key={`obstacle-${index}`}
                    position={obstacle.position}
                    cellSize={CELL_SIZE}
                    type={obstacle.type}
                  />
                ))}
                
                <Snake snake={snake} cellSize={CELL_SIZE} />
                <Food 
                  position={food} 
                  cellSize={CELL_SIZE} 
                  foodType={foodType as 'REGULAR' | 'GOLDEN' | 'SPEED'} 
                  difficulty={difficulty} 
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

export default GameBoard;

const styles = StyleSheet.create({
  gameBoard: {
    backgroundColor: "#222",
    borderRadius: 10,
    borderWidth: 2,
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
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  startButtonText: {
    fontSize: 32,
    color: "#4CAF50",
    fontWeight: "bold",
    marginBottom: 15,
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
});