import React, { useState, useEffect } from 'react';
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

interface RegisterScreenProps {
  onSwitchToLogin: () => void;
  onClose: () => void;
  isFirstTime?: boolean;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ onSwitchToLogin, onClose, isFirstTime = false }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
    first_name: '',
    last_name: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register, isAuthenticated } = useAuth();

  // Clear form when component unmounts
  useEffect(() => {
    return () => {
      setFormData({
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        first_name: '',
        last_name: '',
      });
    };
  }, []);

  // Auto-close if user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      onClose();
    }
  }, [isAuthenticated, isLoading, onClose]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { username, email, password, password_confirmation, first_name, last_name } = formData;
    
    if (!username.trim() || !email.trim() || !password.trim() || !first_name.trim() || !last_name.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }

    if (username.length < 3) {
      Alert.alert('Error', 'Username must be at least 3 characters long');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return false;
    }

    if (password !== password_confirmation) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    // Prevent double registration if already authenticated
    if (isAuthenticated) {
      onClose();
      return;
    }

    setIsLoading(true);
    try {
      const registerData = {
        ...formData,
        email: formData.email.trim().toLowerCase(),
        username: formData.username.trim(),
      };
      
      await register(registerData);
      // Don't call onClose here - let the useEffect handle it when isAuthenticated changes
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>{isFirstTime ? 'Welcome to Snake Game!' : 'Join the Game!'}</Text>
          <Text style={styles.subtitle}>
            {isFirstTime 
              ? 'Create your account to start playing and competing'
              : 'Create your account to compete'
            }
          </Text>

          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                placeholderTextColor="#666"
                value={formData.first_name}
                onChangeText={(value) => handleInputChange('first_name', value)}
                autoCapitalize="words"
              />
            </View>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                placeholderTextColor="#666"
                value={formData.last_name}
                onChangeText={(value) => handleInputChange('last_name', value)}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#666"
              value={formData.username}
              onChangeText={(value) => handleInputChange('username', value)}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#666"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password (min 8 characters)"
              placeholderTextColor="#666"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#666"
              value={formData.password_confirmation}
              onChangeText={(value) => handleInputChange('password_confirmation', value)}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, styles.registerButton]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>Already have an account? </Text>
            <TouchableOpacity onPress={onSwitchToLogin}>
              <Text style={styles.linkText}>Sign In</Text>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    marginBottom: 20,
  },
  halfWidth: {
    width: '48%',
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
  registerButton: {
    backgroundColor: '#2196F3',
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
    color: '#2196F3',
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

export default RegisterScreen;
