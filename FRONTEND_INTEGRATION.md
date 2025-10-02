# Frontend Integration Guide

## Overview
This guide explains how to integrate your Snake Game mobile app with the Laravel backend for user authentication and score tracking.

## Features Added
- ✅ Animated welcome screen with snake animation
- ✅ User authentication (login/register)
- ✅ Score submission to backend
- ✅ Global and periodic leaderboards
- ✅ User profile and statistics
- ✅ JWT token-based authentication
- ✅ Offline-first approach (game works without internet)

## New Components

### 1. WelcomeScreen.tsx
- Animated snake intro with app description
- Shows on first app launch
- Replaced the default icon with engaging content

### 2. Authentication Components
- `AuthFlow.tsx` - Main authentication modal handler
- `LoginScreen.tsx` - User login form
- `RegisterScreen.tsx` - User registration form
- `AuthContext.tsx` - Authentication state management

### 3. User Experience Components
- `UserProfile.tsx` - User profile with statistics
- `LeaderboardScreen.tsx` - Multiple leaderboard views
- Updated `Header.tsx` - Authentication and leaderboard buttons

### 4. API Integration
- `apiService.ts` - Complete API client for backend communication
- Automatic token management with AsyncStorage
- Error handling and offline support

## API Configuration

### 1. Update API URL
In `services/apiService.ts`, update the API base URL:
```typescript
const API_BASE_URL = 'https://your-api-domain.com/api';
```

### 2. Environment Configuration
Create a `.env` file or config file for different environments:
```
# Development
API_BASE_URL=http://localhost:8000/api

# Staging  
API_BASE_URL=https://staging-api.yourdomain.com/api

# Production
API_BASE_URL=https://api.yourdomain.com/api
```

## Authentication Flow

### 1. User Registration
```typescript
// Users can register with:
{
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
  first_name: string;
  last_name: string;
}
```

### 2. User Login
```typescript
// Users can login with:
{
  email: string;
  password: string;
}
```

### 3. Token Storage
- JWT tokens are automatically stored in AsyncStorage
- Tokens persist between app sessions
- Automatic token refresh on API calls

## Score Submission

### Automatic Score Submission
When a game ends, if the user is authenticated:
```typescript
await apiService.submitScore({
  score: finalScore,
  level: calculatedLevel,
  game_duration: gameTimeInSeconds,
  difficulty: selectedDifficulty,
  game_stats: {
    obstacles_count: obstaclesEncountered,
    power_ups_used: powerUpsActivated,
  },
});
```

### Score Data Structure
```typescript
interface ScoreData {
  score: number;           // Final game score
  level: number;          // Level achieved
  game_duration: number;  // Time played in seconds
  difficulty: string;     // 'easy', 'normal', 'hard'
  game_stats?: {          // Additional game statistics
    obstacles_count?: number;
    power_ups_used?: number;
    food_eaten?: number;
  };
}
```

## Leaderboard Features

### Multiple Leaderboard Types
- **Global**: All-time best scores
- **Daily**: Best scores from today
- **Weekly**: Best scores from this week
- **Monthly**: Best scores from this month

### Real-time Updates
- Pull-to-refresh functionality
- Automatic highlighting of current user
- Rank display with emojis for top 3

## User Profile Features

### Statistics Display
- Best Score
- Total Games Played
- Average Score
- Global Rank
- Total Points Earned

### Profile Actions
- View Leaderboards
- Update Profile (future feature)
- Logout

## Offline Support

### Game Functionality
- Game works completely offline
- Scores are submitted when connection is restored
- Authentication state persists offline

### Data Persistence
```typescript
// Stored in AsyncStorage:
- auth_token: JWT authentication token
- hasLaunched: First launch flag for welcome screen
```

## Error Handling

### API Errors
```typescript
// Automatic error handling for:
- Network connectivity issues
- Token expiration (auto-refresh)
- Server errors
- Validation errors
```

### User-Friendly Messages
- Login failures show clear error messages
- Network issues are handled gracefully
- Validation errors are displayed inline

## Security Features

### Token Management
- JWT tokens with automatic refresh
- Secure storage in device keychain
- Automatic logout on token expiration

### Input Validation
- Client-side validation for all forms
- Email format validation
- Password strength requirements
- Username uniqueness checking

## Performance Optimizations

### Lazy Loading
- Authentication components load on demand
- API calls are cached where appropriate
- Images and assets are optimized

### Memory Management
- Automatic cleanup of intervals and timers
- Proper component unmounting
- Optimized re-renders with useCallback

## Development Tips

### Testing Authentication
1. Test with invalid credentials
2. Test network connectivity issues
3. Test token expiration scenarios
4. Test registration validation

### Testing Score Submission
1. Play games with different difficulties
2. Test score submission with/without network
3. Verify leaderboard updates
4. Test edge cases (score = 0, very high scores)

### Debugging API Calls
```typescript
// Enable debugging in apiService.ts
const DEBUG_MODE = __DEV__; // true in development

if (DEBUG_MODE) {
  console.log('API Request:', endpoint, options);
  console.log('API Response:', data);
}
```

## Future Enhancements

### Planned Features
- [ ] Social features (friends, challenges)
- [ ] Achievement system
- [ ] Profile picture upload
- [ ] Push notifications for leaderboard changes
- [ ] Game replay system
- [ ] Statistics graphs and charts

### Backend Integration Points
- [ ] Password reset functionality
- [ ] Email verification
- [ ] Social media login (Google, Facebook)
- [ ] Real-time multiplayer features

## Troubleshooting

### Common Issues

**Authentication not working:**
- Check API base URL is correct
- Verify backend is running and accessible
- Check console logs for specific error messages

**Scores not submitting:**
- Ensure user is logged in
- Check network connectivity
- Verify API endpoint is configured correctly

**Leaderboard not loading:**
- Check if leaderboard API endpoints are working
- Verify CORS settings on backend
- Check for rate limiting issues

**Welcome screen not showing:**
- Clear app data/storage to reset first launch flag
- Check AsyncStorage permissions

### Debug Commands
```bash
# Clear React Native cache
npx react-native start --reset-cache

# Clear AsyncStorage (iOS Simulator)
xcrun simctl delete all

# Clear AsyncStorage (Android Emulator)  
adb shell pm clear com.yourapp.package
```

## Production Deployment

### Pre-deployment Checklist
- [ ] Update API URLs for production
- [ ] Test all authentication flows
- [ ] Verify score submission works
- [ ] Test offline functionality
- [ ] Check error handling
- [ ] Validate security measures

### Environment Variables
```javascript
// Use environment-specific configurations
const config = {
  development: {
    API_BASE_URL: 'http://localhost:8000/api',
    DEBUG: true,
  },
  production: {
    API_BASE_URL: 'https://api.yourdomain.com/api',
    DEBUG: false,
  }
};
```

This integration provides a complete user authentication and scoring system while maintaining the core gameplay experience of your Snake Game!
