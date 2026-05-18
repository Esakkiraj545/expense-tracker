import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, ActivityIndicator, RefreshControl } from 'react-native';
import { ChevronLeft, Bell, MoreVertical, Utensils, Home, Car, Play, PieChart, User, Plus, MapPin, Calendar, Wallet, Info, Fuel, ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const { width } = Dimensions.get('window');

const TripDetailScreen = ({ route, navigation }) => {
  const { tripId } = route.params;
  const [trip, setTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('expenses');
  const [expandedExpenseId, setExpandedExpenseId] = useState(null);

  const fetchTripData = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      
      // Fetch Trip Details
      const tripRes = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/trips/${tripId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (tripRes.data.success) {
        setTrip(tripRes.data.data);
      }

      // Fetch Expenses
      const expRes = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/expenses/trip/${tripId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (expRes.data.success) {
        setExpenses(expRes.data.data);
      }
    } catch (error) {
      console.log('Error fetching trip data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTripData();
    }, [tripId])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchTripData();
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Food': return { icon: Utensils, color: '#FF9F43' };
      case 'Stay': return { icon: Home, color: '#4834D4' };
      case 'Transport': return { icon: Car, color: '#6AB04C' };
      case 'Fuel': return { icon: Fuel, color: '#EB4D4B' };
      case 'Shopping': return { icon: ShoppingBag, color: '#F093FB' };
      default: return { icon: Wallet, color: '#8A94A6' };
    }
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 bg-[#F8F9FF] items-center justify-center">
        <ActivityIndicator size="large" color="#2E3A9D" />
      </View>
    );
  }

  if (!trip) return null;

  const spentPercentage = Math.min(((trip.totalExpenses || 0) / trip.budget) * 100, 100);

  return (
    <View className="flex-1 bg-[#F8F9FF]">
      {/* Header Image & Back Button */}
      <View className="h-72 relative">
        <Image 
          source={{ uri: trip.image }} 
          className="w-full h-full"
          resizeMode="cover"
        />
        <View className="absolute top-0 left-0 right-0 h-32 bg-black/30" />
        <View className="absolute top-14 left-6 right-6 flex-row justify-between items-center">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center border border-white/30"
          >
            <ChevronLeft size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity className="w-10 h-10 bg-white/20 rounded-full items-center justify-center border border-white/30">
            <MoreVertical size={20} color="white" />
          </TouchableOpacity>
        </View>

        <View className="absolute bottom-0 left-0 right-0 p-6 bg-black/40">
           <View className="flex-row items-center mb-1">
              <MapPin size={12} color="#4CAF50" />
              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#4CAF50] text-[10px] ml-1 uppercase tracking-wider">{trip.destination}, {trip.state}</Text>
           </View>
           <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-3xl mb-1">{trip.tripName}</Text>
           <View className="flex-row items-center">
              <Calendar size={12} color="white" style={{ opacity: 0.8 }} />
              <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-white/80 text-[10px] ml-1">
                {new Date(trip.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - {new Date(trip.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </Text>
           </View>
        </View>
      </View>

      <ScrollView 
        className="flex-1 -mt-6 bg-[#F8F9FF] rounded-t-[40px]"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="p-6 pt-8">
          {/* Quick Stats Cards */}
          <View className="flex-row justify-between mb-6">
             <View className="bg-white rounded-[32px] p-4 w-[31%] shadow-sm border border-[#F0F2FA] items-center">
                <View className="bg-[#E8EBF8] w-7 h-7 rounded-full items-center justify-center mb-2">
                   <Wallet size={14} color="#2E3A9D" />
                </View>
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-[11px] text-center">₹{trip.budget.toLocaleString()}</Text>
                <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-[#8A94A6] text-[8px] uppercase tracking-wider text-center">Budget</Text>
             </View>

             <View className="bg-white rounded-[32px] p-4 w-[31%] shadow-sm border border-[#F0F2FA] items-center">
                <View className="bg-[#FFE5E5] w-7 h-7 rounded-full items-center justify-center mb-2">
                   <PieChart size={14} color="#FF5252" />
                </View>
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#FF5252] text-[11px] text-center">₹{(trip.totalExpenses || 0).toLocaleString()}</Text>
                <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-[#8A94A6] text-[8px] uppercase tracking-wider text-center">Xpenso</Text>
             </View>

             <View style={{ backgroundColor: trip.budget - (trip.totalExpenses || 0) >= 0 ? '#E8F5E9' : '#FFE5E5' }} className="rounded-[32px] p-4 w-[31%] items-center shadow-sm border border-[#F0F2FA]">
                <View className="bg-white w-7 h-7 rounded-full items-center justify-center mb-2 shadow-sm">
                   <Info size={14} color={trip.budget - (trip.totalExpenses || 0) >= 0 ? '#4CAF50' : '#FF5252'} />
                </View>
                <Text style={{ fontFamily: 'Poppins-Bold', color: trip.budget - (trip.totalExpenses || 0) >= 0 ? '#388E3C' : '#D32F2F' }} className="text-[11px] text-center">
                  ₹{(trip.budget - (trip.totalExpenses || 0)).toLocaleString()}
                </Text>
                <Text style={{ fontFamily: 'Poppins-Medium', color: trip.budget - (trip.totalExpenses || 0) >= 0 ? '#388E3C' : '#D32F2F' }} className="text-[8px] uppercase tracking-wider text-center">Savings</Text>
             </View>
          </View>

          {/* Budget Progress Bar */}
          <View className="bg-white rounded-3xl p-6 mb-6 shadow-sm border border-[#F0F2FA]">
             <View className="flex-row justify-between items-center mb-3">
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-sm">Budget Progress</Text>
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-xs">{spentPercentage.toFixed(0)}%</Text>
             </View>
             <View className="h-3 bg-[#F0F2FA] rounded-full overflow-hidden mb-3">
                <View 
                  style={{ width: `${spentPercentage}%` }} 
                  className={`h-full ${spentPercentage > 90 ? 'bg-[#FF5252]' : 'bg-[#2E3A9D]'}`} 
                />
             </View>
             <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-[#8A94A6] text-[10px] mb-4">
                You have spent ₹{(trip.totalExpenses || 0).toLocaleString()} out of ₹{trip.budget.toLocaleString()}
             </Text>

             {/* Individual Budget Split helper card */}
             <View className="bg-[#F8F9FF] rounded-2xl p-4 flex-row justify-between items-center border border-[#E0E4F5]">
                <View className="flex-row items-center flex-1 mr-3">
                  <View className="bg-white p-2 rounded-xl mr-3 shadow-sm border border-[#E0E4F5]">
                    <User size={16} color="#2E3A9D" />
                  </View>
                  <View className="flex-1">
                    <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-[11px] mb-0.5">Budget Per Person</Text>
                    <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-[#8A94A6] text-[9px]">Shared limit for {1 + trip.members.length} people</Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-sm">₹{(trip.budget / (1 + trip.members.length)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                  <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-[#8A94A6] text-[8px]">Per Head Share</Text>
                </View>
             </View>
          </View>

          {/* Members Avatars & Info scroll list */}
          <View className="bg-white rounded-3xl p-5 mb-6 shadow-sm border border-[#F0F2FA]">
            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-[10px] uppercase tracking-wider mb-3">Trip Collaborators</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
              {/* Owner Avatar */}
              <View className="items-center mr-5">
                <View className="w-12 h-12 rounded-full bg-[#E8F5E9] items-center justify-center border-2 border-[#4CAF50] mb-1.5 relative">
                  <View className="w-full h-full rounded-full overflow-hidden items-center justify-center">
                    {trip.owner.profileImage ? (
                      <Image source={{ uri: trip.owner.profileImage }} className="w-full h-full" resizeMode="cover" />
                    ) : (
                      <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#388E3C] text-sm">
                        {trip.owner.name ? trip.owner.name[0].toUpperCase() : 'O'}
                      </Text>
                    )}
                  </View>
                  <View className="absolute bottom-0 right-0 w-3 h-3 bg-[#4CAF50] rounded-full border border-white" style={{ zIndex: 10 }} />
                </View>
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-[9px] text-center" numberOfLines={1}>
                  {trip.owner.name ? trip.owner.name.split(' ')[0] : 'Admin'}
                </Text>
                <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-[#8A94A6] text-[8px]">You</Text>
              </View>

              {/* Members Avatars */}
              {trip.members.map((member, idx) => {
                const memberName = member.user?.name || member.email.split('@')[0];
                const initials = memberName ? memberName[0].toUpperCase() : 'M';
                const isJoined = member.status === 'joined';
                const statusColor = isJoined ? '#2E3A9D' : '#FF9900';
                const statusBg = isJoined ? '#E8EBF8' : '#FFF5E6';
                
                return (
                  <View key={idx} className="items-center mr-5">
                    <View style={{ borderColor: statusColor }} className="w-12 h-12 rounded-full items-center justify-center border-2 mb-1.5 relative">
                      <View style={{ backgroundColor: statusBg }} className="w-full h-full rounded-full overflow-hidden items-center justify-center">
                        {member.user?.profileImage ? (
                          <Image source={{ uri: member.user.profileImage }} className="w-full h-full" resizeMode="cover" />
                        ) : (
                          <Text style={{ fontFamily: 'Poppins-Bold', color: statusColor }} className="text-sm">
                            {initials}
                          </Text>
                        )}
                      </View>
                      <View style={{ backgroundColor: statusColor }} className="absolute bottom-0 right-0 w-3 h-3 rounded-full border border-white" style={{ zIndex: 10 }} />
                    </View>
                    <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-[9px] text-center" numberOfLines={1}>
                      {memberName.split(' ')[0]}
                    </Text>
                    <Text style={{ fontFamily: 'Poppins-Regular', color: statusColor }} className="text-[8px] capitalize">{member.status}</Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>

          {/* Tabs - Only show for Group Trips */}
          {trip.tripType !== 'solo' && (
            <View className="flex-row mb-6 bg-[#E0E4F5] p-1.5 rounded-2xl">
               <TouchableOpacity 
                 onPress={() => setActiveTab('expenses')}
                 className={`flex-1 py-3 rounded-xl items-center ${activeTab === 'expenses' ? 'bg-white shadow-sm' : ''}`}
               >
                  <Text style={{ fontFamily: 'Poppins-Bold' }} className={`text-xs ${activeTab === 'expenses' ? 'text-[#2E3A9D]' : 'text-[#8A94A6]'}`}>Xpenso</Text>
               </TouchableOpacity>
               <TouchableOpacity 
                 onPress={() => setActiveTab('members')}
                 className={`flex-1 py-3 rounded-xl items-center ${activeTab === 'members' ? 'bg-white shadow-sm' : ''}`}
               >
                  <Text style={{ fontFamily: 'Poppins-Bold' }} className={`text-xs ${activeTab === 'members' ? 'text-[#2E3A9D]' : 'text-[#8A94A6]'}`}>Members</Text>
               </TouchableOpacity>
            </View>
          )}

          {/* Tab Content */}
          {(activeTab === 'expenses' || trip.tripType === 'solo') ? (
            <View>
              {expenses.length > 0 ? (
                expenses.map((exp) => {
                  const cat = getCategoryIcon(exp.category);
                  const isOwner = exp.paidBy?._id === trip.owner._id;
                  const payerName = isOwner ? 'You' : (exp.paidBy?.name || 'Member');
                  const time = new Date(exp.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

                  const totalParticipantCount = 1 + trip.members.length;
                  const splitShare = exp.amount / totalParticipantCount;

                  return (
                    <TouchableOpacity 
                      key={exp._id}
                      activeOpacity={0.9}
                      onPress={() => setExpandedExpenseId(expandedExpenseId === exp._id ? null : exp._id)}
                      className="bg-white rounded-3xl p-4 mb-3 border border-[#F0F2FA] shadow-sm overflow-hidden"
                    >
                      <View className="flex-row items-center">
                         <View style={{ backgroundColor: cat.color + '20' }} className="p-3 rounded-2xl mr-4">
                            <cat.icon size={20} color={cat.color} />
                         </View>
                         <View className="flex-1">
                            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-sm mb-0.5">{exp.category}</Text>
                            <View className="flex-row items-center">
                              <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-[#2E3A9D] text-[9px] mr-2">Paid by {payerName}</Text>
                              <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-[#8A94A6] text-[8px]">{time}</Text>
                            </View>
                            <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-[#8A94A6] text-[9px] mt-1" numberOfLines={1}>
                              {exp.note || 'No notes added'}
                            </Text>
                         </View>
                         <View className="items-end mr-2">
                            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-sm">₹{exp.amount.toLocaleString()}</Text>
                            <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-[#8A94A6] text-[8px]">{exp.paymentMethod}</Text>
                         </View>
                         <View className="ml-1 justify-center">
                            {expandedExpenseId === exp._id ? (
                              <ChevronUp size={16} color="#8A94A6" />
                            ) : (
                              <ChevronDown size={16} color="#8A94A6" />
                            )}
                         </View>
                      </View>

                      {/* Accordion Split Details Panel */}
                      {expandedExpenseId === exp._id && (
                        <View className="mt-4 pt-4 border-t border-[#F8F9FF] bg-[#F8F9FF] -mx-4 -mb-4 p-4 rounded-b-3xl">
                          <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-[9px] uppercase tracking-wider mb-3">Individual Split Breakdown ({totalParticipantCount} People)</Text>
                          
                          {/* Owner Split */}
                          <View className="flex-row justify-between items-center py-2 border-b border-white/50">
                            <View className="flex-row items-center">
                              <View className="w-6 h-6 rounded-full bg-[#E8F5E9] items-center justify-center mr-2 border border-[#4CAF50]/30 overflow-hidden">
                                {trip.owner.profileImage ? (
                                  <Image source={{ uri: trip.owner.profileImage }} className="w-full h-full" resizeMode="cover" />
                                ) : (
                                  <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#388E3C] text-[9px]">
                                    {trip.owner.name ? trip.owner.name[0].toUpperCase() : 'O'}
                                  </Text>
                                )}
                              </View>
                              <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-[#444B59] text-xs">You (Admin)</Text>
                            </View>
                            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-xs">₹{splitShare.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                          </View>

                          {/* Members Splits */}
                          {trip.members.map((member, mIdx) => {
                            const name = member.user?.name || member.email.split('@')[0];
                            const letter = name ? name[0].toUpperCase() : 'M';
                            return (
                              <View key={mIdx} className="flex-row justify-between items-center py-2 border-b border-white/50">
                                <View className="flex-row items-center">
                                  <View className="w-6 h-6 rounded-full bg-[#E8EBF8] items-center justify-center mr-2 border border-[#2E3A9D]/30 overflow-hidden">
                                    {member.user?.profileImage ? (
                                      <Image source={{ uri: member.user.profileImage }} className="w-full h-full" resizeMode="cover" />
                                    ) : (
                                      <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-[9px]">
                                        {letter}
                                      </Text>
                                    )}
                                  </View>
                                  <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-[#444B59] text-xs">{name}</Text>
                                </View>
                                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-xs">₹{splitShare.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                              </View>
                            );
                          })}
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })
              ) : (
                /* Empty state for expenses */
                <View className="bg-white rounded-3xl p-10 items-center border border-dashed border-[#E0E4F5]">
                   <View className="bg-[#F8F9FF] p-4 rounded-full mb-4">
                      <Utensils size={32} color="#E0E4F5" />
                   </View>
                   <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-sm mb-1">No Xpenso yet</Text>
                   <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-[#8A94A6] text-[10px] text-center">Tap the + button to add your first Xpenso for this trip.</Text>
                </View>
              )}
            </View>
          ) : (
            <View>
              {/* Trip Members List with Contributions */}
              <View className="bg-white rounded-3xl p-2 border border-[#F0F2FA] shadow-sm">
                {/* Owner Contribution */}
                <View className="px-4 py-4 border-b border-[#F8F9FF] flex-row items-center">
                   <View className="w-10 h-10 rounded-full bg-[#E8F5E9] items-center justify-center mr-3 overflow-hidden border border-[#4CAF50]/20">
                      {trip.owner.profileImage ? (
                        <Image source={{ uri: trip.owner.profileImage }} className="w-full h-full" resizeMode="cover" />
                      ) : (
                        <User size={18} color="#4CAF50" />
                      )}
                   </View>
                   <View className="flex-1">
                      <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-sm">You (Admin)</Text>
                      <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-[#8A94A6] text-[10px]">{trip.owner.email}</Text>
                   </View>
                   <View className="items-end">
                      <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-sm">₹{expenses.filter(e => e.paidBy?._id === trip.owner._id).reduce((sum, e) => sum + e.amount, 0).toLocaleString()}</Text>
                      <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-[#8A94A6] text-[8px]">Paid</Text>
                   </View>
                </View>

                {/* Member Contributions */}
                {trip.members.map((member, index) => {
                  const memberPaid = expenses.filter(e => e.paidBy?._id === member.user?._id).reduce((sum, e) => sum + e.amount, 0);
                  const name = member.user?.name || member.email.split('@')[0];
                  return (
                    <View key={index} className="px-4 py-4 border-b border-[#F8F9FF] flex-row items-center">
                      <View className="w-10 h-10 rounded-full bg-[#F0F2FA] items-center justify-center mr-3 overflow-hidden border border-[#2E3A9D]/20">
                         {member.user?.profileImage ? (
                           <Image source={{ uri: member.user.profileImage }} className="w-full h-full" resizeMode="cover" />
                         ) : (
                           <User size={18} color="#2E3A9D" />
                         )}
                      </View>
                      <View className="flex-1">
                         <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-sm">{name}</Text>
                         <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-[#8A94A6] text-[10px]">{member.email}</Text>
                      </View>
                      <View className="items-end">
                         <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-sm">₹{memberPaid.toLocaleString()}</Text>
                         <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-[#8A94A6] text-[8px]">Paid</Text>
                      </View>
                    </View>
                  );
                })}
              </View>

              <TouchableOpacity 
                className="mt-6 flex-row items-center justify-center bg-white p-4 rounded-2xl border border-dashed border-[#2E3A9D]"
              >
                 <Plus size={16} color="#2E3A9D" className="mr-2" />
                 <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-xs">Invite More Members</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View className="h-24" />
      </ScrollView>

      {/* FAB to Add Expense */}
      <TouchableOpacity 
        onPress={() => navigation.navigate('AddExpense', { tripId: trip._id })}
        className="absolute bottom-10 right-8 w-16 h-16 bg-[#2E3A9D] rounded-full items-center justify-center shadow-xl shadow-blue-900"
      >
         <Plus size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default TripDetailScreen;
