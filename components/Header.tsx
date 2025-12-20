// Modified Header.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useGame } from "@/contexts/GameContext";
import { useAuth } from "@/contexts/AuthContext";
import PowerUpsDisplay from "@/components/PowerUpsDisplay";

interface HeaderProps {
  onLevelPress: () => void;
  onAuthPress: () => void;
  onProfilePress: () => void;
  onLeaderboardPress: () => void;
  onShopPress: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onLevelPress,
  onAuthPress, 
  onProfilePress, 
  onLeaderboardPress,
  onShopPress
}) => {
  // Get game state from context
  const { score, highScore, level, gameStarted, gameOver, isPaused, togglePause, endGame, rewardPoints, hearts } = useGame();
  const { isAuthenticated, user } = useAuth();
  
  // Get level button color
  const getLevelColor = () => {
    switch(level) {
      case 1: return "#4CAF50"; // Green for level 1
      case 2: return "#8B4513"; // Brown for level 2
      case 3: return "#9C27B0"; // Purple for level 3
      default: return "#4CAF50";
    }
  };
  
  // Get level-based header background color
  const getHeaderBackgroundColor = () => {
    switch(level) {
      case 1: return "#1a1a1a"; // Dark for level 1
      case 2: return "#3E2723"; // Brown for level 2
      case 3: return "#4A148C"; // Purple for level 3
      default: return "#1a1a1a";
    }
  };
  
  // If game is active and not over, show game controls
  if (gameStarted && !gameOver) {
    return (
      <View style={styles.headerContainer}>
        <View style={[styles.gameHeader, { backgroundColor: getHeaderBackgroundColor() }]}>
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
            <Text style={styles.gemDisplay}>💎 {rewardPoints}</Text>
            <Text style={styles.heartDisplay}>❤️ {hearts}</Text>
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
      <View style={[styles.header, { backgroundColor: getHeaderBackgroundColor() }]}>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>Score: {score}</Text>
          <Text style={styles.scoreText}>High Score: {highScore}</Text>
          <Text style={styles.rewardPointsText}>💎 {rewardPoints}</Text>
          <Text style={styles.heartText}>❤️ {hearts}</Text>
          {isAuthenticated && user && (
            <Text style={styles.userText}>Welcome, {user.first_name}!</Text>
          )}
        </View>
        
        <View style={styles.rightContainer}>
          <View style={styles.gameSettingsContainer}>
            <TouchableOpacity 
              style={[
                styles.difficultyButton,
                styles.levelButton,
                { 
                  borderColor: getLevelColor(),
                  opacity: (!gameStarted || gameOver) ? 1 : 0.5 
                }
              ]}
              onPress={(!gameStarted || gameOver) ? onLevelPress : undefined}
              disabled={gameStarted && !gameOver}
            >
              <Text style={[
                styles.difficultyButtonText,
                { color: getLevelColor() }
              ]}>
                Level {level}
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Authentication and user buttons */}
          <View style={styles.authContainer}>
            <TouchableOpacity 
              style={[styles.iconButton, styles.shopButton]} 
              onPress={onShopPress}
            >
              <Text style={styles.iconButtonText}>🛒</Text>
            </TouchableOpacity>
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
  gameControls: {
    flexDirection: "row",
    gap: 10,
  },
  gameButton: {
    backgroundColor: "#8B4513", // Brown theme for buttons
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#A0522D", // Darker brown border
  },
  quitButton: {
    backgroundColor: "#9C27B0", // Purple for quit button
    borderColor: "#6A1B99",
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
  gemDisplay: {
    fontSize: 16,
    color: "#FFD700", // Gold color
    fontWeight: "bold",
    marginTop: 4,
  },
  heartDisplay: {
    fontSize: 16,
    color: "#FF1744", // Red color for hearts
    fontWeight: "bold",
    marginTop: 4,
  },
  scoreContainer: {
    flex: 1,
  },
  scoreText: {
    fontSize: 18,
    color: "white", // White text for dark background
    fontWeight: "bold",
  },
  rewardPointsText: {
    fontSize: 16,
    color: "#FFD700", // Gold color for reward points
    fontWeight: "bold",
    marginTop: 4,
  },
  heartText: {
    fontSize: 16,
    color: "#FF1744", // Red color for hearts
    fontWeight: "bold",
    marginTop: 4,
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
  gameSettingsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  difficultyButton: {
    backgroundColor: "#333", // Dark background
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    borderWidth: 2,
  },
  levelButton: {
    minWidth: 70, // Ensure consistent width for level button
  },
  difficultyButtonText: {
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
    // Color will be set dynamically based on difficulty
  },
  authContainer: {
    flexDirection: "row",
    gap: 5,
  },
  iconButton: {
    backgroundColor: "#8B4513", // Brown theme
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#A0522D", // Darker brown border
  },
  iconButtonText: {
    fontSize: 16,
  },
  shopButton: {
    backgroundColor: "#FF1744", // Red theme for shop
    borderColor: "#C62828",
  },
  authButton: {
    backgroundColor: "#9C27B0", // Purple theme for auth button
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