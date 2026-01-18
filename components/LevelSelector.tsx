// LevelSelector.tsx - Horizontal swipeable level selector
import React, { useRef, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Dimensions
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useGame } from "@/contexts/GameContext";

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.8;
const CARD_SPACING = 15;

interface LevelSelectorProps {
  onClose: () => void;
}

const levelInfo: Record<1 | 2 | 3 | 4, {
  name: string;
  title: string;
  description: string;
  color: [string, string];
  icon: string;
  preview: string;
}> = {
  1: {
    name: "LEVEL 1",
    title: "Open Field",
    description: "Snake wraps around walls",
    color: ["#4CAF50", "#2E7D32"],
    icon: "🌿",
    preview: "Classic snake with wrap-around edges",
  },
  2: {
    name: "LEVEL 2", 
    title: "Walled Arena",
    description: "Hitting walls ends the game",
    color: ["#FF6B35", "#D84315"],
    icon: "🧱",
    preview: "Walls are deadly - stay inside!",
  },
  3: {
    name: "LEVEL 3",
    title: "Maze Challenge",
    description: "L-corners & center barriers",
    color: ["#9C27B0", "#6A1B99"],
    icon: "🏛️",
    preview: "Navigate through obstacles",
  },
  4: {
    name: "LEVEL 4",
    title: "Cross Divide",
    description: "Giant cross pattern obstacles",
    color: ["#00BCD4", "#0097A7"],
    icon: "✨",
    preview: "Navigate around the central cross",
  }
};

export default function LevelSelector({
  onClose
}: LevelSelectorProps) {
  const { level, setLevel, rewardPoints, isLevelUnlocked, canUnlockLevel, unlockLevel, startGame } = useGame();
  const scrollViewRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(level - 1);

  // Handle level selection - start game immediately
  const handleSelectLevel = (levelNum: number) => {
    if (!isLevelUnlocked(levelNum)) {
      return;
    }
    
    setLevel(levelNum);
    // Close the selector and start game immediately
    onClose();
    setTimeout(() => {
      startGame();
    }, 100);
  };

  // Handle unlocking a level
  const handleUnlockLevel = (levelNum: number) => {
    const success = unlockLevel(levelNum);
    if (success) {
      setLevel(levelNum);
      onClose();
      setTimeout(() => {
        startGame();
      }, 100);
    }
  };

  const renderLevelCard = (levelNum: 1 | 2 | 3 | 4, index: number) => {
    const info = levelInfo[levelNum];
    const isUnlocked = isLevelUnlocked(levelNum);
    const canUnlock = canUnlockLevel(levelNum);
    const costMap = { 1: 0, 2: 50, 3: 150, 4: 300 };
    const cost = costMap[levelNum];

    return (
      <View key={levelNum} style={styles.cardContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => {
            if (isUnlocked) {
              handleSelectLevel(levelNum);
            } else if (canUnlock) {
              handleUnlockLevel(levelNum);
            }
          }}
          activeOpacity={0.9}
          disabled={!isUnlocked && !canUnlock}
        >
          <LinearGradient
            colors={info.color}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardGradient}
          >
            {/* Level Icon */}
            <Text style={styles.levelIcon}>{info.icon}</Text>
            
            {/* Level Number Badge */}
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>{levelNum}</Text>
            </View>

            {/* Level Info */}
            <Text style={styles.levelName}>{info.name}</Text>
            <Text style={styles.levelTitle}>{info.title}</Text>
            <Text style={styles.levelDescription}>{info.description}</Text>
            
            {/* Preview Text */}
            <View style={styles.previewContainer}>
              <Text style={styles.previewText}>{info.preview}</Text>
            </View>

            {/* Lock Overlay */}
            {!isUnlocked && (
              <View style={styles.lockOverlay}>
                <Text style={styles.lockIcon}>🔒</Text>
                <Text style={styles.lockText}>
                  {canUnlock ? `Unlock for ${cost} gems` : `Requires ${cost} gems`}
                </Text>
                {canUnlock && (
                  <View style={styles.unlockButton}>
                    <Text style={styles.unlockButtonText}>TAP TO UNLOCK</Text>
                  </View>
                )}
              </View>
            )}

            {/* Play Button */}
            {isUnlocked && (
              <View style={styles.playButton}>
                <Text style={styles.playButtonText}>▶ PLAY NOW</Text>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.fullScreenContainer}>
      {/* Background decorations */}
      <View style={styles.backgroundDecorations}>
        <View style={[styles.decoration, styles.decoration1]} />
        <View style={[styles.decoration, styles.decoration2]} />
        <View style={[styles.decoration, styles.decoration3]} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SELECT LEVEL</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>Swipe to preview levels • Tap to play</Text>
        <View style={styles.gemsDisplay}>
          <Text style={styles.gemsText}>💎 {rewardPoints} gems</Text>
        </View>
      </View>

      {/* Horizontal Scrollable Cards */}
      <View style={styles.cardsSection}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled={false}
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={CARD_WIDTH + CARD_SPACING}
          snapToAlignment="center"
          contentContainerStyle={styles.scrollContent}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / (CARD_WIDTH + CARD_SPACING));
            setActiveIndex(index);
          }}
        >
          {renderLevelCard(1, 0)}
          {renderLevelCard(2, 1)}
          {renderLevelCard(3, 2)}
          {renderLevelCard(4, 3)}
        </ScrollView>
      </View>

      {/* Level Indicators */}
      <View style={styles.indicatorsContainer}>
        {[0, 1, 2, 3].map((index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              activeIndex === index && styles.activeIndicator,
            ]}
          />
        ))}
      </View>

      {/* Info Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerTitle}>Earn Gems by Playing!</Text>
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>💎 Ruby (15th): +10</Text>
          <Text style={styles.footerText}>💎 Emerald (30th): +25</Text>
          <Text style={styles.footerText}>💎 Diamond (50th): +50</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "#111",
  },
  backgroundDecorations: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  decoration: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#4CAF50',
    opacity: 0.05,
  },
  decoration1: {
    top: 100,
    left: -50,
  },
  decoration2: {
    top: 300,
    right: -80,
  },
  decoration3: {
    bottom: 100,
    left: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    letterSpacing: 2,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeIcon: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
  },
  instructionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
    zIndex: 1,
  },
  instructionsText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 10,
  },
  gemsDisplay: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  gemsText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  cardsSection: {
    flex: 1,
    marginTop: 20,
  },
  scrollContent: {
    paddingHorizontal: (SCREEN_WIDTH - CARD_WIDTH) / 2,
    alignItems: 'center',
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginHorizontal: CARD_SPACING / 2,
  },
  card: {
    width: '100%',
    height: 500,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  cardGradient: {
    flex: 1,
    padding: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelIcon: {
    fontSize: 80,
    marginTop: 20,
  },
  levelBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  levelBadgeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  levelName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 2,
    marginBottom: 5,
  },
  levelTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  levelDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 20,
  },
  previewContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 15,
    marginBottom: 30,
  },
  previewText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  lockIcon: {
    fontSize: 60,
    marginBottom: 15,
  },
  lockText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  unlockButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  unlockButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  playButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  playButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111',
    letterSpacing: 1,
  },
  indicatorsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 10,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  activeIndicator: {
    width: 24,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  footerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 10,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});
