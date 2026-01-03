import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LogBox } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '@/contexts/AuthContext';
import { GameProvider } from '@/contexts/GameContext';
import ErrorBoundary from '@/components/ErrorBoundary';

// Ignore specific warnings in production
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'Sending `onAnimatedValueUpdate` with no listeners registered',
]);

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Global error handler for unhandled promise rejections
if (typeof global.ErrorUtils !== 'undefined') {
  const originalHandler = global.ErrorUtils.getGlobalHandler();
  global.ErrorUtils.setGlobalHandler((error, isFatal) => {
    console.error('Global error handler:', error, 'Fatal:', isFatal);
    // Call original handler
    if (originalHandler) {
      originalHandler(error, isFatal);
    }
  });
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    const env = (typeof __DEV__ !== 'undefined' && __DEV__) ? 'Development' : 'Production';
    console.log('🚀 App starting - Environment:', env);
    console.log('📱 React Native version loaded');
  }, []);

  useEffect(() => {
    if (loaded) {
      console.log('✅ Fonts loaded, hiding splash screen');
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    console.log('🎯 RootLayout mounted with GameProvider');
  }, []);

  if (!loaded) {
    console.log('⏳ Waiting for fonts to load...');
    return null;
  }

  console.log('🎨 Rendering app with providers');

  return (  
    <ErrorBoundary>
      <AuthProvider>
        <GameProvider>
          <GestureHandlerRootView style={{ flex: 1 }}> 
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <Stack>
                <Stack.Screen name="game" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
              </Stack>
              <StatusBar style="auto" />
            </ThemeProvider>    
          </GestureHandlerRootView>
        </GameProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}