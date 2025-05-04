// GameBoard.tsx - Contains the main game logic and rendering
import React, { useState, useEffect, useRef } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Snake from "@/components/Snake";
import Food from "@/components/Food";
import GameOver from "@/components/GameOver";
import { useGameDimensions } from "@/hooks/useGameDimensions";
import { useFoodTypes } from "@/hooks/useFoodTypes";
import { useGameSpeed } from "@/hooks/useGameSpeed";
import { useGame } from "@/contexts/GameContext";

interface Position {
  x: number;
  y: number;
}

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
    setDirectionChangeCallback
  } = useGame();

  // Get game dimensions based on difficulty
  const { gameDimensions, getInitialSnake } = useGameDimensions(difficulty);
  const { GRID_SIZE, CELL_SIZE, BOARD_WIDTH, BOARD_HEIGHT } = gameDimensions;
  
  // Get food types and their probabilities
  const { generateFoodType } = useFoodTypes(difficulty);
  
  // Get game speed based on score and difficulty
  const { getSpeed } = useGameSpeed(difficulty);
  
  // Game state
  const INITIAL_DIRECTION: Position = { x: 1, y: 0 };
  const [snake, setSnake] = useState(getInitialSnake());
  const [direction, setDirection] = useState<Position>(INITIAL_DIRECTION);
  const [nextDirection, setNextDirection] = useState<Position>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Position>({ x: 10, y: 10 });
  const [foodType, setFoodType] = useState<string>("REGULAR");
  
  // Refs for game loop
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  
  // Generate food in a position not occupied by the snake
  const generateFood = () => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (
      snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)
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
    setFoodType("REGULAR");
    setFood(generateFood());
  };

  // Game loop
  useEffect(() => {
    if (gameOver || isPaused || !gameStarted) return;
    
    const moveSnake = () => {
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

      newSnake.unshift(head);

      // Check for food collision
      if (head.x === food.x && head.y === food.y) {
        // Calculate points to add based on food type
        let pointsToAdd = 1;
        if (foodType === "GOLDEN") pointsToAdd = 3;
        
        const newScore = score + pointsToAdd;
        setScore(newScore);
        
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
  }, [snake, gameOver, isPaused, gameStarted, nextDirection, score, difficulty]);

  const changeDirection = (newDir: Position) => {
    // Safely check direction - ensure it's not null before accessing properties
    if (!direction || !newDir) return;
    
    // Prevent 180-degree turns
    if (
      (direction.x === 1 && newDir.x === -1) ||
      (direction.x === -1 && newDir.x === 1) ||
      (direction.y === 1 && newDir.y === -1) ||
      (direction.y === -1 && newDir.y === 1)
    ) {
      return;
    }
    
    setNextDirection(newDir);
  };

  // Register the direction change handler with the context
  useEffect(() => {
    setDirectionChangeCallback(changeDirection);
    
    return () => {
      setDirectionChangeCallback(null);
    };
  }, [direction]);

  const swipeGesture = Gesture.Pan()
    .activateAfterLongPress(0)
    .shouldCancelWhenOutside(false)
    .onEnd((event) => {
      if (gameOver || isPaused || !gameStarted) return;
      
      const { translationX, translationY } = event;
      
      if (Math.abs(translationX) > Math.abs(translationY)) {
        if (translationX > 0 && direction.x !== -1) {
          changeDirection({ x: 1, y: 0 });
        } else if (translationX < 0 && direction.x !== 1) {
          changeDirection({ x: -1, y: 0 });
        }
      } else {
        if (translationY > 0 && direction.y !== -1) {
          changeDirection({ x: 0, y: 1 });
        } else if (translationY < 0 && direction.y !== 1) {
          changeDirection({ x: 0, y: -1 });
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