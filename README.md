# 🐍 Enhanced Snake Game

An improved Snake game built with React Native and Expo, featuring modern design, smooth animations, user authentication, and competitive gameplay.

## 📱 Features

### 🎮 Core Gameplay
- **Responsive Design**: Adapts to different screen sizes
- **Beautiful UI**: Polished visuals with gradients and animations
- **Multiple Difficulty Levels**: Easy, Medium, and Hard modes
- **Power-ups & Obstacles**: Dynamic gameplay elements
- **Game Controls**:
  - Swipe gestures for intuitive control
  - On-screen control pad for precise movement
  - Option to hide/show controls

### 🔐 User Authentication
- **User Registration & Login**: Create accounts and sign in
- **Secure Authentication**: JWT token-based authentication
- **Profile Management**: View personal statistics and progress
- **Offline Support**: Game works without internet connection

### 🏆 Competitive Features
- **Score Tracking**: Personal best and total score tracking
- **Global Leaderboards**: Compete with players worldwide
- **Multiple Leaderboard Types**:
  - All-time global rankings
  - Daily competitions
  - Weekly challenges
  - Monthly tournaments
- **Real-time Updates**: Live leaderboard updates

### 🎨 Enhanced Visuals
- **Animated Welcome Screen**: Engaging snake animation introduction
- **Food Animations**: Pulsing and rotation effects
- **Snake Styling**: Gradient colors and head/body differentiation
- **Smooth Animations**: Fluid gameplay and UI transitions
- **Modern Interface**: Clean, intuitive design

### 🎯 Game Mechanics
- **Dynamic Speed**: Increases as your score grows
- **Wrap-around Borders**: Snake passes through walls
- **High Score Tracking**: Local and server-side tracking
- **Game Statistics**: Detailed gameplay analytics
- **Power-up System**: Special abilities and challenges

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI
- Android Studio or Xcode for device testing

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/snake-game.git
   cd snake-game
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Open on your device**
   - Scan the QR code with the Expo Go app
   - Press `a` for Android emulator
   - Press `i` for iOS simulator

## 🔧 Backend Setup

The game includes full backend integration for user authentication and score tracking. See the detailed backend setup guide:

- **[Backend Setup Guide](BACKEND_SETUP.md)** - Complete Laravel backend setup
- **[Frontend Integration Guide](FRONTEND_INTEGRATION.md)** - API integration details

### Quick Backend Setup
1. Set up Laravel backend (see BACKEND_SETUP.md)
2. Update API URL in `services/apiService.ts`
3. Configure environment variables
4. Deploy backend to your server

## 🎮 How to Play

### Getting Started
- **First Launch**: Enjoy the animated welcome screen
- **Create Account**: Register to track scores and compete
- **Start Playing**: The game starts automatically after setup

### Controls
- **Swipe Controls**: Swipe in any direction to move the snake
- **Control Pad**: Use the on-screen control pad for precise movement
- **Pause/Resume**: Tap the pause button or use system controls

### Gameplay
- **Objective**: Eat the food to grow your snake and increase your score
- **Scoring**: Points increase based on difficulty level
- **Power-ups**: Collect special items for temporary abilities
- **Obstacles**: Avoid barriers on harder difficulty levels
- **Survival**: Don't let the snake hit itself

### Difficulty Levels
- **Easy**: Slower speed, no obstacles
- **Medium**: Moderate speed, occasional obstacles  
- **Hard**: Fast speed, frequent obstacles

## 🏗️ Architecture

### Project Structure
```
snake-game/
├── app/                    # Main app screens
├── components/             # Reusable UI components
│   ├── auth/              # Authentication components
│   ├── game/              # Game-specific components
│   └── ui/                # Generic UI components
├── contexts/              # React contexts for state management
├── hooks/                 # Custom React hooks
├── services/              # API services and utilities
├── constants/             # App constants and configurations
└── assets/               # Images, fonts, and other assets
```

### Key Components
- **GameContext**: Core game state management
- **AuthContext**: User authentication state
- **ApiService**: Backend API communication
- **WelcomeScreen**: Animated introduction
- **GameBoard**: Main game rendering
- **LeaderboardScreen**: Competitive rankings
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