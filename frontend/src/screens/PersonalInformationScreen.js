import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { ChevronLeft, Edit3, User, Mail, Phone, Calendar, FileText } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const PersonalInformationScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (error) {
      console.log('Error fetching details:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  return (
    <View className="flex-1 bg-[#F8F9FF]">
      {/* Header */}
      <View className="px-6 pt-14 pb-4 bg-white flex-row justify-between items-center border-b border-[#F0F2FA]">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
            <ChevronLeft size={24} color="#2E3A9D" />
          </TouchableOpacity>
          <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-lg ml-2">Personal Information</Text>
        </View>
        <TouchableOpacity 
          onPress={() => navigation.navigate('EditProfile', { user })}
          className="p-2"
        >
          <Edit3 size={20} color="#2E3A9D" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {loading ? (
          <View className="flex-1 justify-center items-center mt-20">
            <ActivityIndicator size="large" color="#2E3A9D" />
          </View>
        ) : (
          <View className="p-6">
            {/* Avatar Section */}
            <View className="items-center mb-10 mt-4">
              <View className="w-32 h-32 rounded-full bg-[#E0E4F5] border-4 border-white shadow-xl items-center justify-center overflow-hidden">
                {user?.profileImage ? (
                  <Image source={{ uri: user.profileImage }} className="w-full h-full" resizeMode="cover" />
                ) : (
                  <User size={64} color="#2E3A9D" />
                )}
              </View>
            </View>

            {/* Read-Only Details Card */}
            <View className="bg-white rounded-[32px] p-6 border border-[#F0F2FA] shadow-sm space-y-6">
              
              {/* Name Field */}
              <View className="flex-row items-center">
                <View className="bg-[#E8EBF8] p-3 rounded-2xl mr-4">
                  <User size={20} color="#2E3A9D" />
                </View>
                <View className="flex-1">
                  <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px] mb-0.5">Full Name</Text>
                  <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-[#1A1A1A] text-sm">{user?.name || 'Not provided'}</Text>
                </View>
              </View>

              {/* Email Field */}
              <View className="flex-row items-center border-t border-[#F8F9FF] pt-4">
                <View className="bg-[#E8EBF8] p-3 rounded-2xl mr-4">
                  <Mail size={20} color="#2E3A9D" />
                </View>
                <View className="flex-1">
                  <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px] mb-0.5">Email Address</Text>
                  <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-[#1A1A1A] text-sm">{user?.email || 'Not provided'}</Text>
                </View>
              </View>

              {/* Phone Field */}
              <View className="flex-row items-center border-t border-[#F8F9FF] pt-4">
                <View className="bg-[#E8EBF8] p-3 rounded-2xl mr-4">
                  <Phone size={20} color="#2E3A9D" />
                </View>
                <View className="flex-1">
                  <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px] mb-0.5">Phone Number</Text>
                  <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-[#1A1A1A] text-sm">{user?.phone || 'Not provided'}</Text>
                </View>
              </View>

              {/* DOB Field */}
              <View className="flex-row items-center border-t border-[#F8F9FF] pt-4">
                <View className="bg-[#E8EBF8] p-3 rounded-2xl mr-4">
                  <Calendar size={20} color="#2E3A9D" />
                </View>
                <View className="flex-1">
                  <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px] mb-0.5">Date of Birth</Text>
                  <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-[#1A1A1A] text-sm">{user?.dob || 'Not provided'}</Text>
                </View>
              </View>

              {/* Bio Field */}
              <View className="flex-row items-start border-t border-[#F8F9FF] pt-4">
                <View className="bg-[#E8EBF8] p-3 rounded-2xl mr-4">
                  <FileText size={20} color="#2E3A9D" />
                </View>
                <View className="flex-1">
                  <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px] mb-0.5">Bio</Text>
                  <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-[#444B59] text-xs leading-5">{user?.bio || 'No bio added yet'}</Text>
                </View>
              </View>

            </View>

            {/* Edit Button */}
            <TouchableOpacity 
              onPress={() => navigation.navigate('EditProfile', { user })}
              className="bg-[#2E3A9D] py-5 rounded-[24px] items-center shadow-lg shadow-blue-500/50 mt-10 mb-20"
            >
              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-md uppercase tracking-[1px]">Edit Information</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default PersonalInformationScreen;
