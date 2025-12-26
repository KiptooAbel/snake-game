import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiService, { User } from '@/services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import safeConsole from '@/utils/safeConsole';

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
    // In development, log warning but don't crash
    if (__DEV__) {
      safeConsole.warn('useAuth must be used within an AuthProvider');
    }
    // Return a safe default object instead of throwing
    return {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: async () => {},
      register: async () => {},
      logout: async () => {},
      updateUser: async () => {},
      onSyncGameData: undefined,
      setOnSyncGameData: () => {},
    } as AuthContextType;
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
    // Small delay to ensure AsyncStorage is ready, especially on app restarts
    const timer = setTimeout(() => {
      checkAuthState();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const checkAuthState = async () => {
    try {
      // Wait for token to be loaded from storage
      const isAuth = await apiService.isAuthenticatedAsync();
      if (isAuth) {
        try {
          const userData = await apiService.getProfile();
          setUser(userData);
        } catch (profileError) {
          safeConsole.error('Failed to get profile:', profileError);
          // Profile fetch failed, clear token
          await apiService.logout();
        }
      }
    } catch (error) {
      safeConsole.error('Auth check failed:', error);
      // Token might be expired, clear it
      try {
        await apiService.logout();
      } catch (logoutError) {
        safeConsole.error('Logout during auth check failed:', logoutError);
        // Ignore logout errors
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
        if (__DEV__) safeConsole.log('🔄 Triggering game data sync after login');
        try {
          await onSyncGameData();
        } catch (syncError) {
          safeConsole.error('Game data sync failed after login:', syncError);
          // Don't throw - login was successful even if sync failed
        }
      }
    } catch (error) {
      safeConsole.error('Login failed:', error);
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
        if (__DEV__) safeConsole.log('🔄 Triggering game data sync after registration');
        try {
          await onSyncGameData();
        } catch (syncError) {
          safeConsole.error('Game data sync failed after registration:', syncError);
          // Don't throw - registration was successful even if sync failed
        }
      }
    } catch (error) {
      safeConsole.error('Registration failed:', error);
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
      safeConsole.error('Logout failed:', error);
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
      safeConsole.error('User update failed:', error);
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
