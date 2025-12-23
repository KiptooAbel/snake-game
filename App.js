import React from "react";
import { View, StyleSheet, SafeAreaView, StatusBar } from "react-native";
import { AuthProvider } from "./contexts/AuthContext";
import GameScreen from "./app/game";
import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="light-content" backgroundColor="#000" />
          <View style={styles.container}>
            <GameScreen />
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
});