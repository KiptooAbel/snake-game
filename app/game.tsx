// Refactored game.tsx - Main container component
import React, { useState, useEffect } from "react";
import { View, StyleSheet, Modal } from "react-native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameProvider } from "@/contexts/GameContext";
import { useAuth } from "@/contexts/AuthContext";
import GameBoard from "@/components/GameBoard";
import Header from "@/components/Header";
import ControlsContainer from "@/components/ControlsContainer";
import DifficultySelector from "@/components/DifficultySelector";
import AuthFlow from "@/components/AuthFlow";
import UserProfile from "@/components/UserProfile";
import LeaderboardScreen from "@/components/LeaderboardScreen";
import WelcomeScreen from "@/components/WelcomeScreen";

const GameScreen: React.FC = () => {
  // Keep modal states at this level
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isCheckingFirstLaunch, setIsCheckingFirstLaunch] = useState(true);
  
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    checkFirstLaunch();
  }, []);

  const checkFirstLaunch = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem('hasLaunched');
      if (hasLaunched) {
        setShowWelcome(false);
      }
    } catch (error) {
      console.error('Error checking first launch:', error);
      setShowWelcome(false); // Default to not showing welcome on error
    } finally {
      setIsCheckingFirstLaunch(false);
    }
  };

  const handleGetStarted = async () => {
    try {
      await AsyncStorage.setItem('hasLaunched', 'true');
      setShowWelcome(false);
    } catch (error) {
      console.error('Error setting first launch:', error);
      setShowWelcome(false);
    }
  };

  const handleAuthPress = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    }
  };

  // Show welcome screen if it's first launch
  if (isCheckingFirstLaunch) {
    return null; // Or loading screen
  }

  if (showWelcome) {
    return <WelcomeScreen onGetStarted={handleGetStarted} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GameProvider>
        <View style={styles.container}>
          <StatusBar style="light" />
          
          <Header 
            onDifficultyPress={() => setShowDifficultyModal(true)}
            onAuthPress={handleAuthPress}
            onProfilePress={() => setShowProfileModal(true)}
            onLeaderboardPress={() => setShowLeaderboardModal(true)}
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

          {/* Authentication Flow */}
          <AuthFlow
            visible={showAuthModal}
            onClose={() => setShowAuthModal(false)}
          />

          {/* User Profile Modal */}
          <Modal
            visible={showProfileModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowProfileModal(false)}
          >
            <UserProfile
              onClose={() => setShowProfileModal(false)}
              onShowLeaderboard={() => {
                setShowProfileModal(false);
                setShowLeaderboardModal(true);
              }}
            />
          </Modal>

          {/* Leaderboard Modal */}
          <Modal
            visible={showLeaderboardModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowLeaderboardModal(false)}
          >
            <LeaderboardScreen
              onClose={() => setShowLeaderboardModal(false)}
            />
          </Modal>
        </View>
      </GameProvider>
    </GestureHandlerRootView>
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