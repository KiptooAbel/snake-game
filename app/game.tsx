// Enhanced game.tsx with improved features
import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import Snake from "@/components/Snake";
import Food from "@/components/Food";
import GameOver from "@/components/GameOver";
import ControlPad from "@/components/ControlPad";

// Get device dimensions for responsive design
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

// Calculate grid size based on screen dimensions
const GRID_SIZE = Math.floor(Math.min(windowWidth, windowHeight) / 25);
const CELL_SIZE = Math.floor(Math.min(windowWidth, windowHeight) / GRID_SIZE);
const BOARD_WIDTH = GRID_SIZE * CELL_SIZE;
const BOARD_HEIGHT = GRID_SIZE * CELL_SIZE;

const FOOD_TYPES = {
  REGULAR: { points: 1, color: "red", probability: 0.7 },
  GOLDEN: { points: 3, color: "gold", probability: 0.2 },
  SPEED: { points: 1, color: "blue", probability: 0.1, effect: "speed" }
};
// Adjust speed based on score
const getSpeed = (score) => {
  const baseSpeed = 150;
  const minSpeed = 80; // Fastest speed (minimum interval)
  const speedReduction = Math.min(score * 2, baseSpeed - minSpeed);
  return baseSpeed - speedReduction;
};

interface Position {
  x: number;
  y: number;
}

const INITIAL_SNAKE: Position[] = [
  { x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) },
  { x: Math.floor(GRID_SIZE / 2) - 1, y: Math.floor(GRID_SIZE / 2) },
];
const INITIAL_DIRECTION: Position = { x: 1, y: 0 };

const GameScreen: React.FC = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [nextDirection, setNextDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState<Position>({ x: 10, y: 10 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showControls, setShowControls] = useState(true);
  
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
    return newFood;
  };

  // Set up initial food position
  useEffect(() => {
    setFood(generateFood());
  }, []);

  // Game loop
  useEffect(() => {
    if (gameOver || isPaused) return;
    
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
        setGameOver(true);
        return;
      }

      newSnake.unshift(head);

      // Check for food collision
      if (head.x === food.x && head.y === food.y) {
        const newScore = score + 1;
        setScore(newScore);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    };

    // Set up dynamic game speed based on score
    gameLoopRef.current = setInterval(moveSnake, getSpeed(score));
    
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [snake, gameOver, isPaused, nextDirection, score]);

  // Update high score when game ends
  useEffect(() => {
    if (gameOver && score > highScore) {
      setHighScore(score);
    }
  }, [gameOver, score]);

  const changeDirection = (newDir: Position) => {
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

  const swipeGesture = Gesture.Pan()
    .activateAfterLongPress(0)
    .shouldCancelWhenOutside(false)
    .onEnd((event) => {
      if (gameOver || isPaused) return;
      
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

  const restartGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setNextDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  };

  const togglePause = () => {
    setIsPaused(prev => !prev);
  };

  const toggleControls = () => {
    setShowControls(prev => !prev);
  };

  const handleDirectionPress = (dir: Position) => {
    if (gameOver || isPaused) return;
    changeDirection(dir);
  };

  return (
    <GestureDetector gesture={swipeGesture}>
      <View style={styles.container}>
        <StatusBar style="light" />
        
        <View style={styles.header}>
          <Text style={styles.scoreText}>Score: {score}</Text>
          <Text style={styles.scoreText}>High Score: {highScore}</Text>
        </View>
        
        <View 
          style={[
            styles.gameBoard, 
            { width: BOARD_WIDTH, height: BOARD_HEIGHT }
          ]}
        >
          {gameOver ? (
            <GameOver score={score} highScore={highScore} onRestart={restartGame} />
          ) : (
            <>
              <Snake snake={snake} cellSize={CELL_SIZE} />
              <Food position={food} cellSize={CELL_SIZE} />
              
              {isPaused && (
                <View style={styles.pauseOverlay}>
                  <Text style={styles.pauseText}>PAUSED</Text>
                  <TouchableOpacity 
                    style={styles.resumeButton}
                    onPress={togglePause}
                  >
                    <Text style={styles.buttonText}>Resume</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>
        
        <View style={styles.controlsContainer}>
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={togglePause}
            >
              <Text style={styles.buttonText}>
                {isPaused ? "Resume" : "Pause"}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={toggleControls}
            >
              <Text style={styles.buttonText}>
                {showControls ? "Hide Controls" : "Show Controls"}
              </Text>
            </TouchableOpacity>
          </View>
          
          {showControls && !gameOver && (
            <ControlPad onDirectionPress={handleDirectionPress} />
          )}
        </View>
      </View>
    </GestureDetector>
  );
};

export default GameScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
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
  controlsContainer: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    width: "100%",
  },
  controlButton: {
    backgroundColor: "#333",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});