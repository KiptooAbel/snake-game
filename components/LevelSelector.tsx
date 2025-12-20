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
  const { level, setLevel, rewardPoints, isLevelUnlocked, canUnlockLevel, unlockLevel } = useGame();
  
  console.log('LevelSelector rendered with current level:', level);
  
  // Handle level selection
  const handleSelectLevel = (newLevel: number) => {
    console.log('Level selected:', newLevel);
    
    // Check if level is unlocked
    if (!isLevelUnlocked(newLevel)) {
      console.log('Level is locked');
      return; // Don't allow selecting locked levels
    }
    
    setLevel(newLevel);
    onClose();
  };
  
  // Handle unlocking a level
  const handleUnlockLevel = (levelNum: number) => {
    console.log('Attempting to unlock level:', levelNum);
    const success = unlockLevel(levelNum);
    if (success) {
      console.log('Level unlocked successfully');
      setLevel(levelNum);
      onClose();
    }
  };
  
  // Render a level option button
  const renderLevelOption = (levelOption: keyof typeof levelInfo) => {
    const isSelected = levelOption === level;
    const isUnlocked = isLevelUnlocked(levelOption);
    const canUnlock = canUnlockLevel(levelOption);
    const { name, color, description } = levelInfo[levelOption];
    
    // Determine reward points required for each level
    const rewardPointsRequired = levelOption === 1 ? 0 : levelOption === 2 ? 50 : 150;
    
    console.log(`Rendering level option: ${levelOption}, isSelected: ${isSelected}, currentLevel: ${level}, isUnlocked: ${isUnlocked}, canUnlock: ${canUnlock}`);
    
    return (
      <TouchableOpacity
        key={levelOption}
        style={[
          styles.levelOption,
          isSelected && styles.selectedOption,
          !isUnlocked && !canUnlock && styles.lockedOption
        ]}
        onPress={() => {
          if (isUnlocked) {
            handleSelectLevel(levelOption);
          } else if (canUnlock) {
            handleUnlockLevel(levelOption);
          }
        }}
        activeOpacity={isUnlocked || canUnlock ? 0.8 : 1}
        disabled={!isUnlocked && !canUnlock}
      >
        <LinearGradient
          colors={isUnlocked ? color as [string, string] : canUnlock ? ["#FFD700", "#FFA000"] : ["#424242", "#212121"]}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={[styles.levelText, !isUnlocked && !canUnlock && styles.lockedText]}>
            {name} {!isUnlocked && (canUnlock ? "💎" : "🔒")}
          </Text>
          <Text style={[styles.descriptionText, !isUnlocked && !canUnlock && styles.lockedText]}>
            {description}
          </Text>
          
          {!isUnlocked && canUnlock && (
            <Text style={styles.unlockButtonText}>
              TAP TO UNLOCK - {rewardPointsRequired} 💎
            </Text>
          )}
          
          {!isUnlocked && !canUnlock && (
            <Text style={styles.unlockText}>
              Requires {rewardPointsRequired} gems
            </Text>
          )}
          
          {isSelected && isUnlocked && (
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
              <Text style={styles.detailsTitle}>YOUR GEMS: 💎 {rewardPoints}</Text>
              <Text style={styles.detailsSubtitle}>Eat special fruits to earn gems!</Text>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>LEVEL 1:</Text>
                <Text style={styles.detailText}>Free (Always unlocked)</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>LEVEL 2:</Text>
                <Text style={styles.detailText}>Cost: 50 gems</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>LEVEL 3:</Text>
                <Text style={styles.detailText}>Cost: 150 gems</Text>
              </View>
              
              <View style={styles.rewardInfo}>
                <Text style={styles.rewardInfoTitle}>Special Fruits:</Text>
                <Text style={styles.rewardInfoText}>💎 Ruby (15th fruit): +10 gems</Text>
                <Text style={styles.rewardInfoText}>💎 Emerald (30th fruit): +25 gems</Text>
                <Text style={styles.rewardInfoText}>💎 Diamond (50th fruit): +50 gems</Text>
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
  unlockButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 8,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
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
  lockedOption: {
    opacity: 0.6,
  },
  lockedText: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  unlockText: {
    fontSize: 12,
    color: '#FFD700',
    marginTop: 5,
    fontStyle: 'italic',
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
    color: '#FFD700',
    marginBottom: 5,
    textAlign: 'center',
  },
  detailsSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 15,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  rewardInfo: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(139, 69, 19, 0.3)',
  },
  rewardInfoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 8,
  },
  rewardInfoText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
    paddingLeft: 10,
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
