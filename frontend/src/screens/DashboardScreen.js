import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, ActivityIndicator, RefreshControl } from 'react-native';
import { Bell, Utensils, Car, FileText, Wallet, CreditCard, Plane, User, Plus, Home, ShoppingBag, Play, MoreHorizontal, Fuel, MapPin, ArrowRight, CalendarClock, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('User');
  const [profileImage, setProfileImage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [expenses, setExpenses] = useState([]);
  const [trips, setTrips] = useState([]);
  const [filterMonth, setFilterMonth] = useState(new Date());

  const fetchDashboardData = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) return;

      const [profileRes, notificationsRes, expensesRes, tripsRes] = await Promise.all([
        axios.get(`${process.env.EXPO_PUBLIC_API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => null),
        axios.get(`${process.env.EXPO_PUBLIC_API_URL}/notifications`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => null),
        axios.get(`${process.env.EXPO_PUBLIC_API_URL}/expenses`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => null),
        axios.get(`${process.env.EXPO_PUBLIC_API_URL}/trips`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => null)
      ]);

      if (profileRes && profileRes.data.success) {
        setUserName(profileRes.data.data.name);
        setProfileImage(profileRes.data.data.profileImage || '');
      }

      if (notificationsRes && notificationsRes.data.success) {
        const count = notificationsRes.data.data.filter(n => !n.isRead).length;
        setUnreadCount(count);
      }

      if (expensesRes && expensesRes.data.success) {
        setExpenses(expensesRes.data.data);
      }

      if (tripsRes && tripsRes.data.success) {
        setTrips(tripsRes.data.data);
      }
    } catch (error) {
      console.log('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const getCategoryTheme = (catName) => {
    const themes = {
      'Food': { icon: Utensils, color: '#FF9900', bg: '#FFF5E6' },
      'Travel': { icon: Plane, color: '#2E3A9D', bg: '#E8F0FF' },
      'Transport': { icon: Car, color: '#6AB04C', bg: '#E8F5E9' },
      'Fuel': { icon: Fuel, color: '#EB4D4B', bg: '#FFE5E5' },
      'Shop': { icon: ShoppingBag, color: '#00A3FF', bg: '#E6F7FF' },
      'Shopping': { icon: ShoppingBag, color: '#00A3FF', bg: '#E6F7FF' },
      'Fun': { icon: Play, color: '#FF5252', bg: '#FFE5E5' },
      'Stay': { icon: Home, color: '#4834D4', bg: '#EBE8FF' },
      'Rent': { icon: Home, color: '#4CAF50', bg: '#E8F5E9' },
      'Other': { icon: MoreHorizontal, color: '#8A94A6', bg: '#F0F2FA' },
      'Others': { icon: MoreHorizontal, color: '#8A94A6', bg: '#F0F2FA' },
    };
    return themes[catName] || themes['Other'];
  };

  // Calculations
  const thisMonthSpent = useMemo(() => {
    const now = new Date();
    return expenses
      .filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
      })
      .reduce((sum, exp) => sum + exp.amount, 0);
  }, [expenses]);

  const activeTrips = useMemo(() => {
    const now = new Date();
    return trips.filter(t => t.tripName !== 'Personal Expenses' && new Date(t.endDate) >= now);
  }, [trips]);

  const activeTripsBudget = activeTrips.reduce((sum, t) => sum + (t.budget || 0), 0);
  const activeTripsSpent = activeTrips.reduce((sum, t) => sum + (t.totalExpenses || 0), 0);

  const recentTransactions = useMemo(() => {
    return expenses.slice(0, 5);
  }, [expenses]);

  // Upcoming Trip Countdown Logic
  const upcomingTrip = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const futureTrips = trips.filter(t => t.tripName !== 'Personal Expenses' && new Date(t.startDate) >= now);
    if (futureTrips.length === 0) return null;
    futureTrips.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    const nextTrip = futureTrips[0];
    
    const diffTime = Math.abs(new Date(nextTrip.startDate) - now);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return { ...nextTrip, daysLeft: diffDays };
  }, [trips]);

  // Category Breakdown Logic
  const categoryBreakdown = useMemo(() => {
    const currentMonthExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === filterMonth.getMonth() && expDate.getFullYear() === filterMonth.getFullYear();
    });

    const categoryTotals = {};
    currentMonthExpenses.forEach(exp => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    const total = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);
    
    if (total === 0) return [];

    const breakdown = Object.keys(categoryTotals).map(cat => ({
      category: cat,
      amount: categoryTotals[cat],
      percentage: (categoryTotals[cat] / total) * 100,
      theme: getCategoryTheme(cat)
    }));

    return breakdown.sort((a, b) => b.percentage - a.percentage);
  }, [expenses, filterMonth]);

  const handleTransactionClick = (expense) => {
    let isPersonalExpense = true;
    if (expense.trip && typeof expense.trip === 'object') {
      isPersonalExpense = expense.trip.tripName === 'Personal Expenses';
    } else if (expense.trip && typeof expense.trip === 'string') {
      const trip = trips.find(t => t._id === expense.trip);
      if (trip && trip.tripName !== 'Personal Expenses') isPersonalExpense = false;
    }
    navigation.navigate('ExpenseDetail', { expense, isPersonalExpense });
  };

  return (
    <View className="flex-1 bg-[#F8F9FF]">
      {/* Header */}
      <View className="px-6 pt-14 pb-6 bg-white flex-row justify-between items-center border-b border-[#F0F2FA]">
        <View className="flex-row items-center">
          <View className="w-10 h-10 rounded-full bg-[#EBF0FF] items-center justify-center mr-3 overflow-hidden border border-[#2E3A9D]/15 shadow-sm">
            {profileImage ? (
              <Image source={{ uri: profileImage }} className="w-full h-full" resizeMode="cover" />
            ) : (
              <User size={20} color="#2E3A9D" />
            )}
          </View>
          <View>
            <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-[#8A94A6] text-[10px]">Welcome back,</Text>
            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-base">
              {loading && !refreshing ? '...' : userName}
            </Text>
          </View>
        </View>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Notifications')}
          className="p-2 border border-[#E0E4F5] rounded-xl relative"
        >
          <Bell size={20} color="#2E3A9D" />
          {unreadCount > 0 && (
            <View className="absolute -top-1.5 -right-1.5 bg-[#FF5252] w-5 h-5 rounded-full items-center justify-center border-2 border-white">
              <Text className="text-white text-[8px]" style={{ fontFamily: 'Poppins-Bold' }}>
                {unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <View className="flex-1 items-center justify-center">
           <ActivityIndicator size="large" color="#2E3A9D" />
        </View>
      ) : (
        <ScrollView 
          className="flex-1 px-6" 
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2E3A9D" />}
        >
          {/* Summary Cards */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-6 -mx-6 px-6 pb-2">
            <View className="bg-[#4151C3] w-[260px] rounded-xl p-6 mr-4 relative overflow-hidden shadow-sm shadow-blue-900/20">
              <View className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#FF5252]" />
              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white/60 text-[10px] tracking-[1px] uppercase mb-2">
                This Month Spent
              </Text>
              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-3xl mb-4">
                ₹{thisMonthSpent.toLocaleString()}
              </Text>
              <View className="bg-white/20 self-start px-3 py-1.5 rounded-full flex-row items-center">
                <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-white text-[10px]">
                  All Expenses Included
                </Text>
              </View>
            </View>

            <View className="bg-[#E8EBF8] w-[260px] rounded-xl p-6 relative overflow-hidden shadow-sm border border-[#E0E4F5]">
              <View className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#4CAF50]" />
              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D]/60 text-[10px] tracking-[1px] uppercase mb-2">
                Active Trips Budget
              </Text>
              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-3xl mb-4">
                ₹{(activeTripsBudget - activeTripsSpent).toLocaleString()}
              </Text>
              <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-[#8A94A6] text-[9px] mb-2">
                Remaining out of ₹{activeTripsBudget.toLocaleString()}
              </Text>
              <View className="h-1.5 bg-[#2E3A9D]/10 rounded-full w-full overflow-hidden">
                <View 
                  className="h-full bg-[#2E3A9D]" 
                  style={{ width: `${Math.min((activeTripsSpent / (activeTripsBudget || 1)) * 100, 100)}%` }} 
                />
              </View>
            </View>
          </ScrollView>

          {/* Upcoming Trip Widget */}
          {upcomingTrip && (
            <View className="mt-8 mb-2 relative rounded-3xl overflow-hidden shadow-sm">
              <View className="bg-[#FF9900] p-6 relative">
                 <View className="absolute -right-10 -top-10 bg-white/10 w-40 h-40 rounded-full" />
                 <View className="absolute right-20 -bottom-10 bg-white/10 w-32 h-32 rounded-full" />
                 <View className="flex-row items-center mb-2">
                    <CalendarClock size={16} color="rgba(255,255,255,0.7)" className="mr-2" />
                    <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white/70 text-[10px] tracking-widest uppercase">Next Adventure</Text>
                 </View>
                 <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-2xl mb-1">{upcomingTrip.tripName}</Text>
                 <View className="flex-row items-center mt-4">
                    <View className="bg-white/20 px-4 py-2 rounded-xl flex-row items-center backdrop-blur-md">
                       <Plane size={16} color="white" className="mr-2" />
                       <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-sm">
                         {upcomingTrip.daysLeft === 0 ? "Starts Today! 🏖️" : `in ${upcomingTrip.daysLeft} days! 🏖️`}
                       </Text>
                    </View>
                 </View>
              </View>
            </View>
          )}

          {/* Category Breakdown Widget (Bar Chart Style) */}
          <View className="mt-6 mb-4 bg-white rounded-3xl p-6 border border-[#F0F2FA] shadow-sm">
            <View className="flex-row justify-between items-center mb-1">
               <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-lg">Spend Analysis</Text>
               <TrendingUp size={18} color="#2E3A9D" />
            </View>
            
            <View className="flex-row justify-between items-center mb-6 mt-1">
               <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-[#8A94A6] text-[10px]">Expenses by category</Text>
               
               {/* Month Filter */}
               <View className="flex-row items-center bg-[#F8F9FF] rounded-xl px-1.5 py-1 border border-[#F0F2FA]">
                  <TouchableOpacity onPress={() => setFilterMonth(new Date(filterMonth.getFullYear(), filterMonth.getMonth() - 1, 1))} className="p-1">
                     <ChevronLeft size={14} color="#2E3A9D" />
                  </TouchableOpacity>
                  <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-[9px] mx-1 w-16 text-center uppercase tracking-widest">
                     {filterMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </Text>
                  <TouchableOpacity onPress={() => setFilterMonth(new Date(filterMonth.getFullYear(), filterMonth.getMonth() + 1, 1))} className="p-1">
                     <ChevronRight size={14} color="#2E3A9D" />
                  </TouchableOpacity>
               </View>
            </View>
            
            {/* Horizontal Bar Chart */}
            {categoryBreakdown.length === 0 ? (
               <View className="items-center justify-center py-6">
                  <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-[#8A94A6] text-[11px]">No expenses found for this month.</Text>
               </View>
            ) : (
              <View>
                 {categoryBreakdown.map((cat, idx) => {
                    const maxPercentage = Math.max(...categoryBreakdown.map(c => c.percentage));
                    const barWidth = (cat.percentage / maxPercentage) * 100;
                    
                    return (
                      <View key={cat.category} className="mb-4">
                        <View className="flex-row justify-between items-end mb-1.5">
                           <View className="flex-row items-center">
                              <View style={{ backgroundColor: cat.theme.bg }} className="p-1.5 rounded-lg mr-2">
                                <cat.theme.icon size={12} color={cat.theme.color} />
                              </View>
                              <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-[#1A1A1A] text-xs">{cat.category}</Text>
                           </View>
                           <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-xs">₹{cat.amount.toLocaleString()}</Text>
                        </View>
                        <View className="flex-row items-center">
                           <View className="flex-1 h-2 bg-[#F0F2FA] rounded-full overflow-hidden mr-3">
                              <View 
                                style={{ width: `${barWidth}%`, backgroundColor: cat.theme.color }} 
                                className="h-full rounded-full"
                              />
                           </View>
                           <Text style={{ fontFamily: 'Poppins-Medium', width: 32 }} className="text-[#8A94A6] text-[9px] text-right">{cat.percentage.toFixed(0)}%</Text>
                        </View>
                      </View>
                    );
                 })}
              </View>
            )}
          </View>

          {/* Recent Transactions */}
          <View className="mt-8 mb-32">
            <View className="flex-row justify-between items-center mb-6">
              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-lg">Recent Transactions</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Expenses')}>
                <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-[#2E3A9D] text-[11px] uppercase">See All</Text>
              </TouchableOpacity>
            </View>

            {recentTransactions.length === 0 ? (
               <View className="bg-white rounded-2xl p-6 items-center border border-dashed border-[#E0E4F5]">
                 <Wallet size={32} color="#E0E4F5" className="mb-2" />
                 <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-[#8A94A6] text-[11px]">No transactions yet.</Text>
               </View>
            ) : (
              recentTransactions.map((item) => {
                const theme = getCategoryTheme(item.category);
                const time = new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                
                return (
                  <TouchableOpacity 
                    key={item._id} 
                    onPress={() => handleTransactionClick(item)}
                    className="flex-row items-center mb-3 bg-white p-4 rounded-2xl border border-[#F0F2FA] shadow-sm"
                  >
                    <View style={{ backgroundColor: theme.bg }} className="p-3 rounded-xl mr-4">
                      <theme.icon size={20} color={theme.color} />
                    </View>
                    <View className="flex-1">
                      <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-sm">{item.category}</Text>
                      <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-[#8A94A6] text-[10px]" numberOfLines={1}>{item.note || 'No note added'} • {time}</Text>
                    </View>
                    <View className="items-end">
                      <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#FF5252] text-sm">-₹{item.amount.toLocaleString()}</Text>
                      <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-[#8A94A6] text-[8px] uppercase">{item.paymentMethod}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default DashboardScreen;
