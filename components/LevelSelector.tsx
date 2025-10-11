// LevelSelector.tsx - Modal for selecting game level
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

interface LevelSelectorProps {
  onClose: () => void;
}

const levelInfo = {
  1: {
    name: "LEVEL 1",
    description: "Open field - Snake wraps around walls",
    color: ["#4CAF50", "#2E7D32"], // Green gradient
    backgroundColor: "#1a1a1a", // Dark background
  },
  2: {
    name: "LEVEL 2", 
    description: "Walled arena - Hitting walls ends the game",
    color: ["#8B4513", "#A0522D"], // Brown gradient
    backgroundColor: "#3E2723", // Brown background
  },
  3: {
    name: "LEVEL 3",
    description: "Maze challenge - L-corners & center barriers",
    color: ["#9C27B0", "#6A1B99"], // Purple gradient
    backgroundColor: "#4A148C", // Purple background
  }
};

export default function LevelSelector({
  onClose
}: LevelSelectorProps) {
  // Get game state and methods from context
  const { level, setLevel } = useGame();
  
  console.log('LevelSelector rendered with current level:', level);
  
  // Handle level selection
  const handleSelectLevel = (newLevel: number) => {
    console.log('Level selected:', newLevel);
    setLevel(newLevel);
    onClose();
  };
  
  // Render a level option button
  const renderLevelOption = (levelOption: keyof typeof levelInfo) => {
    const isSelected = levelOption === level;
    const { name, color, description } = levelInfo[levelOption];
    
    console.log(`Rendering level option: ${levelOption}, isSelected: ${isSelected}, currentLevel: ${level}`);
    
    return (
      <TouchableOpacity
        key={levelOption}
        style={[
          styles.levelOption,
          isSelected && styles.selectedOption
        ]}
        onPress={() => handleSelectLevel(levelOption)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={color as [string, string]}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.levelText}>{name}</Text>
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
            <Text style={styles.modalTitle}>SELECT LEVEL</Text>
            
            <View style={styles.optionsContainer}>
              {renderLevelOption(1)}
              {renderLevelOption(2)}
              {renderLevelOption(3)}
            </View>
            
            <View style={styles.levelDetails}>
              <Text style={styles.detailsTitle}>LEVEL DETAILS</Text>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>LEVEL 1:</Text>
                <Text style={styles.detailText}>Classic snake with wrapping walls</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>LEVEL 2:</Text>
                <Text style={styles.detailText}>Walled arena - avoid the boundaries!</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>LEVEL 3:</Text>
                <Text style={styles.detailText}>L-shaped corners & horizontal barriers</Text>
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 20,
    margin: 20,
    width: '90%',
    maxHeight: '80%',
    minHeight: 400,
    borderWidth: 2,
    borderColor: '#8B4513',
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9C27B0',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: '#9C27B0',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  levelOption: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    minHeight: 60,
  },
  selectedOption: {
    borderColor: '#8B4513',
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 10,
  },
  gradientBackground: {
    padding: 15,
    position: 'relative',
  },
  levelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#8B4513',
    borderWidth: 2,
    borderColor: 'white',
  },
  levelDetails: {
    backgroundColor: 'rgba(139, 69, 19, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 69, 19, 0.3)',
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 10,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B4513',
    width: 80,
    flexShrink: 0,
  },
  detailText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    flex: 1,
    lineHeight: 18,
  },
  closeButton: {
    backgroundColor: '#8B4513',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#A0522D',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
