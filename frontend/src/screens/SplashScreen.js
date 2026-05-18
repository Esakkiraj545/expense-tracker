import React, { useEffect } from 'react';
import { View, Text, Image, ActivityIndicator, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(() => {
      if (isMounted && onFinish) {
        onFinish();
      }
    }, 3000);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [onFinish]);

  return (
    <View style={{ flex: 1, width: width, height: height }}>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <LinearGradient
        colors={['#2E3A9D', '#1B2474', '#0F1545']}
        style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 80 }}
      >
        <View />

        <View style={{ alignItems: 'center' }}>
          <View className="bg-white/10 p-6 rounded-[40px] shadow-2xl mb-6">
            <Image
              source={require('../../assets/logo.png')}
              style={{ width: width * 0.4, height: width * 0.4 }}
              resizeMode="contain"
              className="rounded-3xl"
            />
          </View>
          
          <Text className="text-white text-4xl font-bold tracking-wider mb-2">
            Xpenso
          </Text>
          
          <Text className="text-blue-200 text-base font-medium text-center px-10">
            Smart Expense & Debt Tracker
          </Text>
        </View>

        <View style={{ alignItems: 'center', width: '100%' }}>
          <ActivityIndicator size="large" color="#ffffff" style={{ marginBottom: 32 }} />
          
          <Text className="text-blue-300 text-[10px] tracking-[4px] font-semibold uppercase">
            Secured by Xpenso
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
};


export default SplashScreen;
