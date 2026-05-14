import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const LoginScreen = ({ navigation }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/auth/login`, {
        email,
        password
      });
      
      if (response.data.success) {
        // Save token to SecureStore
        await SecureStore.setItemAsync('userToken', response.data.token);
        navigation.replace('Main');
      }


    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong';
      Alert.alert('Login Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-[#F8F9FF]"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 px-6 pt-20 pb-10 items-center">
          {/* Logo Section */}
          <Image 
            source={require('../../assets/logo.png')} 
            style={{ width: 60, height: 60 }} 
            resizeMode="contain" 
          />
          <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-4xl mt-4">
            Xpenso
          </Text>
          <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-[#444B59] text-sm mt-1">
            Master your financial momentum
          </Text>

          {/* Login/Signup Tabs */}
          <View className="flex-row bg-[#F0F2FA] p-1.5 rounded-2xl mt-10 w-full">
            <TouchableOpacity className="flex-1 bg-white py-3 rounded-xl items-center shadow-sm">
              <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-[#2E3A9D] text-lg">Login</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => navigation.navigate('SignUp')}
              className="flex-1 py-3 items-center"
            >
              <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-[#444B59] text-lg">Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Form Container */}
          <View className="w-full bg-white rounded-[32px] p-6 mt-6 shadow-sm border border-[#E0E4F5]">
            {/* Email Field */}
            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-[10px] tracking-[1px] uppercase mb-2">
              Email Address
            </Text>
            <View className="flex-row items-center border border-[#E0E4F5] rounded-2xl px-4 py-3 mb-6 bg-[#FBFBFF]">
              <Mail size={20} color="#8A94A6" />
              <TextInput
                placeholder="name@example.com"
                placeholderTextColor="#A0ABC0"
                className="flex-1 ml-3 text-[#2E3A9D]"
                style={{ fontFamily: 'Poppins-Regular' }}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password Field */}
            <View className="flex-row justify-between items-center mb-2">
              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-[10px] tracking-[1px] uppercase">
                Password
              </Text>
              <TouchableOpacity>
                <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-[#2E3A9D] text-xs">Forgot Password?</Text>
              </TouchableOpacity>
            </View>
            <View className="flex-row items-center border border-[#E0E4F5] rounded-2xl px-4 py-3 mb-8 bg-[#FBFBFF]">
              <Lock size={20} color="#8A94A6" />
              <TextInput
                placeholder="••••••••"
                placeholderTextColor="#A0ABC0"
                className="flex-1 ml-3 text-[#2E3A9D]"
                style={{ fontFamily: 'Poppins-Regular' }}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} color="#8A94A6" /> : <Eye size={20} color="#8A94A6" />}
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity 
              onPress={handleLogin}
              disabled={loading}
              className="bg-[#2E3A9D] py-4 rounded-3xl items-center shadow-lg shadow-blue-500/50"
            >
              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-lg">
                {loading ? 'Logging in...' : 'Login'}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center my-8">
              <View className="flex-1 h-[1px] bg-[#E0E4F5]" />
              <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="mx-4 text-[#8A94A6] text-xs">OR</Text>
              <View className="flex-1 h-[1px] bg-[#E0E4F5]" />
            </View>

            {/* Social Buttons */}
            <View className="flex-row space-x-4">
              <TouchableOpacity 
                onPress={() => Alert.alert('Google Login', 'Google Sign-In will be implemented after configuring Firebase/Google Console.')}
                className="flex-1 flex-row items-center justify-center border border-[#E0E4F5] py-3 rounded-2xl bg-white mr-2"
              >
                <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png' }} style={{ width: 20, height: 20 }} />
                <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="ml-2 text-[#444B59]">Google</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => {
                  if(!email) {
                    Alert.alert('Error', 'Please enter email to receive OTP');
                    return;
                  }
                  navigation.navigate('OTPScreen', { email });
                }}
                className="flex-1 flex-row items-center justify-center border border-[#E0E4F5] py-3 rounded-2xl bg-white ml-2"
              >
                <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-[#444B59]">OTP</Text>
              </TouchableOpacity>
            </View>

          </View>

          {/* Footer Text */}
          <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-[#8A94A6] text-[10px] text-center mt-8 px-10">
            By continuing, you agree to WealthFlow's{' '}
            <Text className="text-[#2E3A9D] font-bold">Terms of Service</Text> and{' '}
            <Text className="text-[#2E3A9D] font-bold">Privacy Policy</Text>.
          </Text>

          <TouchableOpacity className="mt-10 flex-row items-center">
            <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-[#444B59] text-xs">Need help accessing your account?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
