// ModeSelector.tsx - Modal for selecting game mode
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

interface ModeSelectorProps {
  onClose: () => void;
}

const modeInfo = {
  EASY: {
    description: "Slow speed - Perfect for beginners",
    color: ["#4CAF50", "#2E7D32"], // Green gradient
  },
  NORMAL: {
    description: "Medium speed - Balanced gameplay",
    color: ["#FFC107", "#FF8F00"], // Amber gradient
  },
  HARD: {
    description: "Fast speed - For experienced players",
    color: ["#F44336", "#C62828"], // Red gradient
  }
};

export default function ModeSelector({
  onClose
}: ModeSelectorProps) {
  // Get game state and methods from context
  const { mode, setMode } = useGame();
  
  console.log('ModeSelector rendered with current mode:', mode);
  
  // Handle mode selection
  const handleSelectMode = (newMode: string) => {
    console.log('Mode selected:', newMode);
    setMode(newMode);
    onClose();
  };
  
  // Render a mode option button
  const renderModeOption = (modeOption: keyof typeof modeInfo) => {
    const isSelected = modeOption === mode;
    const { color, description } = modeInfo[modeOption];
    
    console.log(`Rendering mode option: ${modeOption}, isSelected: ${isSelected}, currentMode: ${mode}`);
    
    return (
      <TouchableOpacity
        key={modeOption}
        style={[
          styles.modeOption,
          isSelected && styles.selectedOption
        ]}
        onPress={() => handleSelectMode(modeOption)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={color as [string, string]}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.modeText}>{modeOption}</Text>
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
            <Text style={styles.modalTitle}>SELECT MODE</Text>
            
            <View style={styles.optionsContainer}>
              {renderModeOption("EASY")}
              {renderModeOption("NORMAL")}
              {renderModeOption("HARD")}
            </View>
            
            <View style={styles.modeDetails}>
              <Text style={styles.detailsTitle}>MODE DETAILS</Text>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>EASY:</Text>
                <Text style={styles.detailText}>Slow snake speed for learning</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>NORMAL:</Text>
                <Text style={styles.detailText}>Medium snake speed for balanced play</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>HARD:</Text>
                <Text style={styles.detailText}>Fast snake speed for challenge</Text>
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
    minHeight: 400,  // Add minimum height
    borderWidth: 2,
    borderColor: '#00ff00',
    shadowColor: '#00ff00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00ff00',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: '#00ff00',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 10,
  },
  optionsContainer: {
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Add visible background for debugging
  },
  modeOption: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    minHeight: 60, // Ensure minimum height
  },
  selectedOption: {
    borderColor: '#00ff00',
    shadowColor: '#00ff00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 10,
  },
  gradientBackground: {
    padding: 15,
    position: 'relative',
  },
  modeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    backgroundColor: '#00ff00',
    borderRadius: 10,
    shadowColor: '#00ff00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  modeDetails: {
    backgroundColor: 'rgba(0, 255, 0, 0.05)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 0, 0.2)',
  },
  gameplayInfo: {
    backgroundColor: 'rgba(0, 255, 0, 0.05)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 0, 0.2)',
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00ff00',
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
    color: '#ffffff',
    width: 80,
    marginRight: 10,
  },
  detailText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    flex: 1,
    lineHeight: 18,
  },
  closeButton: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#00ff00',
  },
  closeButtonText: {
    color: '#00ff00',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
