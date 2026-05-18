import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { User, Mail, Lock, Eye, EyeOff, RotateCcw } from 'lucide-react-native';
import axios from 'axios';

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/auth/register`, {
        name,
        email,
        password
      });

      if (response.data.success) {
        Alert.alert('Success', 'Registration successful! Please login.', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      Alert.alert('Error', message);
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
        <View className="flex-1 px-6 pt-10 pb-10">
          <View className="flex-row items-center mb-8">
            <Image 
              source={require('../../assets/logo.png')} 
              className="w-10 h-10 rounded-2xl mr-3" 
              resizeMode="contain" 
            />
            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-2xl">Xpenso</Text>
          </View>
          
          <View className="items-center mb-8">
            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-2xl">Create Account</Text>
            <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-[#444B59] text-sm mt-1">
              Start your journey to financial freedom today.
            </Text>
          </View>

          {/* Form Container */}
          <View className="w-full bg-white rounded-[32px] p-6 shadow-sm border border-[#E0E4F5]">
            {/* Full Name */}
            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-[10px] tracking-[1px] uppercase mb-2">
              Full Name
            </Text>
            <View className="flex-row items-center border border-[#E0E4F5] rounded-2xl px-4 py-3 mb-5 bg-[#FBFBFF]">
              <User size={20} color="#8A94A6" />
              <TextInput
                placeholder="John Doe"
                placeholderTextColor="#A0ABC0"
                className="flex-1 ml-3 text-[#2E3A9D]"
                style={{ fontFamily: 'Poppins-Regular' }}
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Email Field */}
            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-[10px] tracking-[1px] uppercase mb-2">
              Email Address
            </Text>
            <View className="flex-row items-center border border-[#E0E4F5] rounded-2xl px-4 py-3 mb-5 bg-[#FBFBFF]">
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
            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-[10px] tracking-[1px] uppercase mb-2">
              Password
            </Text>
            <View className="flex-row items-center border border-[#E0E4F5] rounded-2xl px-4 py-3 mb-5 bg-[#FBFBFF]">
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

            {/* Confirm Password Field */}
            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-[10px] tracking-[1px] uppercase mb-2">
              Confirm Password
            </Text>
            <View className="flex-row items-center border border-[#E0E4F5] rounded-2xl px-4 py-3 mb-8 bg-[#FBFBFF]">
              <RotateCcw size={20} color="#8A94A6" />
              <TextInput
                placeholder="••••••••"
                placeholderTextColor="#A0ABC0"
                className="flex-1 ml-3 text-[#2E3A9D]"
                style={{ fontFamily: 'Poppins-Regular' }}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
              />
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity 
              onPress={handleSignUp}
              disabled={loading}
              className="bg-[#2E3A9D] py-4 rounded-3xl items-center shadow-lg shadow-blue-500/50"
            >
              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-lg">
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center mt-10">
            <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-[#444B59]">Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-[#2E3A9D]">Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;
