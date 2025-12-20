// ContinueGameModal.tsx - Modal that appears when player fails, asking if they want to use a heart to continue
import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Modal } from "react-native";

interface ContinueGameModalProps {
  visible: boolean;
  heartsRemaining: number;
  onContinue: () => void;
  onGameOver: () => void;
}

export default function ContinueGameModal({ 
  visible, 
  heartsRemaining, 
  onContinue, 
  onGameOver 
}: ContinueGameModalProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    if (visible) {
      // Run entrance animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.5);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onGameOver}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.title}>Game Over!</Text>
          
          <View style={styles.messageContainer}>
            <Text style={styles.message}>Do you want to continue playing?</Text>
            <View style={styles.heartsContainer}>
              <Text style={styles.heartIcon}>❤️</Text>
              <Text style={styles.heartsText}>
                {heartsRemaining} {heartsRemaining === 1 ? 'heart' : 'hearts'} remaining
              </Text>
            </View>
            <Text style={styles.immunityText}>
              You'll respawn at center with 5s invincibility!
            </Text>
          </View>
          
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.continueButton]}
              onPress={onContinue}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Continue with 🛡️</Text>
              <Text style={styles.buttonSubtext}>(Use 1 ❤️)</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.endButton]}
              onPress={onGameOver}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>End Game</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.tipText}>
            Collect heart icons during gameplay to get more continues!
          </Text>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#1a1a1a",
    borderRadius: 20,
    padding: 30,
    width: "85%",
    maxWidth: 400,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FF1744",
    shadowColor: "#FF1744",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF1744",
    marginBottom: 20,
    textShadowColor: "rgba(255, 23, 68, 0.5)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  messageContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  message: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginBottom: 15,
  },
  heartsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 23, 68, 0.2)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FF1744",
  },
  heartIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  heartsText: {
    fontSize: 18,
    color: "#FF1744",
    fontWeight: "bold",
  },
  immunityText: {
    fontSize: 14,
    color: "#4CAF50",
    marginTop: 10,
    fontWeight: "600",
    textAlign: "center",
  },
  buttonsContainer: {
    width: "100%",
    gap: 15,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 2,
  },
  continueButton: {
    backgroundColor: "#4CAF50",
    borderColor: "#66BB6A",
  },
  endButton: {
    backgroundColor: "#555",
    borderColor: "#777",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonSubtext: {
    color: "white",
    fontSize: 12,
    marginTop: 2,
    opacity: 0.9,
  },
  tipText: {
    fontSize: 12,
    color: "#AAA",
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
  },
});
