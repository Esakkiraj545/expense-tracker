import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { ChevronLeft, Info, Landmark, QrCode, Wallet, CheckCircle2, DollarSign } from 'lucide-react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const SettleUpScreen = ({ route, navigation }) => {
  const { debt } = route.params || {};
  const [amount, setAmount] = useState(debt?.remainingAmount !== undefined ? debt.remainingAmount.toString() : debt?.amount?.toString() || '');
  const [method, setMethod] = useState('UPI');
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState('');

  if (!debt) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>No debt record found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} className="mt-4 p-2 bg-[#2E3A9D] rounded-xl">
            <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleConfirm = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    const remaining = debt.remainingAmount !== undefined ? debt.remainingAmount : debt.amount;
    if (parseFloat(amount) > remaining) {
      Alert.alert('Error', 'Amount exceeds remaining balance');
      return;
    }

    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/debts/${debt._id}/pay`, {
        amount: parseFloat(amount),
        paymentMethod: method,
        note
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const updatedDebt = response.data.data;
        Alert.alert(
          'Success', 
          updatedDebt.status === 'Settled' ? 'Debt fully settled!' : `Payment recorded. Remaining: ₹${updatedDebt.remainingAmount}`,
          [{ text: 'OK', onPress: () => navigation.navigate('Main', { screen: 'Debts' }) }]
        );
      }
    } catch (error) {
      console.log('Error recording payment details:', error.response?.data);
      const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Failed to record payment. Please check your network or try again.';
      Alert.alert('Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-[#F8F9FF]"
    >
      {/* Header */}
      <View className="px-6 pt-14 pb-4 bg-white flex-row items-center border-b border-[#F0F2FA]">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <ChevronLeft size={24} color="#2E3A9D" />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-lg ml-2">Record Payment</Text>
      </View>

      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        {/* Debt Info Card */}
        <View className="bg-[#4151C3] rounded-[32px] p-8 mb-8 shadow-lg shadow-blue-500/30">
           <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white/60 text-[10px] uppercase tracking-[1px] mb-2">Settling with</Text>
           <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-2xl mb-4">{debt.personName}</Text>
           <View className="flex-row items-center justify-between border-t border-white/10 pt-4">
              <View>
                <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-white/60 text-[10px]">Total Original</Text>
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-lg">₹{(debt.amount || 0).toLocaleString()}</Text>
              </View>
              <View className="items-end">
                <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-white/60 text-[10px]">Current Pending</Text>
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-lg">₹{(debt.remainingAmount !== undefined ? debt.remainingAmount : debt.amount || 0).toLocaleString()}</Text>
              </View>
           </View>
        </View>

        {/* Amount Input */}
        <View className="bg-white rounded-[32px] p-6 mb-8 border border-[#F0F2FA] shadow-sm">
           <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px] mb-4">Payment Amount</Text>
           <View className="flex-row items-center border-b border-[#F0F2FA] pb-4">
              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-3xl mr-2">₹</Text>
              <TextInput 
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                keyboardType="numeric"
                className="text-[#2E3A9D] text-4xl flex-1"
                style={{ fontFamily: 'Poppins-Bold' }}
              />
              <TouchableOpacity 
                onPress={() => setAmount((debt.remainingAmount !== undefined ? debt.remainingAmount : debt.amount).toString())}
                className="bg-[#E8EBF8] px-3 py-1.5 rounded-lg"
              >
                 <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-[10px]">FULL</Text>
              </TouchableOpacity>
           </View>
           
           <View className="mt-6">
              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase mb-2">Note (Optional)</Text>
              <TextInput 
                value={note}
                onChangeText={setNote}
                placeholder="E.g. Partial pay for dinner"
                className="text-[#1A1A1A] border border-[#F0F2FA] rounded-xl px-4 py-3 bg-[#FBFBFF]"
                style={{ fontFamily: 'Poppins-Regular' }}
              />
           </View>
        </View>

        {/* Payment Method */}
        <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-lg mb-6">Payment Method</Text>
        <View className="flex-row justify-between mb-12">
           {[
             { id: 'UPI', name: 'UPI', icon: QrCode },
             { id: 'CASH', name: 'CASH', icon: Wallet },
             { id: 'BANK', name: 'BANK', icon: Landmark },
           ].map((m) => (
             <TouchableOpacity 
               key={m.id}
               onPress={() => setMethod(m.id)}
               className={`w-[31%] py-5 rounded-2xl items-center border ${method === m.id ? 'bg-[#2E3A9D] border-[#2E3A9D]' : 'bg-white border-[#E0E4F5]'}`}
             >
                <m.icon size={20} color={method === m.id ? 'white' : '#8A94A6'} />
                <Text style={{ fontFamily: 'Poppins-Bold' }} className={`text-[8px] mt-2 ${method === m.id ? 'text-white' : '#8A94A6'}`}>{m.name}</Text>
             </TouchableOpacity>
           ))}
        </View>

        {/* Confirm Button */}
        <TouchableOpacity 
          onPress={handleConfirm}
          disabled={loading}
          className="bg-[#2E3A9D] py-5 rounded-[24px] flex-row items-center justify-center shadow-lg shadow-blue-500/50 mb-6"
        >
           {loading ? (
             <ActivityIndicator color="white" />
           ) : (
             <>
               <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-lg mr-2">Confirm Payment</Text>
               <CheckCircle2 size={20} color="white" />
             </>
           )}
        </TouchableOpacity>

        <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-[#8A94A6] text-[10px] text-center px-10 mb-10">
           Transactions are recorded but not physically processed through the app.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SettleUpScreen;
