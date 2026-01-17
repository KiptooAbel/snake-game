import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Modal } from "react-native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGame } from "@/contexts/GameContext";
import { useAuth } from "@/contexts/AuthContext";
import GameBoard from "@/components/GameBoard";
import Header from "@/components/Header";
import MainMenu from "@/components/MainMenu";
import LevelSelector from "@/components/LevelSelector";
import AuthFlow from "@/components/AuthFlow";
import UserProfile from "@/components/UserProfile";
import LeaderboardScreen from "@/components/LeaderboardScreen";
import WelcomeScreen from "@/components/WelcomeScreen";
import HeartShop from "@/components/HeartShop";

// Internal component that has access to game context
const GameContent: React.FC<{
  onLevelPress: () => void;
  onAuthPress: () => void;
  onProfilePress: () => void;
  onLeaderboardPress: () => void;
  onShopPress: () => void;
}> = ({ onLevelPress, onAuthPress, onProfilePress, onLeaderboardPress, onShopPress }) => {
  const { level, gameStarted, gameOver } = useGame();
  
  // Get level-based header background color
  const getHeaderBackgroundColor = () => {
    switch(level) {
      case 1: return "#1a1a1a"; // Dark for level 1
      case 2: return "#3E2723"; // Brown for level 2
      case 3: return "#4A148C"; // Purple for level 3
      default: return "#1a1a1a";
    }
  };

  return (
    <>
      {/* Only show header when game is active */}
      {gameStarted && !gameOver && (
        <View style={[styles.headerSection, { backgroundColor: getHeaderBackgroundColor() }]}>
          <Header />
        </View>
      )}
      
      <View style={styles.gameSection}>
        {/* Show MainMenu only when game hasn't started and not in game over state */}
        {!gameStarted && !gameOver ? (
          <MainMenu
            onLevelPress={onLevelPress}
            onAuthPress={onAuthPress}
            onProfilePress={onProfilePress}
            onLeaderboardPress={onLeaderboardPress}
            onShopPress={onShopPress}
          />
        ) : (
          <GameBoard />
        )}
      </View>
    </>
  );
};

const GameScreen: React.FC = () => {
  // Keep modal states at this level
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [showShopModal, setShowShopModal] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isCheckingFirstLaunch, setIsCheckingFirstLaunch] = useState(true);
  const [isFirstTimeAuth, setIsFirstTimeAuth] = useState(false);
  
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    checkFirstLaunch();
  }, []);

  // Auto-close auth modal when user becomes authenticated
  useEffect(() => {
    console.log('[GameScreen] Auth state changed:', { isAuthenticated, showAuthModal });
    if (isAuthenticated && showAuthModal) {
      console.log('[GameScreen] Closing auth modal automatically');
      setShowAuthModal(false);
      setIsFirstTimeAuth(false);
    }
  }, [isAuthenticated, showAuthModal]);

  const checkFirstLaunch = async () => {
    // Skip AsyncStorage in production - always skip welcome screen
    const isDev = typeof __DEV__ !== 'undefined' && __DEV__;
    if (!isDev) {
      setShowWelcome(false);
      setIsCheckingFirstLaunch(false);
      return;
    }
    
    try {
      const hasLaunched = await AsyncStorage.getItem('hasLaunched');
      if (hasLaunched) {
        setShowWelcome(false);
      }
    } catch (error) {
      console.error('Error checking first launch:', error);
      setShowWelcome(false);
    } finally {
      setIsCheckingFirstLaunch(false);
    }
  };

  const handleGetStarted = async () => {
    setShowWelcome(false);
    setIsFirstTimeAuth(true);
    setShowAuthModal(true);
    
    // Only save in development
    const isDev = typeof __DEV__ !== 'undefined' && __DEV__;
    if (isDev) {
      try {
        await AsyncStorage.setItem('hasLaunched', 'true');
      } catch (error) {
        console.error('Error setting first launch:', error);
      }
    }
  };

  const handleAuthPress = useCallback(() => {
    if (!isAuthenticated) {
      setIsFirstTimeAuth(false);
      setShowAuthModal(true);
    }
  }, [isAuthenticated]);

  const handleAuthClose = useCallback(() => {
    setShowAuthModal(false);
    setIsFirstTimeAuth(false);
  }, []);

  // Show welcome screen if it's first launch
  if (isCheckingFirstLaunch) {
    return null; // Or loading screen
  }

  if (showWelcome) {
    return <WelcomeScreen onGetStarted={handleGetStarted} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar style="light" />
        
        <GameContent 
          onLevelPress={() => setShowLevelModal(true)}
          onAuthPress={handleAuthPress}
          onProfilePress={() => setShowProfileModal(true)}
          onLeaderboardPress={() => setShowLeaderboardModal(true)}
          onShopPress={() => setShowShopModal(true)}
        />

        {/* Level Selection Modal */}
        <Modal
          visible={showLevelModal}
          animationType="slide"
          onRequestClose={() => setShowLevelModal(false)}
        >
          <LevelSelector
            onClose={() => setShowLevelModal(false)}
          />
        </Modal>

        {/* Authentication Flow */}
        <AuthFlow
          visible={showAuthModal}
          onClose={handleAuthClose}
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

        {/* Heart Shop Modal */}
        <HeartShop
          visible={showShopModal}
          onClose={() => setShowShopModal(false)}
        />
      </View>
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
    zIndex: 10, // Ensure header stays on top
  },
  gameSection: {
    flex: 1,
    width: "100%",
  },
});