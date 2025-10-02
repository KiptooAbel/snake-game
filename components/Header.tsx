// Modified Header.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useGame } from "@/contexts/GameContext";
import { useAuth } from "@/contexts/AuthContext";
import PowerUpsDisplay from "@/components/PowerUpsDisplay";

interface HeaderProps {
  onDifficultyPress: () => void;
  onAuthPress: () => void;
  onProfilePress: () => void;
  onLeaderboardPress: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onDifficultyPress, 
  onAuthPress, 
  onProfilePress, 
  onLeaderboardPress 
}) => {
  // Get game state from context
  const { score, highScore, difficulty, gameStarted, gameOver } = useGame();
  const { isAuthenticated, user } = useAuth();
  
  // Determine if difficulty can be changed (only when game is not active)
  const canChangeDifficulty = !gameStarted || gameOver;
  
  // Get difficulty button color
  const getDifficultyColor = () => {
    switch(difficulty) {
      case "EASY": return "#4CAF50"; // Green
      case "MEDIUM": return "#FFC107"; // Amber
      case "HARD": return "#F44336"; // Red
      default: return "#FFC107";
    }
  };
  
  return (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>Score: {score}</Text>
          <Text style={styles.scoreText}>High Score: {highScore}</Text>
          {isAuthenticated && user && (
            <Text style={styles.userText}>Welcome, {user.first_name}!</Text>
          )}
        </View>
        
        <View style={styles.rightContainer}>
          <TouchableOpacity 
            style={[
              styles.difficultyButton,
              { 
                borderColor: getDifficultyColor(),
                opacity: canChangeDifficulty ? 1 : 0.5 
              }
            ]}
            onPress={canChangeDifficulty ? onDifficultyPress : undefined}
            disabled={!canChangeDifficulty}
          >
            <Text style={[
              styles.difficultyButtonText,
              { color: getDifficultyColor() }
            ]}>
              {difficulty}
            </Text>
          </TouchableOpacity>
          
          {/* Authentication and user buttons */}
          <View style={styles.authContainer}>
            {isAuthenticated ? (
              <>
                <TouchableOpacity 
                  style={styles.iconButton} 
                  onPress={onLeaderboardPress}
                >
                  <Text style={styles.iconButtonText}>🏆</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.iconButton} 
                  onPress={onProfilePress}
                >
                  <Text style={styles.iconButtonText}>👤</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity 
                style={styles.authButton} 
                onPress={onAuthPress}
              >
                <Text style={styles.authButtonText}>Login</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      
      {/* Add power-ups display below the header */}
      <View style={styles.powerUpsContainer}>
        <PowerUpsDisplay />
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  scoreContainer: {
    flex: 1,
  },
  scoreText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  userText: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "normal",
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  difficultyButton: {
    backgroundColor: "#333",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    borderWidth: 2,
  },
  difficultyButtonText: {
    fontWeight: "bold",
  },
  authContainer: {
    flexDirection: "row",
    gap: 5,
  },
  iconButton: {
    backgroundColor: "#333",
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#555",
  },
  iconButtonText: {
    fontSize: 16,
  },
  authButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  authButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  powerUpsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
});