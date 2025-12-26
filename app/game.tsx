import React, { useState, useEffect } from "react";
import { View, StyleSheet, Modal } from "react-native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameProvider, useGame } from "@/contexts/GameContext";
import { useAuth } from "@/contexts/AuthContext";
import GameBoard from "@/components/GameBoard";
import Header from "@/components/Header";
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
  const { level } = useGame();
  
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
      <View style={[styles.headerSection, { backgroundColor: getHeaderBackgroundColor() }]}>
        <Header 
          onLevelPress={onLevelPress}
          onAuthPress={onAuthPress}
          onProfilePress={onProfilePress}
          onLeaderboardPress={onLeaderboardPress}
          onShopPress={onShopPress}
        />
      </View>
      
      <View style={styles.gameSection}>
        <GameBoard />
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

  const checkFirstLaunch = async () => {
    // Skip AsyncStorage in production - always skip welcome screen
    if (!__DEV__) {
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
    if (__DEV__) {
      try {
        await AsyncStorage.setItem('hasLaunched', 'true');
      } catch (error) {
        console.error('Error setting first launch:', error);
      }
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
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowLevelModal(false)}
          >
            <LevelSelector
              onClose={() => setShowLevelModal(false)}
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

          {/* Heart Shop Modal */}
          <HeartShop
            visible={showShopModal}
            onClose={() => setShowShopModal(false)}
          />
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
    zIndex: 10, // Ensure header stays on top
  },
  gameSection: {
    flex: 1,
    width: "100%",
  },
});