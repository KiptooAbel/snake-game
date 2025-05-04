// Refactored game.tsx - Main container component
import React, { useState } from "react";
import { View, StyleSheet, Modal } from "react-native";
import { StatusBar } from "expo-status-bar";
import { GameProvider } from "@/contexts/GameContext";
import GameBoard from "@/components/GameBoard";
import Header from "@/components/Header";
import ControlsContainer from "@/components/ControlsContainer";
import DifficultySelector from "@/components/DifficultySelector";

const GameScreen: React.FC = () => {
  // Keep only the modal state at this level
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);

  return (
    <GameProvider>
      <View style={styles.container}>
        <StatusBar style="light" />
        
        <Header 
          onDifficultyPress={() => setShowDifficultyModal(true)}
        />
        
        <GameBoard />
        
        <ControlsContainer />

        {/* Difficulty Selection Modal */}
        <Modal
          visible={showDifficultyModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowDifficultyModal(false)}
        >
          <DifficultySelector
            onClose={() => setShowDifficultyModal(false)}
          />
        </Modal>
      </View>
    </GameProvider>
  );
};

export default GameScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
});