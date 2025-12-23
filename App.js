import React from "react";
import { View, StyleSheet, SafeAreaView, StatusBar, ActivityIndicator } from "react-native";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import GameScreen from "./app/game";
import ErrorBoundary from "./components/ErrorBoundary";

// Internal component that waits for auth to be ready
function AppContent() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return <GameScreen />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="light-content" backgroundColor="#000" />
          <View style={styles.container}>
            <AppContent />
          </View>
        </SafeAreaView>
      </AuthProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  container: {
    flex: 1,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
  },
});