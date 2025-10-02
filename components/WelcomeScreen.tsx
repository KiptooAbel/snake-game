import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const snakePositions = useRef([
    new Animated.ValueXY({ x: width / 2 - 75, y: height / 2 - 100 }),
    new Animated.ValueXY({ x: width / 2 - 50, y: height / 2 - 100 }),
    new Animated.ValueXY({ x: width / 2 - 25, y: height / 2 - 100 }),
    new Animated.ValueXY({ x: width / 2, y: height / 2 - 100 }),
    new Animated.ValueXY({ x: width / 2 + 25, y: height / 2 - 100 }),
  ]).current;

  useEffect(() => {
    // Initial animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Snake animation
    animateSnake();
  }, []);

  const animateSnake = () => {
    const moveDistance = 25;
    const directions = [
      { x: moveDistance, y: 0 },   // Right
      { x: 0, y: moveDistance },   // Down
      { x: -moveDistance, y: 0 },  // Left
      { x: 0, y: -moveDistance },  // Up
    ];

    let directionIndex = 0;
    const positions = [
      { x: width / 2 - 75, y: height / 2 - 100 },
      { x: width / 2 - 50, y: height / 2 - 100 },
      { x: width / 2 - 25, y: height / 2 - 100 },
      { x: width / 2, y: height / 2 - 100 },
      { x: width / 2 + 25, y: height / 2 - 100 },
    ];

    const animateSegment = () => {
      const currentDirection = directions[directionIndex];
      
      // Update positions
      positions.forEach((pos, index) => {
        positions[index] = {
          x: pos.x + currentDirection.x,
          y: pos.y + currentDirection.y,
        };
      });
      
      // Animate each segment with a delay
      snakePositions.forEach((position, index) => {
        Animated.timing(position, {
          toValue: positions[index],
          duration: 300,
          delay: index * 50,
          useNativeDriver: false,
        }).start();
      });

      directionIndex = (directionIndex + 1) % directions.length;
    };

    // Start the animation loop
    const animationInterval = setInterval(animateSegment, 1000);

    // Clean up interval after some time or when component unmounts
    setTimeout(() => {
      clearInterval(animationInterval);
    }, 8000);
  };

  const renderSnakeSegment = (position: Animated.ValueXY, index: number) => {
    const isHead = index === snakePositions.length - 1;
    const segmentStyle = [
      styles.snakeSegment,
      isHead && styles.snakeHead,
      {
        transform: position.getTranslateTransform(),
      },
    ];

    return (
      <Animated.View key={index} style={segmentStyle}>
        {isHead && (
          <View style={styles.snakeEyes}>
            <View style={styles.eye} />
            <View style={styles.eye} />
          </View>
        )}
      </Animated.View>
    );
  };

  return (
    <LinearGradient
      colors={['#1a1a1a', '#0d1421', '#1a1a1a']}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Animated Snake */}
        <View style={styles.snakeContainer}>
          {snakePositions.map((position, index) => 
            renderSnakeSegment(position, index)
          )}
          
          {/* Food item */}
          <View style={styles.food}>
            <Text style={styles.foodEmoji}>🍎</Text>
          </View>
        </View>

        {/* Title and description */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Snake Game</Text>
          <Text style={styles.subtitle}>Classic arcade fun, reimagined</Text>
          
          <View style={styles.featuresContainer}>
            <Text style={styles.feature}>🏆 Compete with players worldwide</Text>
            <Text style={styles.feature}>📊 Track your progress</Text>
            <Text style={styles.feature}>⚡ Multiple difficulty levels</Text>
            <Text style={styles.feature}>🎯 Power-ups and obstacles</Text>
          </View>
        </View>

        {/* Get Started Button */}
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={onGetStarted}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#4CAF50', '#45a049']}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Version info */}
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  snakeContainer: {
    position: 'relative',
    width: 200,
    height: 150,
    marginBottom: 50,
  },
  snakeSegment: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#66BB6A',
  },
  snakeHead: {
    backgroundColor: '#2E7D32',
    borderColor: '#4CAF50',
  },
  snakeEyes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 3,
    paddingTop: 2,
  },
  eye: {
    width: 3,
    height: 3,
    backgroundColor: '#fff',
    borderRadius: 1.5,
  },
  food: {
    position: 'absolute',
    top: 75,
    right: 50,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  foodEmoji: {
    fontSize: 16,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 30,
  },
  featuresContainer: {
    alignItems: 'flex-start',
  },
  feature: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
    textAlign: 'left',
  },
  getStartedButton: {
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonGradient: {
    paddingHorizontal: 40,
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  versionText: {
    color: '#666',
    fontSize: 12,
    marginTop: 20,
  },
});

export default WelcomeScreen;
