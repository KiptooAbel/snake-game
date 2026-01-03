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
  const [prevVisible, setPrevVisible] = useState(visible);

  // Reset screen only when modal transitions from closed to open
  useEffect(() => {
    if (visible && !prevVisible) {
      // Modal is opening - set the appropriate screen
      setCurrentScreen(isFirstTime ? 'register' : initialScreen);
    }
    setPrevVisible(visible);
  }, [visible, isFirstTime, initialScreen]);

  const handleSwitchToRegister = () => {
    setCurrentScreen('register');
  };

  const handleSwitchToLogin = () => {
    setCurrentScreen('login');
  };

  const handleClose = () => {
    onClose();
    // Reset screen state after modal closes to avoid flickering during close animation
    setTimeout(() => {
      setCurrentScreen(isFirstTime ? 'register' : initialScreen);
    }, 300);
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
