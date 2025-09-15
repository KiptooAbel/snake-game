// DifficultySelector.tsx - Modal for selecting game difficulty
import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TouchableWithoutFeedback,
  ScrollView
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useGame } from "@/contexts/GameContext";

interface DifficultySelectorProps {
  onClose: () => void;
}

const difficultyInfo = {
  EASY: {
    description: "Larger cells, slower speed, fewer obstacles",
    color: ["#4CAF50", "#2E7D32"], // Green gradient
  },
  MEDIUM: {
    description: "Balanced gameplay, moderate obstacles",
    color: ["#FFC107", "#FF8F00"], // Amber gradient
  },
  HARD: {
    description: "Smaller cells, faster speed, many obstacles",
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
  const renderDifficultyOption = (difficultyOption: keyof typeof difficultyInfo) => {
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
          colors={color as [string, string]}
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
            
            <ScrollView 
              style={styles.scrollContainer}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.optionsContainer}>
                {renderDifficultyOption("EASY")}
                {renderDifficultyOption("MEDIUM")}
                {renderDifficultyOption("HARD")}
              </View>
              
              <View style={styles.difficultyDetails}>
                <Text style={styles.detailsTitle}>DIFFICULTY DETAILS</Text>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>EASY:</Text>
                  <Text style={styles.detailText}>15×15 grid, Slow speed, 3-5 obstacles</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>MEDIUM:</Text>
                  <Text style={styles.detailText}>20×20 grid, Medium speed, 5-8 obstacles</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>HARD:</Text>
                  <Text style={styles.detailText}>25×25 grid, Fast speed, 7-12 obstacles</Text>
                </View>
              </View>
              
              <View style={styles.obstacleInfo}>
                <Text style={styles.detailsTitle}>OBSTACLE TYPES</Text>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>STATIC:</Text>
                  <Text style={styles.detailText}>Square obstacles that don't move</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>PULSING:</Text>
                  <Text style={styles.detailText}>Circular obstacles that pulse in size</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>MOVING:</Text>
                  <Text style={styles.detailText}>Diamond obstacles that move back and forth</Text>
                </View>
              </View>
            </ScrollView>
            
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
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  modalContent: {
    width: "100%",
    maxHeight: "100%",
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
  scrollContainer: {
    maxHeight: 400,
    minHeight: 200,
  },
  scrollContent: {
    paddingBottom: 10,
    flexGrow: 1,
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
    minHeight: 150,
  },
  difficultyOption: {
    marginBottom: 10,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
    minHeight: 60,
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
    marginBottom: 15,
  },
  obstacleInfo: {
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