import React, { useState, useEffect } from 'react';
import { Modal } from 'react-native';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';

interface AuthFlowProps {
  visible: boolean;
  onClose: () => void;
  initialScreen?: 'login' | 'register';
  isFirstTime?: boolean;
}

const AuthFlow: React.FC<AuthFlowProps> = ({ 
  visible, 
  onClose, 
  initialScreen = 'login',
  isFirstTime = false
}) => {
  // For first-time users, start with register screen
  const [currentScreen, setCurrentScreen] = useState<'login' | 'register'>(
    isFirstTime ? 'register' : initialScreen
  );
  const [wasVisible, setWasVisible] = useState(false);

  // Reset screen when modal opens or when props change
  useEffect(() => {
    if (visible) {
      // Modal is visible
      if (!wasVisible) {
        // Modal just opened - set the screen based on props
        setCurrentScreen(isFirstTime ? 'register' : initialScreen);
        setWasVisible(true);
      }
      // If modal was already visible, don't reset (user might have switched screens manually)
    } else {
      // Modal closed
      setWasVisible(false);
    }
  }, [visible, isFirstTime, initialScreen, wasVisible]);

  const handleSwitchToRegister = () => {
    setCurrentScreen('register');
  };

  const handleSwitchToLogin = () => {
    setCurrentScreen('login');
  };

  const handleClose = () => {
    onClose();
    // Screen will reset when modal reopens via useEffect
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      {currentScreen === 'login' ? (
        <LoginScreen
          onSwitchToRegister={handleSwitchToRegister}
          onClose={handleClose}
          isFirstTime={isFirstTime}
        />
      ) : (
        <RegisterScreen
          onSwitchToLogin={handleSwitchToLogin}
          onClose={handleClose}
          isFirstTime={isFirstTime}
        />
      )}
    </Modal>
  );
};

export default AuthFlow;
