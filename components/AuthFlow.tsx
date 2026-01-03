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

  // Reset screen when modal opens (visible changes from false to true)
  useEffect(() => {
    if (visible) {
      // Modal is opening - set the appropriate screen based on current props
      setCurrentScreen(isFirstTime ? 'register' : initialScreen);
    }
  }, [visible]); // Only depend on visible to avoid stale closure issues

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
