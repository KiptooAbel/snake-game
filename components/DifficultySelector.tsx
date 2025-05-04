// DifficultySelector.tsx - Modal for selecting game difficulty
import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TouchableWithoutFeedback
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useGame } from "@/contexts/GameContext";

interface DifficultySelectorProps {
  onClose: () => void;
}

const difficultyInfo = {
  EASY: {
    description: "Larger cells, slower speed",
    color: ["#4CAF50", "#2E7D32"], // Green gradient
  },
  MEDIUM: {
    description: "Balanced gameplay",
    color: ["#FFC107", "#FF8F00"], // Amber gradient
  },
  HARD: {
    description: "Smaller cells, faster speed",
    color: ["#F44336", "#C62828"], // Red gradient
  }
};

export default function DifficultySelector({
  onClose
}: DifficultySelectorProps) {
  // Get game state and methods from context
  const { difficulty, setDifficulty } = useGame();
  
  // Handle difficulty selection
  const handleSelectDifficulty = (newDifficulty: string) => {
    setDifficulty(newDifficulty);
    onClose();
  };
  
  // Render a difficulty option button
  const renderDifficultyOption = (difficultyOption: string) => {
    const isSelected = difficultyOption === difficulty;
    const { color, description } = difficultyInfo[difficultyOption];
    
    return (
      <TouchableOpacity
        key={difficultyOption}
        style={[
          styles.difficultyOption,
          isSelected && styles.selectedOption
        ]}
        onPress={() => handleSelectDifficulty(difficultyOption)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={color}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.difficultyText}>{difficultyOption}</Text>
          <Text style={styles.descriptionText}>{description}</Text>
          
          {isSelected && (
            <View style={styles.selectedIndicator} />
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.modalOverlay}>
        <TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>SELECT DIFFICULTY</Text>
            
            <View style={styles.optionsContainer}>
              {renderDifficultyOption("EASY")}
              {renderDifficultyOption("MEDIUM")}
              {renderDifficultyOption("HARD")}
            </View>
            
            <View style={styles.difficultyDetails}>
              <Text style={styles.detailsTitle}>DIFFICULTY DETAILS</Text>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>EASY:</Text>
                <Text style={styles.detailText}>15×15 grid, Slow starting speed</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>MEDIUM:</Text>
                <Text style={styles.detailText}>20×20 grid, Medium starting speed</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>HARD:</Text>
                <Text style={styles.detailText}>25×25 grid, Fast starting speed</Text>
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>CLOSE</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#222",
    borderRadius: 10,
    padding: 20,
    borderWidth: 2,
    borderColor: "#444",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  modalTitle: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  difficultyOption: {
    marginBottom: 10,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedOption: {
    borderColor: "white",
    transform: [{ scale: 1.05 }],
  },
  gradientBackground: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 6,
  },
  difficultyText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  descriptionText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 5,
  },
  selectedIndicator: {
    position: "absolute",
    right: 15,
    top: "50%",
    marginTop: -8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.3)",
  },
  difficultyDetails: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  detailsTitle: {
    fontSize: 16,
    color: "#AAA",
    fontWeight: "bold",
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  detailLabel: {
    width: 80,
    fontSize: 14,
    color: "white",
    fontWeight: "bold",
  },
  detailText: {
    flex: 1,
    fontSize: 14,
    color: "white",
  },
  closeButton: {
    backgroundColor: "#333",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});