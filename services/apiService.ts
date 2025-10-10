import AsyncStorage from '@react-native-async-storage/async-storage';

// API Configuration - Choose the appropriate URL for your setup
// Force production URL for APK builds (comment out for local development)
const API_BASE_URL = 'https://snake.abelk.dev/api'; // Production URL

// Uncomment below for local development:
// const API_BASE_URL = __DEV__ 
//   ? 'http://192.168.100.50:8000/api'  // Laravel artisan serve accessible from mobile device
//   // ? 'http://localhost/minigame/LaravelBackend/public/api'  // XAMPP direct path (only for web)
//   // ? 'http://127.0.0.1:8000/api'  // Laravel artisan serve (only for emulator)
//   // ? 'http://10.0.2.2:8000/api'  // Android emulator
//   : 'https://snake.abelk.dev/api'; // Production URL

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  total_games: number;
  best_score: number;
  total_score: number;
}

export interface Score {
  id: number;
  score: number;
  level: number;
  game_duration: number;
  difficulty: string;
  game_stats: any;
  created_at: string;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
}

class ApiService {
  private token: string | null = null;

  constructor() {
    this.loadToken();
  }

  private async loadToken() {
    try {
      // Check if we're in a web environment
      if (typeof window === 'undefined') {
        // Server-side rendering or Node.js environment
        return;
      }
      this.token = await AsyncStorage.getItem('auth_token');
    } catch (error) {
      console.error('Error loading token:', error);
    }
  }

  private async saveToken(token: string) {
    try {
      this.token = token;
      if (typeof window !== 'undefined') {
        await AsyncStorage.setItem('auth_token', token);
      }
    } catch (error) {
      console.error('Error saving token:', error);
    }
  }

  private async removeToken() {
    try {
      this.token = null;
      if (typeof window !== 'undefined') {
        await AsyncStorage.removeItem('auth_token');
      }
    } catch (error) {
      console.error('Error removing token:', error);
    }
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log(`Making API request to: ${url}`);
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          await this.removeToken();
          throw new Error('Authentication required');
        }
        
        // Handle Laravel validation errors
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat();
          throw new Error(errorMessages.join(', '));
        }
        
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      if (error instanceof TypeError && error.message.includes('Network request failed')) {
        throw new Error('Network error. Please check your connection and ensure the server is running.');
      }
      throw error;
    }
  }

  // Authentication methods
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // Handle Laravel backend login response
    if (response.success && response.access_token) {
      await this.saveToken(response.access_token);
      return { user: response.user, token: response.access_token };
    }

    throw new Error(response.message || 'Login failed');
  }

  async register(userData: {
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
    first_name: string;
    last_name: string;
  }): Promise<{ user: User; token: string }> {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    // Handle Laravel backend register response
    if (response.success && response.token) {
      await this.saveToken(response.token);
      return { user: response.user, token: response.token };
    }

    throw new Error(response.message || 'Registration failed');
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API error:', error);
    } finally {
      await this.removeToken();
    }
  }

  async refreshToken(): Promise<string> {
    const response = await this.request('/auth/refresh', { method: 'POST' });
    
    if (response.access_token) {
      await this.saveToken(response.access_token);
      return response.access_token;
    }

    throw new Error('Token refresh failed');
  }

  // User methods
  async getProfile(): Promise<User> {
    const response = await this.request('/auth/profile');
    return response.success ? response.user : response;
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    return this.request('/user', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async getUserStats(): Promise<{
    total_games: number;
    best_score: number;
    total_score: number;
    average_score: number;
    rank: number;
  }> {
    return this.request('/user/stats');
  }

  // Score methods
  async submitScore(scoreData: {
    score: number;
    level: number;
    game_duration: number;
    difficulty: string;
    game_stats?: any;
  }): Promise<Score> {
    return this.request('/scores', {
      method: 'POST',
      body: JSON.stringify(scoreData),
    });
  }

  async getScores(page: number = 1): Promise<{
    data: Score[];
    current_page: number;
    last_page: number;
    total: number;
  }> {
    return this.request(`/scores?page=${page}`);
  }

  async getBestScores(): Promise<Score[]> {
    return this.request('/scores/best');
  }

  // Leaderboard methods
  async getGlobalLeaderboard(): Promise<LeaderboardEntry[]> {
    return this.request('/leaderboard/global');
  }

  async getDailyLeaderboard(): Promise<LeaderboardEntry[]> {
    return this.request('/leaderboard/daily');
  }

  async getWeeklyLeaderboard(): Promise<LeaderboardEntry[]> {
    return this.request('/leaderboard/weekly');
  }

  async getMonthlyLeaderboard(): Promise<LeaderboardEntry[]> {
    return this.request('/leaderboard/monthly');
  }

  // Utility methods
  isAuthenticated(): boolean {
    return this.token !== null;
  }

  getToken(): string | null {
    return this.token;
  }
}

export default new ApiService();
