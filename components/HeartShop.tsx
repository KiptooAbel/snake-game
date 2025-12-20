// HeartShop.tsx - Modal for purchasing hearts with gems
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert } from "react-native";
import { useGame } from "@/contexts/GameContext";

interface HeartShopProps {
  visible: boolean;
  onClose: () => void;
}

// Define heart packages
const HEART_PACKAGES = [
  { hearts: 1, cost: 15, label: "Starter" },
  { hearts: 3, cost: 40, label: "Bundle" },
  { hearts: 5, cost: 60, label: "Value Pack" },
  { hearts: 10, cost: 100, label: "Mega Pack" },
];

export default function HeartShop({ visible, onClose }: HeartShopProps) {
  const { rewardPoints, hearts, buyHearts } = useGame();

  const handlePurchase = (packageItem: typeof HEART_PACKAGES[0]) => {
    if (rewardPoints >= packageItem.cost) {
      const success = buyHearts(packageItem.hearts, packageItem.cost);
      if (success) {
        Alert.alert(
          "Purchase Successful! ❤️",
          `You bought ${packageItem.hearts} ${packageItem.hearts === 1 ? 'heart' : 'hearts'}!`,
          [{ text: "OK" }]
        );
      }
    } else {
      Alert.alert(
        "Not Enough Gems! 💎",
        `You need ${packageItem.cost} gems but only have ${rewardPoints}.`,
        [{ text: "OK" }]
      );
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>❤️ Heart Shop</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Your Balance:</Text>
            <View style={styles.balanceRow}>
              <Text style={styles.gemsText}>💎 {rewardPoints}</Text>
              <Text style={styles.heartsText}>❤️ {hearts}</Text>
            </View>
          </View>

          <View style={styles.packagesContainer}>
            {HEART_PACKAGES.map((pkg, index) => {
              const canAfford = rewardPoints >= pkg.cost;
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.packageCard,
                    !canAfford && styles.packageCardDisabled
                  ]}
                  onPress={() => handlePurchase(pkg)}
                  activeOpacity={0.8}
                  disabled={!canAfford}
                >
                  <Text style={styles.packageLabel}>{pkg.label}</Text>
                  <View style={styles.packageContent}>
                    <Text style={styles.packageHearts}>❤️ {pkg.hearts}</Text>
                    <Text style={styles.packageCost}>💎 {pkg.cost}</Text>
                  </View>
                  {!canAfford && (
                    <View style={styles.lockedBadge}>
                      <Text style={styles.lockedText}>🔒</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.infoText}>
            Collect hearts to continue playing when you fail!
          </Text>
        </View>
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
    padding: 25,
    width: "90%",
    maxWidth: 500,
    borderWidth: 2,
    borderColor: "#FF1744",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FF1744",
  },
  closeButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  balanceContainer: {
    backgroundColor: "#2a2a2a",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 14,
    color: "#AAA",
    marginBottom: 8,
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  gemsText: {
    fontSize: 20,
    color: "#FFD700",
    fontWeight: "bold",
  },
  heartsText: {
    fontSize: 20,
    color: "#FF1744",
    fontWeight: "bold",
  },
  packagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  packageCard: {
    width: "48%",
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#FF1744",
    position: "relative",
  },
  packageCardDisabled: {
    opacity: 0.5,
    borderColor: "#555",
  },
  packageLabel: {
    fontSize: 12,
    color: "#AAA",
    marginBottom: 8,
    textAlign: "center",
  },
  packageContent: {
    alignItems: "center",
  },
  packageHearts: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF1744",
    marginBottom: 5,
  },
  packageCost: {
    fontSize: 16,
    color: "#FFD700",
    fontWeight: "600",
  },
  lockedBadge: {
    position: "absolute",
    top: 5,
    right: 5,
  },
  lockedText: {
    fontSize: 16,
  },
  infoText: {
    fontSize: 12,
    color: "#AAA",
    textAlign: "center",
    fontStyle: "italic",
  },
});
