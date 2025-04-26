import React from "react";
import { View, StyleSheet } from "react-native";
import GameScreen from "./screens/GameScreen";

export default function App() {
  return (
    <View style={styles.container}>
      <GameScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },
});
