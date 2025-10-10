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
  const { score, highScore, difficulty, gameStarted, gameOver, isPaused, togglePause, endGame } = useGame();
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
  
  // If game is active and not over, show game controls
  if (gameStarted && !gameOver) {
    return (
      <View style={styles.headerContainer}>
        <View style={[styles.gameHeader, styles.gameHeaderBackground]}>
          <View style={styles.gameControls}>
            <TouchableOpacity 
              style={styles.gameButton}
              onPress={togglePause}
            >
              <Text style={styles.gameButtonText}>
                {isPaused ? "Resume" : "Pause"}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.gameButton, styles.quitButton]}
              onPress={endGame}
            >
              <Text style={styles.gameButtonText}>Quit</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.scoreDisplay}>
            <Text style={styles.currentScoreText}>Score: {score}</Text>
          </View>
        </View>
        
        {/* Add power-ups display below the header */}
        <View style={styles.powerUpsContainer}>
          <PowerUpsDisplay />
        </View>
      </View>
    );
  }
  
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
                <Text style={styles.authButtonText}>Sign In</Text>
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
    marginBottom: 5, // Reduced margin for more vertical space
    paddingVertical: 8, // Added minimal vertical padding
    backgroundColor: "#1a1a1a", // Use the welcome screen color
  },
  gameHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 10, // Increased margin for better spacing from game board
    paddingVertical: 12, // Increased vertical padding for more breathing room
  },
  gameHeaderBackground: {
    backgroundColor: "#1a1a1a", // Use the welcome screen color
    // Removed borderBottomWidth and borderBottomColor to eliminate duplicate border
  },
  gameControls: {
    flexDirection: "row",
    gap: 10,
  },
  gameButton: {
    backgroundColor: "#333", // Dark background for buttons
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#555", // Dark border
  },
  quitButton: {
    backgroundColor: "#F44336", // Keep red background for quit
    borderColor: "#F44336",
  },
  gameButtonText: {
    color: "white", // White text for dark background
    fontWeight: "bold",
    fontSize: 14,
  },
  scoreDisplay: {
    alignItems: "center",
  },
  currentScoreText: {
    fontSize: 18,
    color: "white", // Changed from green to white to match other screens
    fontWeight: "bold",
  },
  scoreContainer: {
    flex: 1,
  },
  scoreText: {
    fontSize: 18,
    color: "white", // White text for dark background
    fontWeight: "bold",
  },
  userText: {
    fontSize: 12,
    color: "#4CAF50", // Keep green for user text
    fontWeight: "normal",
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  difficultyButton: {
    backgroundColor: "#333", // Dark background
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    borderWidth: 2,
  },
  difficultyButtonText: {
    fontWeight: "bold",
    // Color will be set dynamically based on difficulty
  },
  authContainer: {
    flexDirection: "row",
    gap: 5,
  },
  iconButton: {
    backgroundColor: "#333", // Dark background
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#555", // Dark border
  },
  iconButtonText: {
    fontSize: 16,
  },
  authButton: {
    backgroundColor: "#4CAF50", // Keep green for auth button
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  authButtonText: {
    color: "white", // White text on green background
    fontWeight: "bold",
  },
  powerUpsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 5, // Reduced margin for more vertical space
  },
});