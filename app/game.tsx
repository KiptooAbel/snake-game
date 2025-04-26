import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Snake from "@/components/Snake";
import Food from "@/components/Food";
import GameOver from "@/components/GameOver";  

const GRID_SIZE = 20;
const MOVE_INTERVAL = 100;

interface Position {
  x: number;
  y: number;
}

const INITIAL_SNAKE: Position[] = [{ x: 5, y: 5 }];
const INITIAL_DIRECTION: Position = { x: 1, y: 0 };

const GameScreen: React.FC = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState<Position>({ x: 10, y: 10 });
  const [score, setScore] = useState(0);  // ✅ Track score
  const [gameOver, setGameOver] = useState(false);  

  useEffect(() => {
    const gameLoop = setInterval(() => {
      if (!gameOver) moveSnake();
    }, MOVE_INTERVAL);
    return () => clearInterval(gameLoop);
  }, [snake, gameOver]);

  const moveSnake = () => {
    let newSnake = [...snake];
    let head = { x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y };

    if (
      head.x < 0 || head.x >= GRID_SIZE || 
      head.y < 0 || head.y >= GRID_SIZE || 
      newSnake.some(segment => segment.x === head.x && segment.y === head.y)
    ) {
      setGameOver(true);
      return;
    }

    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      setFood({
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      });
      setScore(score + 1);  // ✅ Increase score
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  const restartGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);  // ✅ Reset score
    setGameOver(false);
  };

  const swipeGesture = Gesture.Pan()
  .activateAfterLongPress(0)
  .shouldCancelWhenOutside(false)
  .onEnd((event) => {
    const { translationX, translationY } = event;
    console.log("Swipe Detected: ", translationX, translationY); // 🟢 Log swipe input

    if (Math.abs(translationX) > Math.abs(translationY)) {
      if (translationX > 0 && direction.x === 0) {
        console.log("Swiped RIGHT"); // ✅ Debug log
        setDirection({ x: 1, y: 0 });
      } else if (translationX < 0 && direction.x === 0) {
        console.log("Swiped LEFT");
        setDirection({ x: -1, y: 0 });
      }
    } else {
      if (translationY > 0 && direction.y === 0) {
        console.log("Swiped DOWN");
        setDirection({ x: 0, y: 1 });
      } else if (translationY < 0 && direction.y === 0) {
        console.log("Swiped UP");
        setDirection({ x: 0, y: -1 });
      }
    }
  });



  return (
    <GestureDetector gesture={swipeGesture}>
      <View style={styles.container}>
        <Text style={styles.score}>Score: {score}</Text>  
        {gameOver ? (
          <GameOver onRestart={restartGame} />  
        ) : (
          <>
            <Snake snake={snake} />
            <Food position={food} />
          </>
        )}
      </View>
    </GestureDetector>
  );
};

export default GameScreen;

const styles = StyleSheet.create({
  container: {
    width: GRID_SIZE * 20,
    height: GRID_SIZE * 20,
    backgroundColor: "black",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  score: {
    position: "absolute",
    top: 20,
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
  },
});
