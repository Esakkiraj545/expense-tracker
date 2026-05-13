import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import { useSelector } from 'react-redux';
// import MainNavigator from './MainNavigator'; // To be created later

const AppNavigator = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <NavigationContainer>
      {/* Logic to switch between Auth and Main Navigators */}
      {isAuthenticated ? (
        <AuthNavigator /> // Placeholder: Replace with MainNavigator when ready
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
