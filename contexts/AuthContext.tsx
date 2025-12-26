import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiService, { User } from '@/services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  refreshGameData: () => Promise<void>;
  updateGems: (amount: number) => Promise<void>;
  updateHearts: (amount: number) => Promise<void>;
  unlockLevel: (level: number) => Promise<void>;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
  first_name: string;
  last_name: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      // Wait for token to be loaded from storage
      const isAuth = await apiService.isAuthenticatedAsync();
      if (isAuth) {
        const userData = await apiService.getProfile();
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Token might be expired, clear it
      await apiService.logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { user: userData } = await apiService.login(email, password);
      setUser(userData);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true);
      const { user: newUser } = await apiService.register(userData);
      setUser(newUser);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await apiService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, clear the local state
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      const updatedUser = await apiService.updateProfile(userData);
      setUser(updatedUser);
    } catch (error) {
      console.error('User update failed:', error);
      throw error;
    }
  };

  const refreshGameData = async () => {
    try {
      const gameData = await apiService.getGameData();
      if (user) {
        setUser({
          ...user,
          gems: gameData.gems,
          hearts: gameData.hearts,
          unlocked_levels: gameData.unlocked_levels,
        });
      }
    } catch (error) {
      console.error('Game data refresh failed:', error);
      throw error;
    }
  };

  const updateGems = async (amount: number) => {
    try {
      const result = await apiService.modifyGems(amount);
      if (user) {
        setUser({
          ...user,
          gems: result.gems,
        });
      }
    } catch (error) {
      console.error('Gems update failed:', error);
      throw error;
    }
  };

  const updateHearts = async (amount: number) => {
    try {
      const result = await apiService.modifyHearts(amount);
      if (user) {
        setUser({
          ...user,
          hearts: result.hearts,
        });
      }
    } catch (error) {
      console.error('Hearts update failed:', error);
      throw error;
    }
  };

  const unlockLevel = async (level: number) => {
    try {
      const result = await apiService.unlockLevel(level);
      if (user) {
        setUser({
          ...user,
          unlocked_levels: result.unlocked_levels,
        });
      }
    } catch (error) {
      console.error('Level unlock failed:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    refreshGameData,
    updateGems,
    updateHearts,
    unlockLevel,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
