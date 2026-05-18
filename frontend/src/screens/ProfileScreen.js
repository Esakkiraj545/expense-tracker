import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert, Modal } from 'react-native';
import { Bell, User, ChevronRight, Settings, CreditCard, Shield, HelpCircle, LogOut, Info, Trash2 } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const fetchProfile = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) {
        navigation.replace('Login');
        return;
      }
      
      const [profileRes, notificationsRes] = await Promise.all([
        axios.get(`${process.env.EXPO_PUBLIC_API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${process.env.EXPO_PUBLIC_API_URL}/notifications`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (profileRes.data.success) {
        setUser(profileRes.data.data);
      }

      if (notificationsRes.data.success) {
        const count = notificationsRes.data.data.filter(n => !n.isRead).length;
        setUnreadCount(count);
      }
    } catch (error) {
      console.log('Error fetching profile:', error);
      if (error.response?.status === 401) {
        await SecureStore.deleteItemAsync('userToken');
        navigation.replace('Login');
      }
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const performLogout = async () => {
    setLogoutModalVisible(false);
    await SecureStore.deleteItemAsync('userToken');
    navigation.replace('Login');
  };

  const handleDeleteAccount = () => {
    setDeleteModalVisible(true);
  };

  const performDeleteAccount = async () => {
    setDeleteModalVisible(false);
    setDeleting(true);
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const response = await axios.delete(`${process.env.EXPO_PUBLIC_API_URL}/auth/deleteme`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        await SecureStore.deleteItemAsync('userToken');
        Alert.alert('Success', 'Your account has been deleted successfully.', [
          { text: 'OK', onPress: () => navigation.replace('Login') }
        ]);
      }
    } catch (error) {
      console.log('Error deleting account:', error);
      Alert.alert('Error', 'Failed to delete account. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const menuItems = [
    { icon: Info, label: 'Personal Information', color: '#2E3A9D', bg: '#E8EBF8', action: () => navigation.navigate('PersonalInformation', { user }) },
    { icon: Bell, label: 'Notifications', color: '#4CAF50', bg: '#E8F5E9', action: () => navigation.navigate('Notifications') },
    { icon: Shield, label: 'Security', color: '#00A3FF', bg: '#E6F7FF' },
    { icon: HelpCircle, label: 'Help & Support', color: '#8A94A6', bg: '#F0F2FA' },
  ];

  return (
    <View className="flex-1 bg-[#F8F9FF]">
      {/* Header */}
      <View className="px-6 pt-14 pb-4 bg-white flex-row justify-between items-center border-b border-[#F0F2FA]">
        <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-2xl">Xpenso</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Notifications')}
          className="relative p-2"
        >
          <Bell size={24} color="#2E3A9D" />
          {unreadCount > 0 && (
            <View className="absolute top-1.5 right-1.5 bg-[#FF5252] w-5 h-5 rounded-full items-center justify-center border-2 border-white">
              <Text className="text-white text-[8px]" style={{ fontFamily: 'Poppins-Bold' }}>
                {unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6">
          {/* Profile Card */}
          <View className="bg-white rounded-[40px] p-8 items-center shadow-sm border border-[#F0F2FA] mb-8">
             <View className="w-24 h-24 rounded-full bg-[#E0E4F5] items-center justify-center mb-4 border-4 border-white shadow-md overflow-hidden">
                {user?.profileImage ? (
                   <Image source={{ uri: user.profileImage }} className="w-full h-full" resizeMode="cover" />
                ) : (
                   <User size={48} color="#2E3A9D" />
                )}
             </View>
             {loading ? (
                <ActivityIndicator size="small" color="#2E3A9D" style={{ marginBottom: 16 }} />
             ) : (
                <>
                  <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-2xl">{user?.name || 'No Name'}</Text>
                  <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-[#8A94A6] text-xs">{user?.email || 'No Email'}</Text>
                  
                  {/* Verified Badge */}
                  <View className="flex-row items-center mt-2 mb-6 bg-[#E8F5E9] px-3 py-1 rounded-full border border-[#C8E6C9]">
                     <View className="w-1.5 h-1.5 rounded-full bg-[#4CAF50] mr-1.5" />
                     <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#388E3C] text-[9px] uppercase tracking-[0.5px]">Verified Account</Text>
                  </View>
                </>
             )}
             
             <TouchableOpacity 
               onPress={() => navigation.navigate('EditProfile', { user })}
               className="bg-[#2E3A9D] px-8 py-3 rounded-2xl shadow-lg shadow-blue-500/30"
             >
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-xs uppercase tracking-[1px]">Edit Profile</Text>
             </TouchableOpacity>
          </View>

          {/* Menu */}
          <View className="bg-white rounded-[32px] p-4 mb-32 border border-[#F0F2FA] shadow-sm">
             {menuItems.map((item, i) => (
               <TouchableOpacity 
                 key={i} 
                 onPress={item.action}
                 className={`flex-row items-center p-4 ${i !== menuItems.length - 1 ? 'border-b border-[#F8F9FF]' : ''}`}
               >
                  <View style={{ backgroundColor: item.bg }} className="p-2.5 rounded-2xl mr-4">
                     <item.icon size={20} color={item.color} />
                  </View>
                  <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="flex-1 text-[#444B59] text-sm">{item.label}</Text>
                  <ChevronRight size={18} color="#8A94A6" />
               </TouchableOpacity>
             ))}
             
             <TouchableOpacity 
               onPress={handleLogout}
               className="flex-row items-center p-4 mt-2 border-b border-[#F8F9FF] pb-4"
             >
                <View className="bg-[#FFE5E5] p-2.5 rounded-2xl mr-4">
                   <LogOut size={20} color="#FF5252" />
                </View>
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="flex-1 text-[#FF5252] text-sm">Logout Account</Text>
                <ChevronRight size={18} color="#FF5252" />
             </TouchableOpacity>

             {/* Delete Account Button */}
             <TouchableOpacity 
               onPress={handleDeleteAccount}
               disabled={deleting}
               className="flex-row items-center p-4 mt-2"
             >
                <View className="bg-red-50 p-2.5 rounded-2xl mr-4">
                   {deleting ? (
                      <ActivityIndicator size="small" color="#FF5252" />
                   ) : (
                      <Trash2 size={20} color="#FF5252" />
                   )}
                </View>
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="flex-1 text-[#FF5252] text-sm">Delete Account</Text>
                <ChevronRight size={18} color="#FF5252" />
             </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Reusable Custom Premium Logout Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={logoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
          <View className="bg-white w-full rounded-[32px] p-6 items-center shadow-2xl border border-[#F0F2FA]">
            {/* Header Icon */}
            <View className="bg-[#FFE5E5] p-5 rounded-full mb-6">
              <LogOut size={36} color="#FF5252" />
            </View>
            
            {/* Text details */}
            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-xl text-center mb-2">
              Logout Account
            </Text>
            <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-[#8A94A6] text-xs text-center leading-5 mb-8">
              Are you sure you want to log out of your WealthFlow account? You will need to sign in again to access your data.
            </Text>
            
            {/* Button Actions */}
            <View className="flex-row w-full justify-between">
              <TouchableOpacity 
                onPress={() => setLogoutModalVisible(false)}
                style={{ width: '48%' }}
                className="py-4 border border-[#E0E4F5] rounded-2xl items-center bg-[#FBFBFF]"
              >
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-xs uppercase tracking-[0.5px]">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={performLogout}
                style={{ width: '48%' }}
                className="py-4 bg-[#FF5252] rounded-2xl items-center shadow-md shadow-red-500/20"
              >
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-xs uppercase tracking-[0.5px]">
                  Yes, Logout
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Reusable Custom Premium Delete Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
          <View className="bg-white w-full rounded-[32px] p-6 items-center shadow-2xl border border-[#F0F2FA]">
            {/* Header Icon */}
            <View className="bg-red-50 p-5 rounded-full mb-6">
              <Trash2 size={36} color="#FF5252" />
            </View>
            
            {/* Text details */}
            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-xl text-center mb-2">
              Delete Account
            </Text>
            <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-[#8A94A6] text-xs text-center leading-5 mb-8">
              Are you absolutely sure? This will permanently delete your profile, expenses, and debts. This action is irreversible.
            </Text>
            
            {/* Button Actions */}
            <View className="flex-row w-full justify-between">
              <TouchableOpacity 
                onPress={() => setDeleteModalVisible(false)}
                style={{ width: '48%' }}
                className="py-4 border border-[#E0E4F5] rounded-2xl items-center bg-[#FBFBFF]"
              >
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-xs uppercase tracking-[0.5px]">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={performDeleteAccount}
                style={{ width: '48%' }}
                className="py-4 bg-[#FF5252] rounded-2xl items-center shadow-md shadow-red-500/20"
              >
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-xs uppercase tracking-[0.5px]">
                  Yes, Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileScreen;
