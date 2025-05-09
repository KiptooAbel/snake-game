# 🐍 Enhanced Snake Game

An improved Snake game built with React Native and Expo, featuring modern design, smooth animations, and responsive controls.

## 📱 Features

- **Responsive Design**: Adapts to different screen sizes
- **Beautiful UI**: Polished visuals with gradients and animations
- **Game Controls**:
  - Swipe gestures for intuitive control
  - On-screen control pad for precise movement
  - Option to hide/show controls
- **Game Mechanics**:
  - Dynamic speed increases as your score grows
  - Wrap-around borders (snake passes through walls)
  - High score tracking
- **Enhanced Visuals**:
  - Animated food with pulsing and rotation effects
  - Snake with gradient styling and head/body differentiation
  - Smooth animations for game elements
- **Game State Management**:
  - Pause/resume functionality
  - Game over screen with stats
  - New high score celebration

## 🚀 Getting Started

1. Install dependencies
   ```bash
   npm install
   ```

2. Start the app
   ```bash
   npx expo start
   ```

3. Open on your device or emulator
   - Scan the QR code with the Expo Go app
   - Press `a` for Android emulator
   - Press `i` for iOS simulator

## 🎮 How to Play

- **Start**: The game starts automatically
- **Controls**: 
  - Swipe in any direction to move the snake
  - Or use the on-screen control pad
- **Objective**: Eat the red food to grow your snake and increase your score
- **Avoid**: Don't let the snake hit itself
- **Walls**: The snake can pass through walls and appear on the opposite side

## 📝 Implementation Details

This game uses:
- React Native for cross-platform mobile development
- Expo for simplified development workflow
- React Navigation for screen management
- Expo Gesture Handler for touch controls
- React Native Reanimated for smooth animations
- Expo Linear Gradient for visual effects

## 🔧 Project Structure

- `app/game.tsx`: Main game logic and screen
- `components/Snake.tsx`: Snake rendering with visual effects
- `components/Food.tsx`: Food item with animations
- `components/GameOver.tsx`: Game over screen with stats
- `components/ControlPad.tsx`: On-screen control buttons

## 🎯 Future Improvements

- Multiple difficulty levels
- Different food types with special effects
- Power-ups and obstacles
- Multiplayer mode
- Custom themes and skins
- Sound effects and background music
- Achievement system