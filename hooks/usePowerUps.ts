// hooks/usePowerUps.ts
import { useState, useEffect, useCallback } from 'react';

// Define the types
export type PowerUpType = 'SPEED_BOOST' | 'SPEED_SLOW' | 'DOUBLE_POINTS' | 'INVINCIBILITY' | 'GHOST_MODE' | null;

interface ActivePowerUp {
  type: PowerUpType;
  duration: number;
  endTime: number;
  speedFactor?: number;
}

export const usePowerUps = () => {
  const [activePowerUps, setActivePowerUps] = useState<ActivePowerUp[]>([]);
  
  // Check if a specific power-up is active
  const isPowerUpActive = useCallback((type: PowerUpType): boolean => {
    return activePowerUps.some(powerUp => powerUp.type === type);
  }, [activePowerUps]);
  
  // Add a new power-up
  const addPowerUp = useCallback((type: PowerUpType, duration: number, speedFactor?: number) => {
    if (!type) return;
    
    // Remove any existing power-up of the same type
    setActivePowerUps(prev => prev.filter(powerUp => powerUp.type !== type));
    
    // Add the new power-up
    const endTime = Date.now() + duration;
    setActivePowerUps(prev => [...prev, { type, duration, endTime, speedFactor }]);
  }, []);
  
  // Remove a power-up
  const removePowerUp = useCallback((type: PowerUpType) => {
    setActivePowerUps(prev => prev.filter(powerUp => powerUp.type !== type));
  }, []);
  
  // Get speed factor from active power-ups
  const getSpeedFactor = useCallback((): number => {
    const speedBoost = activePowerUps.find(p => p.type === 'SPEED_BOOST');
    const speedSlow = activePowerUps.find(p => p.type === 'SPEED_SLOW');
    
    if (speedBoost && speedBoost.speedFactor) return speedBoost.speedFactor;
    if (speedSlow && speedSlow.speedFactor) return speedSlow.speedFactor;
    
    return 1; // Default: no change
  }, [activePowerUps]);
  
  // Check for expired power-ups and remove them
  useEffect(() => {
    const checkExpired = () => {
      const now = Date.now();
      const expired = activePowerUps.filter(powerUp => powerUp.endTime <= now);
      
      if (expired.length > 0) {
        setActivePowerUps(prev => prev.filter(powerUp => powerUp.endTime > now));
      }
    };
    
    // Set up interval to check every 100ms
    const interval = setInterval(checkExpired, 100);
    return () => clearInterval(interval);
  }, [activePowerUps]);
  
  // Return remaining duration for a power-up
  const getRemainingTime = useCallback((type: PowerUpType): number => {
    const powerUp = activePowerUps.find(p => p.type === type);
    if (!powerUp) return 0;
    
    const remaining = powerUp.endTime - Date.now();
    return Math.max(0, remaining);
  }, [activePowerUps]);
  
  // Get all active power-ups with their remaining times
  const getActivePowerUps = useCallback((): { type: PowerUpType, remainingTime: number }[] => {
    const now = Date.now();
    return activePowerUps.map(powerUp => ({
      type: powerUp.type,
      remainingTime: Math.max(0, powerUp.endTime - now)
    }));
  }, [activePowerUps]);
  
  return {
    isPowerUpActive,
    addPowerUp,
    removePowerUp,
    getSpeedFactor,
    getRemainingTime,
    getActivePowerUps
  };
};