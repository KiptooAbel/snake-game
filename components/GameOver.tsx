// Enhanced GameOver.tsx with difficulty level display
import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useGame } from "@/contexts/GameContext";

interface GameOverProps {
  score: number;
  highScore: number;
  onRestart: () => void;
  onHome?: () => void;
}

export default function GameOver({ 
  score, 
  highScore, 
  onRestart,
  onHome
}: GameOverProps) {
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  // Is this a new high score?
  const isNewHighScore = score >= highScore && score > 0;

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
    <View style={styles.container}>
      {/* Background decorations matching MainMenu */}
      <View style={styles.backgroundDecorations}>
        <View style={[styles.decoration, styles.decoration1]} />
        <View style={[styles.decoration, styles.decoration2]} />
        <View style={[styles.decoration, styles.decoration3]} />
      </View>

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.gameOverText}>GAME OVER</Text>
        
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Your Score</Text>
          <Text style={styles.scoreValue}>{score}</Text>
          <Text style={styles.highScoreText}>High Score: {highScore}</Text>
        </View>
        
        {isNewHighScore && (
          <View style={styles.newHighScoreBadge}>
            <Text style={styles.badgeIcon}>🏆</Text>
            <Text style={styles.newHighScoreText}>New High Score!</Text>
          </View>
        )}
        
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.restartButton}
            onPress={onRestart}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#4CAF50', '#45a049', '#388E3C']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonIcon}>▶</Text>
              <Text style={styles.buttonText}>Play Again</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          {onHome && (
            <TouchableOpacity
              style={styles.homeButton}
              onPress={onHome}
              activeOpacity={0.8}
            >
              <View style={styles.homeButtonContent}>
                <Text style={styles.buttonIcon}>🏠</Text>
                <Text style={styles.buttonText}>Home</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </View>
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
    backgroundColor: "rgba(0, 0, 0, 0.95)",
  },
  backgroundDecorations: {
    position: "absolute",
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  decoration: {
    position: "absolute",
    borderRadius: 100,
    opacity: 0.05,
  },
  decoration1: {
    width: 200,
    height: 200,
    backgroundColor: "#4CAF50",
    top: -50,
    right: -50,
  },
  decoration2: {
    width: 150,
    height: 150,
    backgroundColor: "#FF1744",
    bottom: 100,
    left: -30,
  },
  decoration3: {
    width: 180,
    height: 180,
    backgroundColor: "#9C27B0",
    top: "40%",
    right: -70,
  },
  content: {
    alignItems: "center",
    padding: 20,
    width: "90%",
    maxWidth: 400,
  },
  gameOverText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#FF1744",
    marginBottom: 30,
    textShadowColor: "rgba(255, 23, 68, 0.4)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
    letterSpacing: 4,
  },
  scoreContainer: {
    marginBottom: 30,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingVertical: 25,
    paddingHorizontal: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.1)",
    width: "100%",
  },
  scoreLabel: {
    fontSize: 16,
    color: "#AAA",
    marginBottom: 8,
    letterSpacing: 1,
  },
  scoreValue: {
    fontSize: 56,
    fontWeight: "bold",
    color: "#4CAF50",
    textShadowColor: "rgba(76, 175, 80, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
  },
  highScoreText: {
    fontSize: 16,
    color: "#888",
    marginTop: 8,
  },
  newHighScoreBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 215, 0, 0.15)",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginBottom: 25,
    borderWidth: 2,
    borderColor: "#FFD700",
    gap: 8,
  },
  badgeIcon: {
    fontSize: 24,
  },
  newHighScoreText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFD700",
    letterSpacing: 1,
  },
  buttonsContainer: {
    width: "100%",
    gap: 15,
  },
  restartButton: {
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#4CAF50",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 12,
  },
  buttonGradient: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  homeButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "rgba(33, 150, 243, 0.5)",
    shadowColor: "#2196F3",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  homeButtonContent: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  buttonIcon: {
    fontSize: 20,
    color: "white",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 1,
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