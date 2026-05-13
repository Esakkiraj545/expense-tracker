import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const RegisterScreen = ({ navigation }) => {
  return (
    <View className="flex-1 items-center justify-center bg-white p-4">
      <Text className="text-3xl font-bold text-blue-600 mb-8">Xpenso</Text>
      <Text className="text-xl mb-4">Create Account</Text>
      <TouchableOpacity 
        className="bg-gray-200 p-4 rounded-xl w-full items-center"
        onPress={() => navigation.goBack()}
      >
        <Text className="text-blue-600 font-semibold">Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;
