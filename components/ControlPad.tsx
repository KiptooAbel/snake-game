// ControlPad.tsx - On-screen directional controls
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Position {
  x: number;
  y: number;
}

interface ControlPadProps {
  onDirectionPress: (direction: Position) => void;
}

export default function ControlPad({ onDirectionPress }: ControlPadProps) {
  // Direction handlers
  const handleUpPress = () => onDirectionPress({ x: 0, y: -1 });
  const handleDownPress = () => onDirectionPress({ x: 0, y: 1 });
  const handleLeftPress = () => onDirectionPress({ x: -1, y: 0 });
  const handleRightPress = () => onDirectionPress({ x: 1, y: 0 });

  return (
    <View style={styles.container}>
      {/* Up button */}
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleUpPress}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-up" size={30} color="white" />
        </TouchableOpacity>
      </View>

      {/* Middle row (Left, Right) */}
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleLeftPress}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={30} color="white" />
        </TouchableOpacity>

        <View style={styles.centerSpacer} />

        <TouchableOpacity
          style={styles.button}
          onPress={handleRightPress}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-forward" size={30} color="white" />
        </TouchableOpacity>
      </View>

      {/* Down button */}
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleDownPress}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-down" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 180,
    height: 180,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 60,
    height: 60,
    backgroundColor: "rgba(80, 80, 80, 0.8)",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  centerSpacer: {
    width: 60,
    height: 60,
  },
});