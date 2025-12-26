import AsyncStorage from '@react-native-async-storage/async-storage';

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

// Check if AsyncStorage is available (important for release builds)
const isStorageAvailable = async (): Promise<boolean> => {
  try {
    if (typeof AsyncStorage === 'undefined' || AsyncStorage === null) {
      return false;
    }
    // Try a test operation
    await AsyncStorage.setItem('@test_storage', 'test');
    await AsyncStorage.removeItem('@test_storage');
    return true;
  } catch (error) {
    return false;
  }
};

class GameStorageService {
  private storageChecked: boolean = false;
  private storageAvailable: boolean = false;
  
  private async checkStorage(): Promise<boolean> {
    if (this.storageChecked) {
      return this.storageAvailable;
    }
    
    this.storageAvailable = await isStorageAvailable();
    this.storageChecked = true;
    
    if (!this.storageAvailable) {
      console.warn('AsyncStorage is not available, using in-memory storage only');
    }
    
    return this.storageAvailable;
  }
  
  /**
   * Get all game data from local storage
   */
  async getGameData(): Promise<GameData> {
    const hasStorage = await this.checkStorage();
    
    if (!hasStorage) {
      return {
        gems: 0,
        hearts: 0,
        unlockedLevels: [1],
        highScore: 0,
        lastSync: null,
      };
    }
    
    try {
      const [gems, hearts, unlockedLevels, highScore, lastSync] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.GEMS),
        AsyncStorage.getItem(STORAGE_KEYS.HEARTS),
        AsyncStorage.getItem(STORAGE_KEYS.UNLOCKED_LEVELS),
        AsyncStorage.getItem(STORAGE_KEYS.HIGH_SCORE),
        AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC),
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
   * Save gems to local storage
   */
  async saveGems(gems: number): Promise<void> {
    const hasStorage = await this.checkStorage();
    if (!hasStorage) return;
    
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.GEMS, gems.toString());
    } catch (error) {
      console.error('Error saving gems:', error);
      // Don't throw - continue silently
    }
  }

  /**
   * Save hearts to local storage
   */
  async saveHearts(hearts: number): Promise<void> {
    const hasStorage = await this.checkStorage();
    if (!hasStorage) return;
    
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.HEARTS, hearts.toString());
    } catch (error) {
      console.error('Error saving hearts:', error);
      // Don't throw - continue silently
    }
  }

  /**
   * Save unlocked levels to local storage
   */
  async saveUnlockedLevels(levels: number[]): Promise<void> {
    const hasStorage = await this.checkStorage();
    if (!hasStorage) return;
    
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.UNLOCKED_LEVELS, JSON.stringify(levels));
    } catch (error) {
      console.error('Error saving unlocked levels:', error);
      // Don't throw - continue silently
    }
  }

  /**
   * Save high score to local storage
   */
  async saveHighScore(score: number): Promise<void> {
    const hasStorage = await this.checkStorage();
    if (!hasStorage) return;
    
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.HIGH_SCORE, score.toString());
    } catch (error) {
      console.error('Error saving high score:', error);
      // Don't throw - continue silently
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
      console.error('Error saving game data:', error);
      // Don't throw - continue silently
    }
  }

  /**
   * Update last sync timestamp
   */
  async updateLastSync(): Promise<void> {
    const hasStorage = await this.checkStorage();
    if (!hasStorage) return;
    
    try {
      const now = new Date().toISOString();
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, now);
    } catch (error) {
      console.error('Error updating last sync:', error);
      // Don't throw - continue silently
    }
  }

  /**
   * Clear all game data (useful for debugging or reset)
   */
  async clearGameData(): Promise<void> {
    const hasStorage = await this.checkStorage();
    if (!hasStorage) return;
    
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.GEMS,
        STORAGE_KEYS.HEARTS,
        STORAGE_KEYS.UNLOCKED_LEVELS,
        STORAGE_KEYS.HIGH_SCORE,
        STORAGE_KEYS.LAST_SYNC,
      ]);
    } catch (error) {
      console.error('Error clearing game data:', error);
      // Don't throw - continue silently
    }
  }

  /**
   * Get individual values
   */
  async getGems(): Promise<number> {
    try {
      const gems = await AsyncStorage.getItem(STORAGE_KEYS.GEMS);
      return gems ? parseInt(gems, 10) : 0;
    } catch (error) {
      console.error('Error getting gems:', error);
      return 0;
    }
  }

  async getHearts(): Promise<number> {
    try {
      const hearts = await AsyncStorage.getItem(STORAGE_KEYS.HEARTS);
      return hearts ? parseInt(hearts, 10) : 0;
    } catch (error) {
      console.error('Error getting hearts:', error);
      return 0;
    }
  }

  async getUnlockedLevels(): Promise<number[]> {
    try {
      const levels = await AsyncStorage.getItem(STORAGE_KEYS.UNLOCKED_LEVELS);
      return levels ? JSON.parse(levels) : [1];
    } catch (error) {
      console.error('Error getting unlocked levels:', error);
      return [1];
    }
  }

  async getHighScore(): Promise<number> {
    try {
      const score = await AsyncStorage.getItem(STORAGE_KEYS.HIGH_SCORE);
      return score ? parseInt(score, 10) : 0;
    } catch (error) {
      console.error('Error getting high score:', error);
      return 0;
    }
  }
}

export default new GameStorageService();
