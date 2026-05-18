import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, Image } from 'react-native';
import { Bell, Plus, User, ArrowUpRight, ArrowDownLeft } from 'lucide-react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect } from '@react-navigation/native';

const DebtsScreen = ({ navigation }) => {
  const [debts, setDebts] = useState([]);
  const [profileImage, setProfileImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [totals, setTotals] = useState({ pending: 0, given: 0 });
  const [activeTab, setActiveTab] = useState('All');

  const fetchDebts = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const [debtsRes, profileRes] = await Promise.all([
        axios.get(`${process.env.EXPO_PUBLIC_API_URL}/debts`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${process.env.EXPO_PUBLIC_API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => null)
      ]);

      if (debtsRes.data.success) {
        const data = debtsRes.data.data;
        setDebts(data);
        
        // Calculate totals
        let pending = 0;
        let given = 0;
        
        data.forEach(debt => {
          if (debt.status === 'Pending') {
            if (debt.type === 'Lent') {
              given += debt.amount;
              pending += debt.amount;
            } else {
              pending -= debt.amount; // If we borrowed, it's negative in our "given" perspective? 
              // Actually, let's keep it simple: 
              // Given = Total money we Lent
              // Pending = Net balance or just count all pending amounts?
              // The original UI showed "Total Pending" and "Total Given".
            }
          }
        });

        // Re-calculating based on original UI logic:
        // Total Pending might mean "Total I need to receive"
        // Total Given might mean "Total I have lent out"
        const totalLent = data.filter(d => d.type === 'Lent' && d.status === 'Pending').reduce((acc, curr) => acc + (curr.remainingAmount !== undefined ? curr.remainingAmount : curr.amount), 0);
        const totalBorrowed = data.filter(d => d.type === 'Borrowed' && d.status === 'Pending').reduce((acc, curr) => acc + (curr.remainingAmount !== undefined ? curr.remainingAmount : curr.amount), 0);
        
        setTotals({ pending: totalBorrowed, given: totalLent });
      }
      if (profileRes && profileRes.data?.success) {
        setProfileImage(profileRes.data.data.profileImage || '');
      }
    } catch (error) {
      console.error('Error fetching debts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDebts();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchDebts();
  };

  const getFilteredDebts = () => {
    if (activeTab === 'All') return debts;
    return debts.filter(d => d.status === activeTab);
  };

  const getInitial = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const filteredDebts = getFilteredDebts();

  return (
    <View className="flex-1 bg-[#F8F9FF]">
      {/* Header */}
      <View className="px-6 pt-14 pb-6 bg-white flex-row justify-between items-center border-b border-[#F0F2FA]">
        <View className="flex-row items-center">
          <View className="w-8 h-8 rounded-full bg-[#EBF0FF] items-center justify-center mr-2 overflow-hidden border border-[#2E3A9D]/15 shadow-sm">
            {profileImage ? (
              <Image source={{ uri: profileImage }} className="w-full h-full" resizeMode="cover" />
            ) : (
              <User size={16} color="#2E3A9D" />
            )}
          </View>
          <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-base">Xpenso</Text>
        </View>
        <TouchableOpacity className="p-2 border border-[#E0E4F5] rounded-xl">
          <Bell size={20} color="#2E3A9D" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        className="flex-1 px-6" 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2E3A9D']} />
        }
      >
        {/* Summary Row */}
        <View className="flex-row justify-between mt-6">
          <View className="bg-white rounded-3xl p-5 w-[48%] shadow-sm border border-[#F0F2FA]">
            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px] mb-2">To Pay</Text>
            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#FF5252] text-2xl">₹{(totals.pending || 0).toLocaleString()}</Text>
          </View>
          <View className="bg-white rounded-3xl p-5 w-[48%] shadow-sm border border-[#F0F2FA]">
            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px] mb-2">To Receive</Text>
            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-2xl">₹{(totals.given || 0).toLocaleString()}</Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <View className="flex-row mt-8 bg-[#F0F2FA] p-1 rounded-2xl">
          {['All', 'Pending', 'Settled'].map((tab) => (
            <TouchableOpacity 
              key={tab} 
              onPress={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-xl items-center ${activeTab === tab ? 'bg-[#2E3A9D]' : ''}`}
            >
              <Text style={{ fontFamily: 'Poppins-SemiBold' }} className={`text-xs ${activeTab === tab ? 'text-white' : 'text-[#8A94A6]'}`}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Debt List */}
        <View className="mt-8 mb-32">
          {loading ? (
            <ActivityIndicator size="large" color="#2E3A9D" className="mt-10" />
          ) : filteredDebts.length === 0 ? (
            <View className="items-center mt-20">
              <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-[#8A94A6]">No records found</Text>
            </View>
          ) : (
            filteredDebts.map((item) => (
              <TouchableOpacity 
                key={item._id} 
                onPress={() => navigation.navigate('DebtDetail', { debt: item })}
                className="bg-white rounded-[32px] p-5 mb-5 shadow-sm border border-[#F0F2FA] flex-row items-center"
              >
                {/* Left Side: Avatar */}
                <View className="bg-[#F8F9FF] w-14 h-14 rounded-2xl items-center justify-center border border-[#F0F2FA]">
                  <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-lg">{getInitial(item.personName)}</Text>
                  <View 
                    style={{ backgroundColor: item.type === 'Lent' ? '#4CAF50' : '#FF5252' }} 
                    className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white items-center justify-center"
                  >
                    {item.type === 'Lent' ? <ArrowUpRight size={8} color="white" /> : <ArrowDownLeft size={8} color="white" />}
                  </View>
                </View>

                {/* Middle: Name & Notes */}
                <View className="flex-1 ml-4 mr-2">
                  <Text numberOfLines={1} style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-base leading-5">{item.personName}</Text>
                  <Text numberOfLines={1} style={{ fontFamily: 'Poppins-Regular' }} className="text-[#8A94A6] text-[10px] mt-0.5">
                    {item.notes || `No purpose added • ${formatDate(item.date)}`}
                  </Text>
                  
                  {/* Small Progress Label */}
                  <View className="flex-row items-center mt-2">
                    <View className={`px-2 py-0.5 rounded-md ${item.status === 'Settled' ? 'bg-[#E8F5E9]' : 'bg-[#FFF3E0]'}`}>
                       <Text style={{ fontFamily: 'Poppins-Bold' }} className={`text-[7px] uppercase ${item.status === 'Settled' ? 'text-[#4CAF50]' : 'text-[#FF9900]'}`}>
                         {item.status === 'Settled' ? 'Settled' : 'Pending'}
                       </Text>
                    </View>
                    {item.status !== 'Settled' && item.remainingAmount < item.amount && (
                      <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-[#8A94A6] text-[8px] ml-2">
                        Paid ₹{(item.amount - (item.remainingAmount || 0)).toLocaleString()}
                      </Text>
                    )}
                  </View>
                </View>

                {/* Right: Money Section */}
                <View className="items-end">
                  <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-[#8A94A6] text-[9px] uppercase">Balance</Text>
                  <Text 
                    style={{ fontFamily: 'Poppins-Bold' }} 
                    className={`text-lg ${item.status === 'Settled' ? 'text-[#4CAF50]' : 'text-[#2E3A9D]'}`}
                  >
                    ₹{((item.remainingAmount !== undefined ? item.remainingAmount : item.amount) || 0).toLocaleString()}
                  </Text>
                  <View className="flex-row items-center mt-0.5">
                    <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-[#8A94A6] text-[8px]">of </Text>
                    <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#444B59] text-[8px]">₹{(item.amount || 0).toLocaleString()}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity 
        onPress={() => navigation.navigate('AddDebt')}
        style={{ position: 'absolute', bottom: 120, right: 30 }}
        className="w-16 h-16 bg-[#2E3A9D] rounded-full items-center justify-center shadow-xl shadow-blue-900"
      >
        <Plus size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default DebtsScreen;
