import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useGame } from "@/contexts/GameContext";
import { useAuth } from "@/contexts/AuthContext";

interface MainMenuProps {
  onLevelPress: () => void;
  onAuthPress: () => void;
  onProfilePress: () => void;
  onLeaderboardPress: () => void;
  onShopPress: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({
  onLevelPress,
  onAuthPress,
  onProfilePress,
  onLeaderboardPress,
  onShopPress,
}) => {
  const { level, startGame } = useGame();
  const { isAuthenticated } = useAuth();

  // Get level button color
  const getLevelColor = () => {
    switch (level) {
      case 1:
        return "#4CAF50"; // Green for level 1
      case 2:
        return "#8B4513"; // Brown for level 2
      case 3:
        return "#9C27B0"; // Purple for level 3
      default:
        return "#4CAF50";
    }
  };

  return (
    <View style={styles.container}>
      {/* Animated background elements */}
      <View style={styles.backgroundDecorations}>
        <View style={[styles.decoration, styles.decoration1]} />
        <View style={[styles.decoration, styles.decoration2]} />
        <View style={[styles.decoration, styles.decoration3]} />
      </View>

      {/* Game Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.gameTitle}>CHOMPLINE</Text>
        <Text style={styles.gameSubtitle}>Classic Snake Reimagined</Text>
      </View>

      <View style={styles.menuContainer}>
        {/* Start Game Button - Large and prominent */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={startGame}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#4CAF50', '#45a049', '#388E3C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.startButtonGradient}
          >
            <Text style={styles.startButtonText}>▶ START GAME</Text>
            <Text style={styles.startButtonSubtext}>Tap to begin your adventure</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Level Button */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={onLevelPress}
          activeOpacity={0.8}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonIcon}>🎮</Text>
            <Text style={styles.menuButtonText}>Levels</Text>
          </View>
        </TouchableOpacity>

        {/* Shop Button */}
        <TouchableOpacity
          style={[styles.menuButton, styles.shopButton]}
          onPress={onShopPress}
          activeOpacity={0.8}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonIcon}>🛒</Text>
            <Text style={styles.menuButtonText}>Shop</Text>
          </View>
        </TouchableOpacity>

        {/* Leaderboard Button - Only show when authenticated */}
        {isAuthenticated && (
          <TouchableOpacity
            style={[styles.menuButton, styles.leaderboardButton]}
            onPress={onLeaderboardPress}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonIcon}>🏆</Text>
              <Text style={styles.menuButtonText}>Leaderboard</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Profile or Sign In Button */}
        {isAuthenticated ? (
          <TouchableOpacity
            style={[styles.menuButton, styles.profileButton]}
            onPress={onProfilePress}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonIcon}>👤</Text>
              <Text style={styles.menuButtonText}>Profile</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.menuButton, styles.signInButton]}
            onPress={onAuthPress}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonIcon}>🔐</Text>
              <Text style={styles.menuButtonText}>Sign In</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default MainMenu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    position: "relative",
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
  titleContainer: {
    marginBottom: 40,
    alignItems: "center",
  },
  gameTitle: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#4CAF50",
    textShadowColor: "rgba(76, 175, 80, 0.3)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
    letterSpacing: 4,
  },
  gameSubtitle: {
    fontSize: 14,
    color: "#AAA",
    marginTop: 8,
    letterSpacing: 2,
  },
  menuContainer: {
    width: "85%",
    maxWidth: 400,
    gap: 16,
  },
  startButton: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#4CAF50",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 15,
    marginBottom: 20,
  },
  startButtonGradient: {
    paddingVertical: 28,
    paddingHorizontal: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  startButtonText: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    letterSpacing: 3,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  startButtonSubtext: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 12,
    marginTop: 8,
    letterSpacing: 1,
  },
  menuButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  buttonIcon: {
    fontSize: 24,
  },
  menuButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  shopButton: {
    borderColor: "#FF1744",
    backgroundColor: "rgba(255, 23, 68, 0.15)",
  },
  leaderboardButton: {
    borderColor: "#FFA726",
    backgroundColor: "rgba(255, 167, 38, 0.15)",
  },
  profileButton: {
    borderColor: "#2196F3",
    backgroundColor: "rgba(33, 150, 243, 0.15)",
  },
  signInButton: {
    borderColor: "#9C27B0",
    backgroundColor: "rgba(156, 39, 176, 0.15)",
  },
});
