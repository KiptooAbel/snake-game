// Enhanced GameOver.tsx with difficulty level display
import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { useGame } from "@/contexts/GameContext";

interface GameOverProps {
  score: number;
  highScore: number;
  difficulty: string;
  onRestart: () => void;
}

export default function GameOver({ 
  score, 
  highScore, 
  difficulty, 
  onRestart 
}: GameOverProps) {
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  // Is this a new high score?
  const isNewHighScore = score >= highScore && score > 0;

  // Get color based on difficulty
  const getDifficultyColor = () => {
    switch(difficulty) {
      case "EASY": return "#4CAF50"; // Green
      case "MEDIUM": return "#FFC107"; // Amber
      case "HARD": return "#F44336"; // Red
      default: return "#FFC107";
    }
  };

  useEffect(() => {
    // Run entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Text style={styles.gameOverText}>Game Over!</Text>
      
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>Your Score: {score}</Text>
        <Text style={styles.scoreText}>High Score: {highScore}</Text>
        <Text style={[styles.difficultyText, { color: getDifficultyColor() }]}>
          Difficulty: {difficulty}
        </Text>
      </View>
      
      {isNewHighScore && (
        <Text style={styles.newHighScoreText}>New High Score! 🏆</Text>
      )}
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.restartButton}
          onPress={onRestart}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Play Again</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.tipText}>
        Tip: Swipe or use the control pad to change direction
      </Text>
      
      {/* Show difficulty achievement message */}
      {difficulty === "HARD" && score > 10 && (
        <View style={styles.achievementContainer}>
          <Text style={styles.achievementText}>
            Impressive! You scored {score} points on HARD mode!
          </Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: 20,
  },
  gameOverText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  scoreContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  scoreText: {
    fontSize: 24,
    color: "white",
    marginVertical: 5,
  },
  difficultyText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  newHighScoreText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFD700", // Gold color
    marginBottom: 20,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  restartButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  tipText: {
    fontSize: 14,
    color: "#AAA",
    textAlign: "center",
    marginTop: 10,
  },
  achievementContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "rgba(244, 67, 54, 0.3)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(244, 67, 54, 0.5)",
  },
  achievementText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});