import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Robust storage wrapper with multiple fallback strategies
 * Handles production build issues with AsyncStorage
 */

const STORAGE_KEYS = {
  GEMS: '@game/gems',
  HEARTS: '@game/hearts',
  UNLOCKED_LEVELS: '@game/unlocked_levels',
  HIGH_SCORE: '@game/high_score',
  LAST_SYNC: '@game/last_sync',
};

export interface GameData {
  gems: number;
  hearts: number;
  unlockedLevels: number[];
  highScore: number;
  lastSync: string | null;
}

// In-memory fallback storage for when AsyncStorage fails
class InMemoryStorage {
  private storage: Map<string, string> = new Map();

  async getItem(key: string): Promise<string | null> {
    return this.storage.get(key) || null;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.storage.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    this.storage.delete(key);
  }

  async multiRemove(keys: string[]): Promise<void> {
    keys.forEach(key => this.storage.delete(key));
  }

  async multiGet(keys: string[]): Promise<[string, string | null][]> {
    return keys.map(key => [key, this.storage.get(key) || null]);
  }
}

class RobustGameStorage {
  private inMemoryStorage = new InMemoryStorage();
  private useInMemoryFallback = false;
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;

  /**
   * Initialize and test storage availability
   */
  private async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this.testStorage();
    await this.initPromise;
    this.isInitialized = true;
  }

  private async testStorage(): Promise<void> {
    try {
      const testKey = '@storage_test_' + Date.now();
      const testValue = 'test';
      
      // Test AsyncStorage with timeout
      await Promise.race([
        (async () => {
          await AsyncStorage.setItem(testKey, testValue);
          const retrieved = await AsyncStorage.getItem(testKey);
          await AsyncStorage.removeItem(testKey);
          
          if (retrieved !== testValue) {
            throw new Error('Storage test failed: value mismatch');
          }
        })(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Storage test timeout')), 1000)
        )
      ]);
      
      this.useInMemoryFallback = false;
    } catch (error) {
      console.warn('AsyncStorage not available, using in-memory fallback:', error);
      this.useInMemoryFallback = true;
    }
  }

  private async getStorage() {
    await this.initialize();
    return this.useInMemoryFallback ? this.inMemoryStorage : AsyncStorage;
  }

  /**
   * Get all game data from storage
   */
  async getGameData(): Promise<GameData> {
    try {
      const storage = await this.getStorage();
      
      const [gems, hearts, unlockedLevels, highScore, lastSync] = await Promise.all([
        storage.getItem(STORAGE_KEYS.GEMS),
        storage.getItem(STORAGE_KEYS.HEARTS),
        storage.getItem(STORAGE_KEYS.UNLOCKED_LEVELS),
        storage.getItem(STORAGE_KEYS.HIGH_SCORE),
        storage.getItem(STORAGE_KEYS.LAST_SYNC),
      ]);

      return {
        gems: gems ? parseInt(gems, 10) : 0,
        hearts: hearts ? parseInt(hearts, 10) : 0,
        unlockedLevels: unlockedLevels ? JSON.parse(unlockedLevels) : [1],
        highScore: highScore ? parseInt(highScore, 10) : 0,
        lastSync: lastSync,
      };
    } catch (error) {
      console.error('Error loading game data:', error);
      return {
        gems: 0,
        hearts: 0,
        unlockedLevels: [1],
        highScore: 0,
        lastSync: null,
      };
    }
  }

  /**
   * Save gems
   */
  async saveGems(gems: number): Promise<void> {
    try {
      const storage = await this.getStorage();
      await storage.setItem(STORAGE_KEYS.GEMS, gems.toString());
    } catch (error) {
      // Silent fail
    }
  }

  /**
   * Save hearts
   */
  async saveHearts(hearts: number): Promise<void> {
    try {
      const storage = await this.getStorage();
      await storage.setItem(STORAGE_KEYS.HEARTS, hearts.toString());
    } catch (error) {
      // Silent fail
    }
  }

  /**
   * Save unlocked levels
   */
  async saveUnlockedLevels(levels: number[]): Promise<void> {
    try {
      const storage = await this.getStorage();
      await storage.setItem(STORAGE_KEYS.UNLOCKED_LEVELS, JSON.stringify(levels));
    } catch (error) {
      // Silent fail
    }
  }

  /**
   * Save high score
   */
  async saveHighScore(score: number): Promise<void> {
    try {
      const storage = await this.getStorage();
      await storage.setItem(STORAGE_KEYS.HIGH_SCORE, score.toString());
    } catch (error) {
      // Silent fail
    }
  }

  /**
   * Save all game data at once
   */
  async saveGameData(data: Partial<GameData>): Promise<void> {
    try {
      const updates: Promise<void>[] = [];

      if (data.gems !== undefined) {
        updates.push(this.saveGems(data.gems));
      }
      if (data.hearts !== undefined) {
        updates.push(this.saveHearts(data.hearts));
      }
      if (data.unlockedLevels !== undefined) {
        updates.push(this.saveUnlockedLevels(data.unlockedLevels));
      }
      if (data.highScore !== undefined) {
        updates.push(this.saveHighScore(data.highScore));
      }

      await Promise.all(updates);
    } catch (error) {
      // Silent fail
    }
  }

  /**
   * Update last sync timestamp
   */
  async updateLastSync(): Promise<void> {
    try {
      const storage = await this.getStorage();
      const now = new Date().toISOString();
      await storage.setItem(STORAGE_KEYS.LAST_SYNC, now);
    } catch (error) {
      // Silent fail
    }
  }

  /**
   * Clear all game data
   */
  async clearGameData(): Promise<void> {
    try {
      const storage = await this.getStorage();
      await storage.multiRemove?.([
        STORAGE_KEYS.GEMS,
        STORAGE_KEYS.HEARTS,
        STORAGE_KEYS.UNLOCKED_LEVELS,
        STORAGE_KEYS.HIGH_SCORE,
        STORAGE_KEYS.LAST_SYNC,
      ]);
    } catch (error) {
      // Silent fail
    }
  }

  /**
   * Check if using in-memory fallback
   */
  isUsingInMemoryFallback(): boolean {
    return this.useInMemoryFallback;
  }
}

export default new RobustGameStorage();
