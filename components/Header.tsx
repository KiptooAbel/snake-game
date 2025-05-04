// Header.tsx - Displays score information and difficulty selector
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useGame } from "@/contexts/GameContext";

interface HeaderProps {
  onDifficultyPress: () => void;
}

const Header: React.FC<HeaderProps> = ({ onDifficultyPress }) => {
  // Get game state from context
  const { score, highScore, difficulty } = useGame();
  
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
    <View style={styles.header}>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>Score: {score}</Text>
        <Text style={styles.scoreText}>High Score: {highScore}</Text>
      </View>
      
      <TouchableOpacity 
        style={[
          styles.difficultyButton,
          { borderColor: getDifficultyColor() }
        ]}
        onPress={onDifficultyPress}
      >
        <Text style={[
          styles.difficultyButtonText,
          { color: getDifficultyColor() }
        ]}>
          {difficulty}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  scoreContainer: {
    flex: 1,
  },
  scoreText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
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
});