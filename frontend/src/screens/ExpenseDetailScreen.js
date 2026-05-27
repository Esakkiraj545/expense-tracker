import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { ChevronLeft, Calendar, CreditCard, FileText, Trash2, Edit3, Share2 } from 'lucide-react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const { width } = Dimensions.get('window');

const ExpenseDetailScreen = ({ route, navigation }) => {
  const { expense } = route.params;

  // Display states (synced with db/nav)
  const [displayAmount, setDisplayAmount] = useState(expense.amount || 0);
  const [displayCategory, setDisplayCategory] = useState(expense.category || 'Other');
  const [displayNote, setDisplayNote] = useState(expense.note || '');
  const [displayPaymentMethod, setDisplayPaymentMethod] = useState(expense.paymentMethod || 'UPI');
  const [loading, setLoading] = useState(false);

  // Sync state when returning from Add/Edit screen
  React.useEffect(() => {
    if (route.params?.expense) {
      const updated = route.params.expense;
      setDisplayAmount(updated.amount || 0);
      setDisplayCategory(updated.category || 'Other');
      setDisplayNote(updated.note || '');
      setDisplayPaymentMethod(updated.paymentMethod || 'UPI');
      // Update original expense object reference
      expense.amount = updated.amount;
      expense.category = updated.category;
      expense.note = updated.note;
      expense.paymentMethod = updated.paymentMethod;
    }
  }, [route.params?.expense]);

  const getCategoryTheme = (catName) => {
    const themes = {
      'Food': { color: '#FF9900', bg: '#FFF5E6', emoji: '🍔' },
      'Travel': { color: '#2E3A9D', bg: '#E8F0FF', emoji: '🚗' },
      'Shop': { color: '#00A3FF', bg: '#E6F7FF', emoji: '🛍️' },
      'Fun': { color: '#FF5252', bg: '#FFE5E5', emoji: '🎮' },
      'Rent': { color: '#4CAF50', bg: '#E8F5E9', emoji: '🏠' },
      'Other': { color: '#8A94A6', bg: '#F0F2FA', emoji: '💰' },
    };
    return themes[catName] || themes['Other'];
  };

  const theme = getCategoryTheme(displayCategory);

  const handleDelete = async () => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction permanently?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              const token = await SecureStore.getItemAsync('userToken');
              const response = await axios.delete(`${process.env.EXPO_PUBLIC_API_URL}/expenses/${expense._id}`, {
                headers: { Authorization: `Bearer ${token}` }
              });

              if (response.data.success) {
                Alert.alert('Success', 'Transaction deleted successfully!');
                navigation.goBack();
              }
            } catch (error) {
              console.log('Error deleting expense:', error);
              Alert.alert('Error', 'Failed to delete transaction');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleEditRedirect = () => {
    let isTripExpense = false;
    if (expense.trip && typeof expense.trip === 'object') {
      isTripExpense = expense.trip.tripName !== 'Personal Expenses';
    }
    const targetScreen = isTripExpense ? 'AddTripExpense' : 'AddExpense';
    navigation.navigate(targetScreen, { expense: expense });
  };

  return (
    <View className="flex-1 bg-[#F8F9FF]">
      {/* Header */}
      <View className="px-6 pt-14 pb-4 bg-white flex-row justify-between items-center border-b border-[#F0F2FA]">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
          <ChevronLeft size={24} color="#2E3A9D" />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-lg">Transaction Details</Text>
        <View className="w-10 h-10" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Top Summary Card */}
        <View className="p-6">
          <View className="bg-white rounded-2xl p-8 items-center border border-[#F0F2FA] shadow-sm">
             <View style={{ backgroundColor: theme.bg }} className="p-5 rounded-xl mb-4">
                <Text style={{ fontSize: 32 }}>{theme.emoji}</Text>
             </View>
             <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-2xl">
               {displayCategory}
             </Text>
             <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-[#8A94A6] text-xs mb-6">{displayNote || 'No description provided'}</Text>
             
             <View className="flex-row items-center">
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#FF5252] text-4xl">₹{displayAmount.toLocaleString()}</Text>
             </View>
          </View>
        </View>

        {/* Details List */}
        <View className="px-6">
          <View className="bg-white rounded-2xl p-6 border border-[#F0F2FA] shadow-sm">
             {/* Date Info */}
             <View className="flex-row items-center py-4 border-b border-[#F8F9FF]">
                <View className="bg-[#F0F2FA] p-2.5 rounded-xl mr-4">
                   <Calendar size={18} color="#8A94A6" />
                </View>
                <View className="flex-1">
                   <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-[#8A94A6] text-[10px] uppercase">Date & Time</Text>
                   <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-sm">
                     {new Date(expense.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                   </Text>
                </View>
             </View>

             {/* Payment Method */}
             <View className="flex-row items-center py-4 border-b border-[#F8F9FF]">
                <View className="bg-[#F0F2FA] p-2.5 rounded-xl mr-4">
                   <CreditCard size={18} color="#8A94A6" />
                </View>
                <View className="flex-1">
                   <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-[#8A94A6] text-[10px] uppercase">Payment Method</Text>
                   <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-sm">{displayPaymentMethod}</Text>
                </View>
             </View>

             {/* Note Info */}
             <View className="flex-row items-start py-4">
                <View className="bg-[#F0F2FA] p-2.5 rounded-xl mr-4">
                   <FileText size={18} color="#8A94A6" />
                </View>
                <View className="flex-1">
                   <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-[#8A94A6] text-[10px] uppercase">Note</Text>
                   <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-[#1A1A1A] text-sm leading-6">
                     {displayNote || 'No additional notes attached to this transaction.'}
                   </Text>
                </View>
             </View>
          </View>
        </View>

        {/* Attachment Section */}
        {expense.attachment && (
          <View className="p-6">
            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-sm mb-4">Attachment</Text>
            <View className="bg-white p-4 rounded-2xl border border-[#F0F2FA] shadow-sm overflow-hidden">
               <Image 
                 source={{ uri: expense.attachment }} 
                 className="w-full h-64 rounded-xl"
                 resizeMode="cover"
               />
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View className="px-6 flex-row justify-between mt-6">
           <TouchableOpacity className="bg-white border border-[#E0E4F5] p-5 rounded-xl w-[31%] items-center justify-center">
              <Share2 size={20} color="#2E3A9D" />
              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-[10px] mt-2">Share</Text>
           </TouchableOpacity>
           <TouchableOpacity 
             onPress={handleEditRedirect}
             className="bg-white border border-[#E0E4F5] p-5 rounded-xl w-[31%] items-center justify-center"
           >
              <Edit3 size={20} color="#2E3A9D" />
              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-[10px] mt-2">Edit</Text>
           </TouchableOpacity>
           <TouchableOpacity 
             onPress={handleDelete}
             disabled={loading}
             className="bg-[#FFE5E5] p-5 rounded-xl w-[31%] items-center justify-center"
           >
              {loading ? (
                <ActivityIndicator size="small" color="#FF5252" />
              ) : (
                <View className="items-center justify-center">
                  <Trash2 size={20} color="#FF5252" />
                  <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#FF5252] text-[10px] mt-2">Delete</Text>
                </View>
              )}
           </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ExpenseDetailScreen;
