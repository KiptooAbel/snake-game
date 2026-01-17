// Modern Header.tsx - Displays game stats with modern design
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useGame } from "@/contexts/GameContext";
import { useAuth } from "@/contexts/AuthContext";
import PowerUpsDisplay from "@/components/PowerUpsDisplay";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  // Get game state from context
  const { score, highScore, level, gameStarted, gameOver, isPaused, togglePause, endGame, rewardPoints, hearts } = useGame();
  const { isAuthenticated, user } = useAuth();
  
  // Get level-based colors
  const getLevelColors = () => {
    switch(level) {
      case 1: return {
        bg: "rgba(10, 26, 10, 0.95)",
        accent: "#4CAF50"
      };
      case 2: return {
        bg: "rgba(46, 26, 16, 0.95)",
        accent: "#FF6B35"
      };
      case 3: return {
        bg: "rgba(26, 10, 46, 0.95)",
        accent: "#BA68C8"
      };
      default: return {
        bg: "rgba(10, 10, 10, 0.95)",
        accent: "#4CAF50"
      };
    }
  };
  
  const colors = getLevelColors();
  
  // If game is active and not over, show game controls
  if (gameStarted && !gameOver) {
    return (
      <View style={styles.headerContainer}>
        <View style={[styles.gameHeader, { backgroundColor: colors.bg }]}>
          {/* Left side - Controls */}
          <View style={styles.gameControls}>
            <TouchableOpacity 
              style={[styles.controlButton, styles.pauseButton]}
              onPress={togglePause}
            >
              <Text style={styles.controlIcon}>{isPaused ? "▶" : "⏸"}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.controlButton, styles.quitButton]}
              onPress={endGame}
            >
              <Text style={styles.controlIcon}>⏹</Text>
            </TouchableOpacity>
          </View>
          
          {/* Center - Score */}
          <View style={styles.scoreSection}>
            <View style={styles.scoreCard}>
              <Text style={[styles.scoreLabel, { color: colors.accent }]}>SCORE</Text>
              <Text style={styles.scoreValue}>{score}</Text>
            </View>
          </View>
          
          {/* Right side - Resources */}
          <View style={styles.resourcesSection}>
            <View style={styles.resourceItem}>
              <Text style={styles.resourceIcon}>💎</Text>
              <Text style={styles.resourceValue}>{rewardPoints}</Text>
            </View>
            <View style={styles.resourceItem}>
              <Text style={styles.resourceIcon}>❤️</Text>
              <Text style={styles.resourceValue}>{hearts}</Text>
            </View>
          </View>
        </View>
        
        {/* Power-ups display below the game header */}
        <View style={styles.powerUpsContainer}>
          <PowerUpsDisplay />
        </View>
      </View>
    );
  }
  
  // When game is not active, show minimal header with just stats
  return (
    <View style={styles.headerContainer}>
      <View style={[styles.header, { backgroundColor: colors.bg }]}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Score</Text>
            <Text style={[styles.statValue, { color: colors.accent }]}>{score}</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Best</Text>
            <Text style={[styles.statValue, { color: colors.accent }]}>{highScore}</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.resourceIcon}>💎</Text>
            <Text style={styles.statValue}>{rewardPoints}</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.resourceIcon}>❤️</Text>
            <Text style={styles.statValue}>{hearts}</Text>
          </View>
        </View>
        
        {isAuthenticated && user && (
          <Text style={[styles.welcomeText, { color: colors.accent }]}>
            Hey, {user.first_name}! 👋
          </Text>
        )}
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
  },
  header: {
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 8,
  },
  statCard: {
    alignItems: "center",
    minWidth: 60,
  },
  statLabel: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.6)",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  welcomeText: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "600",
  },
  gameHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 2,
    borderBottomColor: "rgba(255, 255, 255, 0.15)",
  },
  gameControls: {
    flexDirection: "row",
    gap: 8,
    flex: 1,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  pauseButton: {
    backgroundColor: "rgba(76, 175, 80, 0.2)",
    borderColor: "rgba(76, 175, 80, 0.4)",
  },
  quitButton: {
    backgroundColor: "rgba(244, 67, 54, 0.2)",
    borderColor: "rgba(244, 67, 54, 0.4)",
  },
  controlIcon: {
    fontSize: 18,
    color: "white",
  },
  scoreSection: {
    flex: 2,
    alignItems: "center",
  },
  scoreCard: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
  },
  scoreLabel: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 2,
    marginBottom: 2,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  resourcesSection: {
    flexDirection: "row",
    gap: 12,
    flex: 1,
    justifyContent: "flex-end",
  },
  resourceItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
    gap: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  resourceIcon: {
    fontSize: 16,
  },
  resourceValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
  powerUpsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 8,
  },
});
