// ControlsContainer.tsx - Contains game controls and control pad
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import ControlPad from "@/components/ControlPad";
import { useGame } from "@/contexts/GameContext";

const ControlsContainer: React.FC = () => {
  // Get game state and methods from context
  const {
    gameStarted,
    gameOver,
    isPaused,
    showControls,
    togglePause,
    toggleControls,
    handleDirectionChange
  } = useGame();
  
  // Define a debug handler to ensure direction changes are being fired
  const handleControlPress = (direction) => {
    console.log("Control pressed:", direction); // Debug log
    handleDirectionChange(direction);
  };
  
  return (
    <View style={styles.controlsContainer}>
      <View style={styles.buttonRow}>
        {gameStarted && !gameOver && (
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={togglePause}
          >
            <Text style={styles.buttonText}>
              {isPaused ? "Resume" : "Pause"}
            </Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={toggleControls}
        >
          <Text style={styles.buttonText}>
            {showControls ? "Hide Controls" : "Show Controls"}
          </Text>
        </TouchableOpacity>
      </View>
      
      {showControls && gameStarted && !gameOver && !isPaused && (
        <ControlPad onDirectionPress={handleControlPress} />
      )}
    </View>
  );
};

export default ControlsContainer;

const styles = StyleSheet.create({
  controlsContainer: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    width: "100%",
  },
  controlButton: {
    backgroundColor: "#333",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});