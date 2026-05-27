import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, Switch, Alert, ActivityIndicator } from 'react-native';
import { X, ArrowUpRight, ArrowDownLeft, User, FileText, Calendar, Wallet, Bell, Check, ChevronRight } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const AddDebtScreen = ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Lent'); // Lent or Borrowed
  const [personName, setPersonName] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date());
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderDate, setReminderDate] = useState(new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)); // Default 1 week later
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showReminderDatePicker, setShowReminderDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const onReminderDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || reminderDate;
    setShowReminderDatePicker(Platform.OS === 'ios');
    setReminderDate(currentDate);
  };

  const handleSave = async () => {
    if (!amount) {
      Alert.alert('Error', 'Please enter an amount');
      return;
    }
    if (!personName) {
      Alert.alert('Error', 'Please enter the person\'s name');
      return;
    }

    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/debts`, {
        personName,
        amount: parseFloat(amount),
        type,
        notes,
        date,
        paymentMethod,
        reminderEnabled,
        reminderDate: reminderEnabled ? reminderDate : null
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        Alert.alert('Success', `${type === 'Lent' ? 'Lent' : 'Borrowed'} record saved!`, [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      console.log('Error saving debt:', error);
      Alert.alert('Error', 'Failed to save debt record. Please try again.');
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
      <View className="px-6 pt-14 pb-4 bg-white flex-row items-center justify-between border-b border-[#F0F2FA]">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <X size={24} color="#2E3A9D" />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-lg">Add Debt</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6">
          {/* Amount Section */}
          <View className="items-center mb-8">
            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[2px] mb-4">Debt Amount</Text>
            <View className="flex-row items-center">
              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-4xl mr-2">₹</Text>
              <TextInput
                placeholder="0.00"
                placeholderTextColor="#D0D5DD"
                keyboardType="numeric"
                className="text-[#2E3A9D] text-5xl"
                style={{ fontFamily: 'Poppins-Bold', minWidth: 100 }}
                value={amount}
                onChangeText={setAmount}
                autoFocus
              />
            </View>
          </View>

          {/* Type Toggle */}
          <View className="flex-row bg-[#F0F2FA] p-1.5 rounded-2xl mb-8">
            <TouchableOpacity 
              onPress={() => setType('Lent')}
              className={`flex-1 flex-row items-center justify-center py-3.5 rounded-xl ${type === 'Lent' ? 'bg-[#2E3A9D]' : ''}`}
            >
              <ArrowUpRight size={18} color={type === 'Lent' ? 'white' : '#8A94A6'} />
              <Text style={{ fontFamily: 'Poppins-SemiBold' }} className={`ml-2 text-xs ${type === 'Lent' ? 'text-white' : 'text-[#8A94A6]'}`}>I Lent</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setType('Borrowed')}
              className={`flex-1 flex-row items-center justify-center py-3.5 rounded-xl ${type === 'Borrowed' ? 'bg-[#2E3A9D]' : ''}`}
            >
              <ArrowDownLeft size={18} color={type === 'Borrowed' ? 'white' : '#8A94A6'} />
              <Text style={{ fontFamily: 'Poppins-SemiBold' }} className={`ml-2 text-xs ${type === 'Borrowed' ? 'text-white' : 'text-[#8A94A6]'}`}>I Borrowed</Text>
            </TouchableOpacity>
          </View>

          {/* Form Card */}
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-[#F0F2FA] mb-6">
            {/* Person Name */}
            <View className="mb-6">
              <View className="flex-row items-center mb-2">
                <User size={14} color="#8A94A6" />
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase ml-2">Who is this with?</Text>
              </View>
              <View className="flex-row items-center border border-[#E0E4F5] rounded-2xl px-4 py-4 bg-[#FBFBFF]">
                <TextInput 
                  placeholder="Enter name" 
                  className="flex-1 text-[#2E3A9D]" 
                  style={{ fontFamily: 'Poppins-SemiBold' }} 
                  value={personName}
                  onChangeText={setPersonName}
                />
                <TouchableOpacity><Wallet size={20} color="#2E3A9D" /></TouchableOpacity>
              </View>
            </View>

            {/* Purpose / Notes */}
            <View className="mb-6">
              <View className="flex-row items-center mb-2">
                <FileText size={14} color="#8A94A6" />
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase ml-2">Purpose / Notes</Text>
              </View>
              <View className="border border-[#E0E4F5] rounded-2xl px-4 py-4 bg-[#FBFBFF] h-28">
                <TextInput 
                  placeholder="What is this for?" 
                  multiline 
                  className="text-[#2E3A9D] h-full" 
                  style={{ fontFamily: 'Poppins-Regular', textAlignVertical: 'top' }} 
                  value={notes}
                  onChangeText={setNotes}
                />
              </View>
            </View>

            {/* Date & Method */}
            <View className="flex-row justify-between mb-6">
              <TouchableOpacity 
                onPress={() => setShowDatePicker(true)}
                style={{ width: '48%' }}
              >
                <View className="flex-row items-center mb-2">
                  <Calendar size={14} color="#8A94A6" />
                  <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase ml-2">Date</Text>
                </View>
                <View className="border border-[#E0E4F5] rounded-2xl px-4 py-3 bg-[#FBFBFF] flex-row justify-between items-center">
                  <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-[#2E3A9D] text-xs">
                    {date.toLocaleDateString()}
                  </Text>
                  <ChevronRight size={14} color="#8A94A6" />
                </View>
              </TouchableOpacity>
              
              <View style={{ width: '48%' }}>
                <View className="flex-row items-center mb-2">
                  <Wallet size={14} color="#8A94A6" />
                  <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase ml-2">Method</Text>
                </View>
                <View className="border border-[#E0E4F5] rounded-2xl px-4 py-3 bg-[#FBFBFF]">
                  <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-[#2E3A9D] text-xs">{paymentMethod}</Text>
                </View>
              </View>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}

            {/* Payment Method Quick Select */}
            <View className="flex-row flex-wrap">
               {['UPI', 'Cash', 'Card', 'Bank'].map((m) => (
                 <TouchableOpacity 
                    key={m} 
                    onPress={() => setPaymentMethod(m)}
                    className={`px-4 py-2 border rounded-xl mr-2 mb-2 ${paymentMethod === m ? 'bg-[#2E3A9D] border-[#2E3A9D]' : 'border-[#E0E4F5] bg-white'}`}
                 >
                   <Text style={{ fontFamily: 'Poppins-SemiBold' }} className={`text-[10px] ${paymentMethod === m ? 'text-white' : 'text-[#444B59]'}`}>{m}</Text>
                 </TouchableOpacity>
               ))}
            </View>
          </View>

          {/* Reminder Section */}
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-[#F0F2FA] mb-10">
            <View className="flex-row justify-between items-center mb-6">
              <View className="flex-row items-center flex-1">
                <View className="bg-[#FFF5E6] p-3 rounded-2xl mr-4">
                  <Bell size={20} color="#FF9900" />
                </View>
                <View className="flex-1">
                  <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-sm">Set Repayment Reminder</Text>
                  <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-[#8A94A6] text-[10px]">Notify me when it's time to settle</Text>
                </View>
              </View>
              <Switch 
                value={reminderEnabled} 
                onValueChange={setReminderEnabled} 
                trackColor={{ true: '#2E3A9D', false: '#F0F2FA' }} 
                thumbColor={reminderEnabled ? '#FFFFFF' : '#8A94A6'}
              />
            </View>
            
            {reminderEnabled && (
              <View>
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] mb-2 uppercase">Remind me on</Text>
                <TouchableOpacity 
                  onPress={() => setShowReminderDatePicker(true)}
                  className="border border-[#E0E4F5] rounded-2xl px-4 py-4 bg-[#FBFBFF] flex-row justify-between items-center"
                >
                  <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-[#2E3A9D]">
                    {reminderDate.toLocaleDateString()}
                  </Text>
                  <Calendar size={18} color="#2E3A9D" />
                </TouchableOpacity>
                {showReminderDatePicker && (
                  <DateTimePicker
                    value={reminderDate}
                    mode="date"
                    display="default"
                    minimumDate={new Date()}
                    onChange={onReminderDateChange}
                  />
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View className="p-6 bg-white border-t border-[#F0F2FA] flex-row">
        <TouchableOpacity onPress={() => navigation.goBack()} className="flex-1 py-4 items-center">
          <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-base">Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={handleSave} 
          disabled={loading}
          className="flex-[2] py-4 bg-[#2E3A9D] rounded-xl items-center px-10 shadow-lg shadow-blue-500/50 flex-row justify-center"
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <>
              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-base mr-2">Save Debt</Text>
              <Check size={20} color="white" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddDebtScreen;
