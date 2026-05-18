import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Image, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { ChevronLeft, Camera, User, Mail, Phone, Calendar, FileText } from 'lucide-react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';

const EditProfileScreen = ({ navigation, route }) => {
  const { user } = route.params || {};

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [dob, setDob] = useState(user?.dob || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [saving, setSaving] = useState(false);

  const handleChoosePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need storage permission to upload your profile picture.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true
      });

      if (!result.canceled && result.assets && result.assets[0].base64) {
        setProfileImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
      }
    } catch (error) {
      console.log('Error choosing image:', error);
      Alert.alert('Error', 'Failed to pick image.');
    }
  };

  const handleSave = async () => {
    if (!name || !email) {
      Alert.alert('Error', 'Name and Email are required.');
      return;
    }

    setSaving(true);
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const response = await axios.put(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/updatedetails`,
        { name, email, phone, dob, bio, profileImage },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        Alert.alert('Success', 'Profile updated successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      console.log('Error updating profile:', error);
      const message = error.response?.data?.message || 'Something went wrong';
      Alert.alert('Update Failed', message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-[#F8F9FF]"
    >
      {/* Header */}
      <View className="px-6 pt-14 pb-4 bg-white flex-row items-center border-b border-[#F0F2FA]">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
          <ChevronLeft size={24} color="#2E3A9D" />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-lg ml-2">Edit Profile</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6 items-center">
          {/* Avatar Section */}
          <View className="relative mb-10">
             <View className="w-32 h-32 rounded-full bg-[#E0E4F5] border-4 border-white shadow-xl items-center justify-center overflow-hidden">
                {profileImage ? (
                   <Image source={{ uri: profileImage }} className="w-full h-full" resizeMode="cover" />
                ) : (
                   <User size={64} color="#2E3A9D" />
                )}
             </View>
             <TouchableOpacity 
               onPress={handleChoosePhoto}
               className="absolute bottom-1 right-1 bg-[#2E3A9D] w-10 h-10 rounded-full border-4 border-white items-center justify-center shadow-md"
             >
                <Camera size={16} color="white" />
             </TouchableOpacity>
             <TouchableOpacity onPress={handleChoosePhoto} className="mt-4">
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-xs uppercase tracking-[1px] text-center">Change Photo</Text>
             </TouchableOpacity>
          </View>

          {/* Form */}
          <View className="w-full space-y-6">
             <View>
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px] mb-2 ml-1">Full Name</Text>
                <View className="bg-white border border-[#E0E4F5] rounded-2xl px-4 py-4 shadow-sm">
                   <TextInput 
                     value={name} 
                     onChangeText={setName} 
                     className="text-[#1A1A1A] text-sm" 
                     style={{ fontFamily: 'Poppins-SemiBold' }} 
                   />
                </View>
             </View>

             <View>
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px] mb-2 ml-1">Email Address</Text>
                <View className="bg-white border border-[#E0E4F5] rounded-2xl px-4 py-4 shadow-sm">
                   <TextInput 
                     value={email} 
                     onChangeText={setEmail} 
                     keyboardType="email-address"
                     autoCapitalize="none"
                     className="text-[#1A1A1A] text-sm" 
                     style={{ fontFamily: 'Poppins-SemiBold' }} 
                   />
                </View>
             </View>

             <View>
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px] mb-2 ml-1">Phone Number</Text>
                <View className="bg-white border border-[#E0E4F5] rounded-2xl px-4 py-4 shadow-sm">
                   <TextInput 
                     value={phone} 
                     onChangeText={setPhone} 
                     keyboardType="phone-pad"
                     className="text-[#1A1A1A] text-sm" 
                     style={{ fontFamily: 'Poppins-SemiBold' }} 
                   />
                </View>
             </View>

             <View>
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px] mb-2 ml-1">Date of Birth</Text>
                <View className="bg-white border border-[#E0E4F5] rounded-2xl px-4 py-4 shadow-sm flex-row justify-between items-center">
                   <TextInput 
                     value={dob} 
                     onChangeText={setDob} 
                     className="text-[#1A1A1A] text-sm flex-1" 
                     style={{ fontFamily: 'Poppins-SemiBold' }} 
                   />
                   <Calendar size={18} color="#8A94A6" />
                </View>
             </View>

             <View>
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px] mb-2 ml-1">Bio</Text>
                <View className="bg-white border border-[#E0E4F5] rounded-2xl px-4 py-4 shadow-sm h-32">
                   <TextInput 
                     value={bio} 
                     onChangeText={setBio} 
                     multiline 
                     className="text-[#1A1A1A] text-xs leading-5" 
                     style={{ fontFamily: 'Poppins-Regular' }} 
                     textAlignVertical="top"
                   />
                </View>
             </View>

             {/* Save Button */}
             <TouchableOpacity 
               onPress={handleSave}
               disabled={saving}
               className="bg-[#2E3A9D] py-5 rounded-[24px] items-center justify-center shadow-lg shadow-blue-500/50 mt-10 mb-20 flex-row"
             >
                {saving && <ActivityIndicator color="white" style={{ marginRight: 8 }} />}
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-lg uppercase tracking-[1px]">
                  {saving ? 'Saving...' : 'Save Changes'}
                </Text>
             </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditProfileScreen;
