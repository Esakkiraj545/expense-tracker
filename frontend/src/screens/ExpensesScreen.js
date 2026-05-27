import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Dimensions, ActivityIndicator, RefreshControl, Platform, Image } from 'react-native';
import { Search, Bell, Filter, Utensils, Car, Home, Play, Plus, User, ShoppingBag, MoreHorizontal, CreditCard, Wallet, Calendar as CalendarIcon, ChevronRight } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const { width } = Dimensions.get('window');

const ExpensesScreen = ({ navigation }) => {
  const [expenses, setExpenses] = useState([]);
  const [profileImage, setProfileImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('This Month');
  const [searchQuery, setSearchQuery] = useState('');

  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const categories = [
    { name: 'All', icon: Filter },
    { name: 'Food', icon: Utensils },
    { name: 'Travel', icon: Car },
    { name: 'Shop', icon: ShoppingBag },
    { name: 'Fun', icon: Play },
    { name: 'Rent', icon: Home },
    { name: 'Other', icon: MoreHorizontal },
  ];

  const timeFilters = ['Today', 'This Week', 'This Month', 'Custom'];

  const fetchExpenses = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const [expensesRes, profileRes, tripsRes] = await Promise.all([
        axios.get(`${process.env.EXPO_PUBLIC_API_URL}/expenses`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${process.env.EXPO_PUBLIC_API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => null),
        axios.get(`${process.env.EXPO_PUBLIC_API_URL}/trips`, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => null)
      ]);

      if (expensesRes.data.success) {
        let personalExpenses = expensesRes.data.data;
        if (tripsRes && tripsRes.data?.success) {
           const personalTrip = tripsRes.data.data.find(t => t.tripName === 'Personal Expenses');
           if (personalTrip) {
             const personalTripId = personalTrip._id.toString();
             // Filter to only show expenses that belong to the 'Personal Expenses' trip (or expenses with no trip)
             personalExpenses = personalExpenses.filter(exp => {
               const expTripId = typeof exp.trip === 'object' && exp.trip !== null ? exp.trip._id?.toString() : exp.trip?.toString();
               return !expTripId || expTripId === personalTripId;
             });
           } else {
             // If for some reason the Personal Expenses trip doesn't exist, maybe filter out expenses that have ANY trip that is not 'Personal Expenses'
             // (But usually it should exist if they added personal expenses)
           }
        }
        
        // Also just to be safe if the backend populates trip, filter out any trip not named 'Personal Expenses'
        personalExpenses = personalExpenses.filter(exp => {
          if (exp.trip && typeof exp.trip === 'object' && exp.trip.tripName) {
            return exp.trip.tripName === 'Personal Expenses';
          }
          return true;
        });

        setExpenses(personalExpenses);
      }
      if (profileRes && profileRes.data?.success) {
        setProfileImage(profileRes.data.data.profileImage || '');
      }
    } catch (error) {
      console.log('Error fetching expenses:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchExpenses();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchExpenses();
  };

  const filteredExpenses = useMemo(() => {
    return expenses.filter(item => {
      const itemDate = new Date(item.date);
      const now = new Date();
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = item.note?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.category?.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesTime = true;
      if (selectedTimeFilter === 'Today') {
        matchesTime = itemDate.toDateString() === now.toDateString();
      } else if (selectedTimeFilter === 'This Week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchesTime = itemDate >= weekAgo;
      } else if (selectedTimeFilter === 'This Month') {
        matchesTime = itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
      } else if (selectedTimeFilter === 'Custom') {
        const start = new Date(startDate.setHours(0,0,0,0));
        const end = new Date(endDate.setHours(23,59,59,999));
        matchesTime = itemDate >= start && itemDate <= end;
      }
      return matchesCategory && matchesSearch && matchesTime;
    });
  }, [expenses, selectedCategory, searchQuery, selectedTimeFilter, startDate, endDate]);

  const totalAmount = useMemo(() => {
    return filteredExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
  }, [filteredExpenses]);

  const onStartChange = (event, selectedDate) => {
    setShowStartPicker(Platform.OS === 'ios');
    if (selectedDate) setStartDate(selectedDate);
  };

  const onEndChange = (event, selectedDate) => {
    setShowEndPicker(Platform.OS === 'ios');
    if (selectedDate) setEndDate(selectedDate);
  };

  const getCategoryIcon = (catName) => {
    const icons = {
      'Food': { icon: Utensils, color: '#FF9900', bg: '#FFF5E6' },
      'Travel': { icon: Car, color: '#2E3A9D', bg: '#E8F0FF' },
      'Shop': { icon: ShoppingBag, color: '#00A3FF', bg: '#E6F7FF' },
      'Fun': { icon: Play, color: '#FF5252', bg: '#FFE5E5' },
      'Rent': { icon: Home, color: '#4CAF50', bg: '#E8F5E9' },
      'Other': { icon: MoreHorizontal, color: '#8A94A6', bg: '#F0F2FA' },
    };
    return icons[catName] || icons['Other'];
  };

  return (
    <View className="flex-1 bg-[#F8F9FF]">
      {/* Header Section - FIXED */}
      <View className="bg-white shadow-sm z-20">
        <View className="px-6 pt-14 pb-4 flex-row justify-between items-center border-b border-[#F0F2FA]">
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
            <Bell size={18} color="#2E3A9D" />
          </TouchableOpacity>
        </View>

        <View className="px-6 pt-4 pb-6">
          {/* Search Bar */}
          <View className="flex-row items-center bg-[#F8F9FF] border border-[#E0E4F5] rounded-2xl px-4 py-3 mb-4">
            <Search size={18} color="#8A94A6" />
            <TextInput 
              placeholder="Search transactions..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 ml-3 text-[#2E3A9D] text-sm"
              style={{ fontFamily: 'Poppins-Regular' }}
            />
          </View>

          {/* Category Filters */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4 -mx-2 px-2">
            {categories.map((cat) => (
              <TouchableOpacity 
                key={cat.name}
                onPress={() => setSelectedCategory(cat.name)}
                className={`px-5 py-2.5 rounded-2xl mx-1 flex-row items-center border ${selectedCategory === cat.name ? 'bg-[#2E3A9D] border-[#2E3A9D]' : 'bg-white border-[#F0F2FA]'}`}
              >
                <cat.icon size={14} color={selectedCategory === cat.name ? 'white' : '#2E3A9D'} />
                <Text style={{ fontFamily: 'Poppins-SemiBold' }} className={`text-[10px] ml-2 ${selectedCategory === cat.name ? 'text-white' : 'text-[#2E3A9D]'}`}>
                  {cat.name === 'All' ? 'All' : cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Time Filters */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-2 px-2">
            {timeFilters.map((time) => (
              <TouchableOpacity 
                key={time}
                onPress={() => setSelectedTimeFilter(time)}
                className={`px-6 py-2 rounded-full mx-1 ${selectedTimeFilter === time ? 'bg-[#5C6BC0]' : 'bg-[#F0F2FA]'}`}
              >
                <Text style={{ fontFamily: 'Poppins-SemiBold' }} className={`text-[10px] ${selectedTimeFilter === time ? 'text-white' : 'text-[#8A94A6]'}`}>
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2E3A9D" />}
      >
        {/* Custom Date Picker Section */}
        {selectedTimeFilter === 'Custom' && (
          <View className="mx-6 mt-6 bg-white p-6 rounded-2xl border border-[#F0F2FA] shadow-sm">
             <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-sm mb-4">Custom Date Range</Text>
             <View className="flex-row justify-between">
                <TouchableOpacity onPress={() => setShowStartPicker(true)} className="bg-[#F8F9FF] p-4 rounded-2xl w-[48%] border border-[#E0E4F5]">
                   <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-[#8A94A6] text-[9px] uppercase mb-1">Start Date</Text>
                   <View className="flex-row items-center">
                      <CalendarIcon size={14} color="#2E3A9D" className="mr-2" />
                      <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-[11px]">{startDate.toLocaleDateString()}</Text>
                   </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowEndPicker(true)} className="bg-[#F8F9FF] p-4 rounded-2xl w-[48%] border border-[#E0E4F5]">
                   <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-[#8A94A6] text-[9px] uppercase mb-1">End Date</Text>
                   <View className="flex-row items-center">
                      <CalendarIcon size={14} color="#2E3A9D" className="mr-2" />
                      <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-[11px]">{endDate.toLocaleDateString()}</Text>
                   </View>
                </TouchableOpacity>
             </View>
             {showStartPicker && <DateTimePicker value={startDate} mode="date" onChange={onStartChange} />}
             {showEndPicker && <DateTimePicker value={endDate} mode="date" onChange={onEndChange} />}
          </View>
        )}

        {/* List Content */}
        <View className="px-6 pt-6">
          {loading ? (
            <View className="mt-20 items-center"><ActivityIndicator size="large" color="#2E3A9D" /></View>
          ) : filteredExpenses.length === 0 ? (
            <View className="mt-20 items-center">
               <View className="bg-[#E8EBF8] p-6 rounded-full mb-4"><Wallet size={40} color="#2E3A9D" /></View>
               <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-lg">No transactions found</Text>
            </View>
          ) : (
            <>
              <View className="flex-row justify-between items-center mb-6">
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px]">{selectedTimeFilter} Summary</Text>
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#FF5252] text-sm">-₹{(totalAmount || 0).toLocaleString()}</Text>
              </View>

              {filteredExpenses.map((item, i) => {
                const catInfo = getCategoryIcon(item.category);
                return (
                  <TouchableOpacity 
                    key={item._id || i} 
                    onPress={() => navigation.navigate('ExpenseDetail', { expense: item })}
                    className="bg-white p-4 rounded-xl border border-[#F0F2FA] flex-row items-center mb-4 relative overflow-hidden shadow-sm"
                  >
                    <View className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#FF5252]" />
                    <View style={{ backgroundColor: catInfo.bg }} className="p-3 rounded-2xl mr-4 ml-1">
                      <catInfo.icon size={20} color={catInfo.color} />
                    </View>
                    <View className="flex-1">
                      <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-sm" numberOfLines={1}>{item.category === 'Other' ? (item.otherCategory || 'Other') : item.category}</Text>
                      <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-[#8A94A6] text-[10px]" numberOfLines={1}>{item.note || 'No note added'}</Text>
                    </View>
                    <View className="items-end">
                      <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#FF5252] text-sm">-₹{parseFloat(item.amount || 0).toLocaleString()}</Text>
                      <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-[#8A94A6] text-[8px]">{new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </>
          )}

          {/* Summary Card */}
          {filteredExpenses.length > 0 && (
            <View className="bg-[#2E3A9D] rounded-2xl p-6 mt-10 mb-32 flex-row justify-between items-center shadow-lg">
              <View>
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white/60 text-[10px] uppercase tracking-[1px]">Total Selected Period</Text>
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-2xl">₹{(totalAmount || 0).toLocaleString()}</Text>
              </View>
              <TouchableOpacity className="bg-white px-5 py-3 rounded-2xl">
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-[10px] uppercase">Details</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity onPress={() => navigation.navigate('AddExpense')} style={{ position: 'absolute', bottom: 120, right: 30 }} className="w-16 h-16 bg-[#2E3A9D] rounded-full items-center justify-center shadow-xl">
        <Plus size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default ExpensesScreen;
