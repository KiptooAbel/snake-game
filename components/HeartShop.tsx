// HeartShop.tsx - Heart shop with modern design
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useGame } from "@/contexts/GameContext";

interface HeartShopProps {
  visible: boolean;
  onClose: () => void;
}

// Define heart packages
const HEART_PACKAGES = [
  { hearts: 1, cost: 15, label: "Starter", icon: "❤️" },
  { hearts: 3, cost: 40, label: "Bundle", icon: "❤️❤️❤️" },
  { hearts: 5, cost: 60, label: "Value Pack", icon: "💕" },
  { hearts: 10, cost: 100, label: "Mega Pack", icon: "💖" },
];

export default function HeartShop({ visible, onClose }: HeartShopProps) {
  const { rewardPoints, hearts, buyHearts } = useGame();
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);

  const handlePurchase = (packageItem: typeof HEART_PACKAGES[0]) => {
    if (rewardPoints >= packageItem.cost) {
      const success = buyHearts(packageItem.hearts, packageItem.cost);
      if (success) {
        setPurchaseSuccess(`+${packageItem.hearts} ❤️`);
        setTimeout(() => setPurchaseSuccess(null), 2000);
      }
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Background decorations */}
        <View style={styles.backgroundDecorations}>
          <View style={[styles.decoration, styles.decoration1]} />
          <View style={[styles.decoration, styles.decoration2]} />
          <View style={[styles.decoration, styles.decoration3]} />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Heart Shop</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Balance Display */}
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceTitle}>Your Balance</Text>
          <View style={styles.balanceRow}>
            <View style={styles.balanceCard}>
              <Text style={styles.balanceIcon}>💎</Text>
              <Text style={styles.balanceValue}>{rewardPoints}</Text>
              <Text style={styles.balanceLabel}>Gems</Text>
            </View>
            <View style={styles.balanceCard}>
              <Text style={styles.balanceIcon}>❤️</Text>
              <Text style={styles.balanceValue}>{hearts}</Text>
              <Text style={styles.balanceLabel}>Hearts</Text>
            </View>
          </View>
        </View>

        {/* Success Message */}
        {purchaseSuccess && (
          <View style={styles.successMessage}>
            <Text style={styles.successText}>{purchaseSuccess}</Text>
          </View>
        )}

        {/* Packages Grid */}
        <View style={styles.packagesContainer}>
          {HEART_PACKAGES.map((pkg, index) => {
            const canAfford = rewardPoints >= pkg.cost;
            return (
              <TouchableOpacity
                key={index}
                style={styles.packageCard}
                onPress={() => canAfford && handlePurchase(pkg)}
                activeOpacity={0.9}
                disabled={!canAfford}
              >
                <LinearGradient
                  colors={canAfford ? ["#FF1744", "#C62828"] : ["#424242", "#212121"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.packageGradient}
                >
                  <Text style={styles.packageLabel}>{pkg.label}</Text>
                  <Text style={styles.packageIcon}>{pkg.icon}</Text>
                  <Text style={styles.packageHearts}>{pkg.hearts} {pkg.hearts === 1 ? 'Heart' : 'Hearts'}</Text>
                  
                  <View style={styles.costContainer}>
                    <Text style={styles.packageCost}>💎 {pkg.cost}</Text>
                  </View>

                  {!canAfford && (
                    <View style={styles.lockedOverlay}>
                      <Text style={styles.lockedIcon}>🔒</Text>
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Info Footer */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>💡 How to Earn Gems</Text>
          <Text style={styles.infoText}>💎 Ruby (15th fruit): +10 gems</Text>
          <Text style={styles.infoText}>💎 Emerald (30th fruit): +25 gems</Text>
          <Text style={styles.infoText}>💎 Diamond (50th fruit): +50 gems</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#111",
  },
  backgroundDecorations: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  decoration: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FF1744',
    opacity: 0.05,
  },
  decoration1: {
    top: 50,
    right: -50,
  },
  decoration2: {
    top: 250,
    left: -80,
  },
  decoration3: {
    bottom: 150,
    right: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    letterSpacing: 2,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
  },
  balanceContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    zIndex: 1,
  },
  balanceTitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginBottom: 15,
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  balanceCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    alignItems: 'center',
    minWidth: 120,
  },
  balanceIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  balanceValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  balanceLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
  },
  successMessage: {
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignSelf: 'center',
    marginVertical: 10,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  successText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  packagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 15,
  },
  packageCard: {
    width: "45%",
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  packageGradient: {
    flex: 1,
    padding: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  packageLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: '600',
    letterSpacing: 1,
  },
  packageIcon: {
    fontSize: 40,
  },
  packageHearts: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    textAlign: 'center',
  },
  costContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  packageCost: {
    fontSize: 16,
    color: "#FFD700",
    fontWeight: "700",
  },
  lockedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  lockedIcon: {
    fontSize: 40,
  },
  infoContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginTop: 'auto',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 12,
  },
  infoText: {
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 13,
    marginBottom: 4,
  },
});
