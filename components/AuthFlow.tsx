import React, { useState } from 'react';
import { Modal } from 'react-native';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';

interface AuthFlowProps {
  visible: boolean;
  onClose: () => void;
  initialScreen?: 'login' | 'register';
}

const AuthFlow: React.FC<AuthFlowProps> = ({ 
  visible, 
  onClose, 
  initialScreen = 'login' 
}) => {
  const [currentScreen, setCurrentScreen] = useState<'login' | 'register'>(initialScreen);

  const handleSwitchToRegister = () => {
    setCurrentScreen('register');
  };

  const handleSwitchToLogin = () => {
    setCurrentScreen('login');
  };

  const handleClose = () => {
    setCurrentScreen('login'); // Reset to login for next time
    onClose();
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
        />
      ) : (
        <RegisterScreen
          onSwitchToLogin={handleSwitchToLogin}
          onClose={handleClose}
        />
      )}
    </Modal>
  );
};

export default AuthFlow;
