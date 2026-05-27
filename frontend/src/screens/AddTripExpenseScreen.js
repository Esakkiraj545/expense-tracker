import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator, Platform, KeyboardAvoidingView } from 'react-native';
import { Utensils, Home, Car, Fuel, ShoppingBag, Plus, Calendar, CreditCard, Wallet, Smartphone, Camera, X, Check, Save, User } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const CATEGORIES = [
  { id: 'Food', name: 'Food', icon: Utensils, color: '#FF9F43' },
  { id: 'Stay', name: 'Stay', icon: Home, color: '#4834D4' },
  { id: 'Transport', name: 'Transport', icon: Car, color: '#6AB04C' },
  { id: 'Fuel', name: 'Fuel', icon: Fuel, color: '#EB4D4B' },
  { id: 'Shopping', name: 'Shopping', icon: ShoppingBag, color: '#F093FB' },
  { id: 'Others', name: 'Others', icon: Plus, color: '#8A94A6' },
];

const PAYMENT_METHODS = [
  { id: 'UPI', name: 'UPI', icon: Smartphone },
  { id: 'Cash', name: 'Cash', icon: Wallet },
  { id: 'Card', name: 'Card', icon: CreditCard },
];

const AddTripExpenseScreen = ({ route, navigation }) => {
  const { tripId, expense } = route.params || {};
  const isEditMode = !!expense;

  const [selectedTripId, setSelectedTripId] = useState(expense ? (expense.trip?._id || expense.trip) : (tripId || ''));
  const [trip, setTrip] = useState(null);
  const [amount, setAmount] = useState(expense ? expense.amount.toString() : '');
  const [selectedCategory, setSelectedCategory] = useState(
    expense 
      ? (['Food', 'Stay', 'Transport', 'Fuel', 'Shopping'].includes(expense.category) ? expense.category : 'Others') 
      : 'Food'
  );
  const [customCategory, setCustomCategory] = useState(
    expense && !['Food', 'Stay', 'Transport', 'Fuel', 'Shopping'].includes(expense.category) ? expense.category : ''
  );
  const [paymentMethod, setPaymentMethod] = useState(expense ? expense.paymentMethod : 'UPI');
  const [selectedPayer, setSelectedPayer] = useState(expense ? (expense.paidBy?._id || expense.paidBy) : null);
  const [date, setDate] = useState(expense ? new Date(expense.date) : new Date());
  const [note, setNote] = useState(expense ? expense.note || '' : '');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Fetch the selected trip's members and details
  React.useEffect(() => {
    if (!selectedTripId) return;
    const fetchTripMembers = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/trips/${selectedTripId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setTrip(response.data.data);
          // Set default payer as trip owner if not in edit mode
          if (!isEditMode) {
            setSelectedPayer(response.data.data.owner._id);
          }
        }
      } catch (error) {
        console.log('Error fetching trip members:', error);
      }
    };
    fetchTripMembers();
  }, [selectedTripId]);

  const handleSaveExpense = async () => {
    if (!selectedTripId) {
      Alert.alert('Error', 'No active trip association found.');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (selectedCategory === 'Others' && !customCategory) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }

    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const payload = {
        trip: selectedTripId,
        amount: parseFloat(amount),
        category: selectedCategory === 'Others' ? customCategory : selectedCategory,
        paymentMethod,
        paidBy: selectedPayer,
        date,
        note
      };

      if (isEditMode) {
        const response = await axios.put(`${process.env.EXPO_PUBLIC_API_URL}/expenses/${expense._id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          Alert.alert('Success', 'Trip expense updated successfully!', [
            { 
              text: 'OK', 
              onPress: () => {
                const updatedExpense = {
                  ...expense,
                  ...response.data.data,
                  paidBy: expense.paidBy && typeof expense.paidBy === 'object' 
                    ? { ...expense.paidBy, ...response.data.data.paidBy } 
                    : response.data.data.paidBy
                };
                navigation.navigate('ExpenseDetail', { expense: updatedExpense });
              } 
            }
          ]);
        }
      } else {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/expenses`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          Alert.alert('Success', 'Trip expense added successfully!', [
            { text: 'OK', onPress: () => navigation.goBack() }
          ]);
        }
      }
    } catch (error) {
      console.log('Error saving trip expense:', error);
      Alert.alert('Error', isEditMode ? 'Failed to update trip expense' : 'Failed to add trip expense');
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) setDate(selectedDate);
  };

  const headerTitle = isEditMode ? 'Trip Edit Expense' : 'Trip Add Expense';
  const buttonTitle = isEditMode ? 'Save Trip Changes' : 'Add Trip Expense';

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-[#F8F9FF]"
    >
      {/* Header */}
      <View className="px-6 pt-14 pb-4 bg-white flex-row items-center justify-between border-b border-[#F0F2FA]">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
          <X size={24} color="#2E3A9D" />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-lg">{headerTitle}</Text>
        <TouchableOpacity onPress={handleSaveExpense} disabled={loading}>
           {loading ? <ActivityIndicator size="small" color="#2E3A9D" /> : <Check size={24} color="#2E3A9D" />}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 180 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Amount Input */}
        <View className="bg-white px-6 py-10 items-center border-b border-[#F0F2FA]">
           <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px] mb-2">Amount Spent</Text>
           <View className="flex-row items-center">
              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-4xl mr-2">₹</Text>
              <TextInput 
                placeholder="0.00"
                keyboardType="numeric"
                className="text-[#1A1A1A] text-5xl"
                style={{ fontFamily: 'Poppins-Bold' }}
                value={amount}
                onChangeText={setAmount}
                autoFocus={true}
              />
           </View>
        </View>

        <View className="p-6">
          {/* Who Paid Section - Only for Group Trips */}
          {trip && trip.tripType !== 'solo' && (
            <View className="mb-8">
              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px] mb-4">Who Paid?</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-2 px-2">
                {/* Owner */}
                <TouchableOpacity 
                  onPress={() => setSelectedPayer(trip.owner._id)}
                  className={`items-center mr-4 p-3 rounded-2xl border-2 ${selectedPayer === trip.owner._id ? 'bg-[#2E3A9D] border-[#2E3A9D]' : 'bg-white border-[#F0F2FA]'}`}
                >
                  <View className={`w-10 h-10 rounded-full items-center justify-center mb-1 ${selectedPayer === trip.owner._id ? 'bg-white/20' : 'bg-[#E0E4F5]'}`}>
                    <User size={20} color={selectedPayer === trip.owner._id ? 'white' : '#2E3A9D'} />
                  </View>
                  <Text style={{ fontFamily: 'Poppins-Bold' }} className={`text-[8px] ${selectedPayer === trip.owner._id ? 'text-white' : 'text-[#444B59]'}`}>You</Text>
                </TouchableOpacity>

                {/* Other Members who have joined */}
                {trip.members.filter(m => m.status === 'joined' && m.user).map((member) => (
                  <TouchableOpacity 
                    key={member.user._id}
                    onPress={() => setSelectedPayer(member.user._id)}
                    className={`items-center mr-4 p-3 rounded-2xl border-2 ${selectedPayer === member.user._id ? 'bg-[#2E3A9D] border-[#2E3A9D]' : 'bg-white border-[#F0F2FA]'}`}
                  >
                    <View className={`w-10 h-10 rounded-full items-center justify-center mb-1 ${selectedPayer === member.user._id ? 'bg-white/20' : 'bg-[#E0E4F5]'}`}>
                      <User size={20} color={selectedPayer === member.user._id ? 'white' : '#2E3A9D'} />
                    </View>
                    <Text style={{ fontFamily: 'Poppins-Bold' }} className={`text-[8px] ${selectedPayer === member.user._id ? 'text-white' : 'text-[#444B59]'}`}>
                      {member.user.name || member.email.split('@')[0]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Category Section */}
          <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px] mb-4">Category</Text>
          <View className="flex-row flex-wrap justify-between mb-6">
             {CATEGORIES.map((cat) => (
               <TouchableOpacity 
                 key={cat.id}
                 onPress={() => setSelectedCategory(cat.id)}
                 className={`w-[31%] aspect-square rounded-xl items-center justify-center mb-3 border-2 ${selectedCategory === cat.id ? 'bg-[#2E3A9D] border-[#2E3A9D]' : 'bg-white border-[#F0F2FA]'}`}
               >
                  <View className={`p-3 rounded-2xl mb-1 ${selectedCategory === cat.id ? 'bg-white/20' : 'bg-[#F8F9FF]'}`}>
                    <cat.icon size={24} color={selectedCategory === cat.id ? 'white' : cat.color} />
                  </View>
                  <Text style={{ fontFamily: 'Poppins-Bold' }} className={`text-[10px] ${selectedCategory === cat.id ? 'text-white' : 'text-[#444B59]'}`}>{cat.name}</Text>
               </TouchableOpacity>
             ))}
          </View>

          {selectedCategory === 'Others' && (
            <View className="mb-6">
               <View className="bg-white border border-[#2E3A9D] rounded-2xl px-4 py-4 shadow-sm">
                  <TextInput 
                    placeholder="Enter category name (e.g., Gifts)"
                    className="text-[#1A1A1A] text-sm"
                    style={{ fontFamily: 'Poppins-SemiBold' }}
                    value={customCategory}
                    onChangeText={setCustomCategory}
                  />
               </View>
            </View>
          )}

          {/* Payment Method */}
          <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px] mb-4">Payment Method</Text>
          <View className="flex-row justify-between mb-8">
             {PAYMENT_METHODS.map((method) => (
               <TouchableOpacity 
                 key={method.id}
                 onPress={() => setPaymentMethod(method.id)}
                 className={`flex-1 flex-row items-center justify-center py-4 rounded-2xl mx-1 border ${paymentMethod === method.id ? 'bg-[#2E3A9D] border-[#2E3A9D]' : 'bg-white border-[#E0E4F5]'}`}
               >
                  <method.icon size={16} color={paymentMethod === method.id ? 'white' : '#2E3A9D'} />
                  <Text style={{ fontFamily: 'Poppins-Bold' }} className={`ml-2 text-xs ${paymentMethod === method.id ? 'text-white' : 'text-[#2E3A9D]'}`}>{method.name}</Text>
               </TouchableOpacity>
             ))}
          </View>

          {/* Date Picker */}
          <View className="mb-8">
            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px] mb-2">Date</Text>
            <TouchableOpacity 
              onPress={() => setShowDatePicker(true)}
              className="bg-white border border-[#E0E4F5] rounded-2xl px-4 py-4 shadow-sm flex-row items-center"
            >
               <Calendar size={18} color="#2E3A9D" />
               <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="ml-3 text-[#1A1A1A]">
                  {date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
               </Text>
            </TouchableOpacity>
            {showDatePicker && <DateTimePicker value={date} mode="date" onChange={onDateChange} />}
          </View>

          {/* Bill Attachment */}
          <View className="mb-8">
            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px] mb-2">Bill Attachment</Text>
            <TouchableOpacity className="bg-white border border-dashed border-[#2E3A9D] rounded-2xl p-8 items-center justify-center">
               <Camera size={32} color="#2E3A9D" />
               <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-xs mt-2">Take Photo or Upload Bill</Text>
            </TouchableOpacity>
          </View>

          {/* Notes */}
          <View className="mb-10">
            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px] mb-2">Notes</Text>
            <View className="bg-white border border-[#E0E4F5] rounded-2xl px-4 py-4 shadow-sm h-32">
               <TextInput 
                 placeholder="What was this for?"
                 multiline textAlignVertical="top"
                 className="flex-1 text-[#1A1A1A] text-sm"
                 style={{ fontFamily: 'Poppins-Regular' }}
                 value={note}
                 onChangeText={setNote}
               />
            </View>
          </View>

          <TouchableOpacity 
            onPress={handleSaveExpense}
            disabled={loading}
            className="bg-[#2E3A9D] py-5 rounded-xl flex-row items-center justify-center shadow-lg shadow-blue-500/50 mb-10"
          >
             {loading ? (
               <ActivityIndicator color="white" />
             ) : (
               <View className="flex-row items-center justify-center">
                 <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-lg mr-2">{buttonTitle}</Text>
                 <Save size={20} color="white" />
               </View>
             )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddTripExpenseScreen;
