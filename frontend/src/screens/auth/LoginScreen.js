import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const LoginScreen = ({ navigation }) => {
  return (
    <View className="flex-1 items-center justify-center bg-white p-4">
      <Text className="text-3xl font-bold text-blue-600 mb-8">Xpenso</Text>
      <Text className="text-xl mb-4">Welcome Back</Text>
      <TouchableOpacity 
        className="bg-blue-600 p-4 rounded-xl w-full items-center"
        onPress={() => navigation.navigate('Register')}
      >
        <Text className="text-white font-semibold">Go to Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
