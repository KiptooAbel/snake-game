import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

interface GameOverProps {
  onRestart: () => void;
}

export default function GameOver({ onRestart }: GameOverProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Game Over! 💀</Text>
      <Button title="Restart" onPress={onRestart} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  text: {
    fontSize: 32,
    color: "white",
    fontWeight: "bold",
    marginBottom: 20,
  },
});
