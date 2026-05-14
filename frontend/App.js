import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreenNative from 'expo-splash-screen';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import * as SecureStore from 'expo-secure-store';

import "./global.css";

import SplashScreen from './src/screens/SplashScreen';
import AppNavigator from './src/navigation/AppNavigator';

// Keep the splash screen visible while we fetch resources
SplashScreenNative.preventAutoHideAsync();

export default function App() {
  const [isShowSplash, setIsShowSplash] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Login');

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
  });

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
          setInitialRoute('Main');
        } else {
          const hasSeenOnboarding = await SecureStore.getItemAsync('hasSeenOnboarding');
          if (hasSeenOnboarding) {
            setInitialRoute('Login');
          } else {
            setInitialRoute('Onboarding');
          }
        }
      } catch (e) {
        console.log('Error checking login status:', e);
      }
    };
    checkLoginStatus();
  }, []);




  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreenNative.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      {isShowSplash ? (
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
          <SplashScreen onFinish={() => setIsShowSplash(false)} />
        </View>
      ) : (
        <>
          <AppNavigator initialRoute={initialRoute} />
          <StatusBar style="auto" />
        </>
      )}
    </NavigationContainer>
  );

}




