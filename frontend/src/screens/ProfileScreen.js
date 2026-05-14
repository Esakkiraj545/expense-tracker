import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Bell, User, ChevronRight, Settings, CreditCard, Shield, HelpCircle, LogOut, Plane, Wallet, Info } from 'lucide-react-native';
import * as SecureStore from 'expo-secure-store';

const ProfileScreen = ({ navigation }) => {
  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('userToken');
    navigation.replace('Login');
  };

  const menuItems = [
    { icon: Info, label: 'Personal Information', color: '#2E3A9D', bg: '#E8EBF8', action: () => navigation.navigate('EditProfile') },
    { icon: CreditCard, label: 'Payment Methods', color: '#FF9900', bg: '#FFF5E6' },
    { icon: Bell, label: 'Notifications', color: '#4CAF50', bg: '#E8F5E9' },
    { icon: Shield, label: 'Security', color: '#00A3FF', bg: '#E6F7FF' },
    { icon: HelpCircle, label: 'Help & Support', color: '#8A94A6', bg: '#F0F2FA' },
  ];

  return (
    <View className="flex-1 bg-[#F8F9FF]">
      {/* Header */}
      <View className="px-6 pt-14 pb-4 bg-white flex-row justify-between items-center">
        <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-2xl">WealthFlow</Text>
        <TouchableOpacity>
          <Bell size={24} color="#2E3A9D" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6">
          {/* Profile Card */}
          <View className="bg-white rounded-[40px] p-8 items-center shadow-sm border border-[#F0F2FA] mb-8">
             <View className="w-24 h-24 rounded-full bg-[#E0E4F5] items-center justify-center mb-4 border-4 border-white shadow-md">
                <User size={48} color="#2E3A9D" />
             </View>
             <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-2xl">Alex Johnson</Text>
             <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-[#8A94A6] text-xs mb-6">alex.johnson@wealthflow.com</Text>
             
             <TouchableOpacity 
               onPress={() => navigation.navigate('EditProfile')}
               className="bg-[#2E3A9D] px-8 py-3 rounded-2xl shadow-lg shadow-blue-500/30"
             >
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-xs uppercase tracking-[1px]">Edit Profile</Text>
             </TouchableOpacity>
          </View>

          {/* Stats Row */}
          <View className="flex-row justify-between mb-8">
             {[
               { icon: Plane, label: 'Trips', val: '12', color: '#2E3A9D' },
               { icon: Wallet, label: 'Savings', val: '₹45k', color: '#4CAF50' },
               { icon: CreditCard, label: 'Debts', val: '₹12k', color: '#FF5252' },
             ].map((stat, i) => (
               <View key={i} className="bg-white rounded-3xl p-4 w-[31%] items-center border border-[#F0F2FA] shadow-sm">
                  <View style={{ backgroundColor: stat.color + '15' }} className="p-2 rounded-xl mb-2">
                     <stat.icon size={18} color={stat.color} />
                  </View>
                  <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-sm">{stat.val}</Text>
                  <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-[#8A94A6] text-[8px] uppercase tracking-[0.5px]">{stat.label}</Text>
               </View>
             ))}
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
               className="flex-row items-center p-4 mt-2"
             >
                <View className="bg-[#FFE5E5] p-2.5 rounded-2xl mr-4">
                   <LogOut size={20} color="#FF5252" />
                </View>
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="flex-1 text-[#FF5252] text-sm">Logout Account</Text>
                <ChevronRight size={18} color="#FF5252" />
             </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
