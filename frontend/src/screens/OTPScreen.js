import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { ChevronLeft, ArrowRight, RefreshCcw } from 'lucide-react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const OTPScreen = ({ route, navigation }) => {
  const { email } = route.params || { email: 'user@example.com' };
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const inputs = useRef([]);

  useEffect(() => {
    let interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const fullOtp = otp.join('');
    if (fullOtp.length < 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/auth/otp-verify`, {
        email,
        otp: fullOtp
      });

      if (response.data.success) {
        await SecureStore.setItemAsync('userToken', response.data.token);
        navigation.replace('Main');
      }
    } catch (error) {
      Alert.alert('Verification Failed', error.response?.data?.message || 'Invalid OTP');
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setTimer(30);
    try {
      await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/auth/otp-send`, { email });
      Alert.alert('Success', 'OTP Resent successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to resend OTP');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-[#F8F9FF]"
    >
      <View className="px-6 pt-14 pb-4 bg-white flex-row items-center border-b border-[#F0F2FA]">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
          <ChevronLeft size={24} color="#2E3A9D" />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-lg ml-2">OTP Verification</Text>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-6">
        <View className="items-center mt-10">
          <View className="bg-white p-6 rounded-[40px] shadow-2xl shadow-blue-900/10 border border-[#F0F2FA] mb-8">
             <RefreshCcw size={40} color="#2E3A9D" />
          </View>
          
          <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-2xl mb-2 text-center">Enter 6-Digit Code</Text>
          <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-[#8A94A6] text-sm text-center mb-10 px-10">
            We've sent a verification code to your email{'\n'}
            <Text className="text-[#2E3A9D] font-bold">{email}</Text>
          </Text>

          {/* OTP Inputs */}
          <View className="flex-row justify-between w-full mb-10">
            {otp.map((digit, i) => (
              <View key={i} className="w-12 h-14 bg-white border border-[#E0E4F5] rounded-2xl shadow-sm">
                <TextInput
                  ref={(ref) => (inputs.current[i] = ref)}
                  className="w-full h-full text-center text-[#2E3A9D] text-xl"
                  style={{ fontFamily: 'Poppins-Bold' }}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => handleChange(text, i)}
                  onKeyPress={(e) => handleKeyPress(e, i)}
                />
              </View>
            ))}
          </View>

          {/* Resend Timer */}
          <TouchableOpacity 
            onPress={handleResend}
            disabled={timer > 0}
            className="mb-10"
          >
            <Text style={{ fontFamily: 'Poppins-SemiBold' }} className={`text-sm ${timer > 0 ? 'text-[#8A94A6]' : 'text-[#2E3A9D]'}`}>
              {timer > 0 ? `Resend code in ${timer}s` : "Didn't receive code? Resend"}
            </Text>
          </TouchableOpacity>

          {/* Verify Button */}
          <TouchableOpacity 
            onPress={handleVerify}
            className="bg-[#2E3A9D] w-full py-5 rounded-[24px] flex-row items-center justify-center shadow-xl shadow-blue-500/50"
          >
            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-lg mr-2">Verify & Continue</Text>
            <ArrowRight size={20} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default OTPScreen;
