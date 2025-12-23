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
  onSyncGameData?: () => Promise<void>; // Callback for game data sync
  setOnSyncGameData: (callback: () => Promise<void>) => void;
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
  const [onSyncGameData, setOnSyncGameData] = useState<(() => Promise<void>) | undefined>();

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
      try {
        await apiService.logout();
      } catch (logoutError) {
        console.error('Logout during auth check failed:', logoutError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { user: userData } = await apiService.login(email, password);
      setUser(userData);
      
      // Trigger game data sync after successful login
      if (onSyncGameData) {
        console.log('🔄 Triggering game data sync after login');
        try {
          await onSyncGameData();
        } catch (syncError) {
          console.error('Game data sync failed after login:', syncError);
          // Don't throw - login was successful even if sync failed
        }
      }
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
      
      // Trigger game data sync after successful registration
      if (onSyncGameData) {
        console.log('🔄 Triggering game data sync after registration');
        try {
          await onSyncGameData();
        } catch (syncError) {
          console.error('Game data sync failed after registration:', syncError);
          // Don't throw - registration was successful even if sync failed
        }
      }
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

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    onSyncGameData,
    setOnSyncGameData: (callback: () => Promise<void>) => setOnSyncGameData(() => callback),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
