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
  const [isFirstTimeAuth, setIsFirstTimeAuth] = useState(false);
  
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
      // Show auth modal when user clicks get started
      setIsFirstTimeAuth(true);
      setShowAuthModal(true);
    } catch (error) {
      console.error('Error setting first launch:', error);
      setShowWelcome(false);
      // Still show auth modal even if AsyncStorage fails
      setIsFirstTimeAuth(true);
      setShowAuthModal(true);
    }
  };

  const handleAuthPress = () => {
    if (!isAuthenticated) {
      setIsFirstTimeAuth(false);
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
          
          <View style={styles.headerSection}>
            <Header 
              onDifficultyPress={() => setShowDifficultyModal(true)}
              onAuthPress={handleAuthPress}
              onProfilePress={() => setShowProfileModal(true)}
              onLeaderboardPress={() => setShowLeaderboardModal(true)}
            />
          </View>
          
          {/* Visual separator between header and game area */}
          <View style={styles.separator} />
          
          <View style={styles.gameSection}>
            <GameBoard />
          </View>

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
            onClose={() => {
              setShowAuthModal(false);
              setIsFirstTimeAuth(false);
            }}
            isFirstTime={isFirstTimeAuth}
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
  },
  headerSection: {
    width: "100%",
    paddingTop: 50, // Space from top edge
    backgroundColor: "#1a1a1a", // Use the color from the welcome screen
    zIndex: 10, // Ensure header stays on top
  },
  separator: {
    height: 2,
    backgroundColor: "#333", // Dark separator for dark theme
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  gameSection: {
    flex: 1,
    width: "100%",
  },
});