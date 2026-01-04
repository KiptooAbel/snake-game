import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';

interface LoginScreenProps {
  onSwitchToRegister: () => void;
  onClose: () => void;
  isFirstTime?: boolean;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onSwitchToRegister, onClose, isFirstTime = false }) => {
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const loginSuccessRef = useRef(false);

  // Clear form when modal is closed (when component unmounts)
  useEffect(() => {
    return () => {
      // Cleanup: clear form fields when component unmounts
      setLoginIdentifier('');
      setPassword('');
      loginSuccessRef.current = false;
    };
  }, []);

  const handleLogin = async () => {
    if (!loginIdentifier.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Prevent multiple submissions while loading
    if (isLoading || loginSuccessRef.current) {
      return;
    }

    setIsLoading(true);
    try {
      await login(loginIdentifier.trim().toLowerCase(), password);
      loginSuccessRef.current = true;
      // Don't call onClose - let parent's useEffect handle it when isAuthenticated changes
      // This ensures state has propagated before modal closes
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>{isFirstTime ? 'Welcome to Snake Game!' : 'Welcome Back!'}</Text>
          <Text style={styles.subtitle}>
            {isFirstTime 
              ? 'Sign in to start playing and track your scores'
              : 'Sign in to track your high scores'
            }
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email or Username"
              placeholderTextColor="#666"
              value={loginIdentifier}
              onChangeText={setLoginIdentifier}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, styles.loginButton]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>Don't have an account? </Text>
            <TouchableOpacity onPress={onSwitchToRegister}>
              <Text style={styles.linkText}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.skipButton} onPress={onClose}>
            <Text style={styles.skipText}>
              {isFirstTime ? 'Play as Guest' : 'Skip for now'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    backgroundColor: 'rgba(17, 17, 17, 0.95)',
    borderRadius: 15,
    padding: 25,
    marginHorizontal: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#333',
  },
  button: {
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  switchText: {
    color: '#ccc',
    fontSize: 16,
  },
  linkText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  skipButton: {
    alignItems: 'center',
  },
  skipText: {
    color: '#888',
    fontSize: 16,
  },
});

export default LoginScreen;
