import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, Switch, Alert } from 'react-native';
import { X, ArrowUpRight, ArrowDownLeft, User, FileText, Calendar, Wallet, Bell } from 'lucide-react-native';


const AddDebtScreen = ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Lent'); // Lent or Borrowed
  const [reminderEnabled, setReminderEnabled] = useState(true);

  const handleSave = () => {
    if (!amount) {
      Alert.alert('Error', 'Please enter an amount');
      return;
    }
    Alert.alert('Success', 'Debt recorded successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-[#F8F9FF]"
    >
      {/* Header */}
      <View className="px-6 pt-14 pb-4 bg-white flex-row items-center border-b border-[#F0F2FA]">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <X size={24} color="#2E3A9D" />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-lg">Add Debt</Text>
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
          <View className="flex-row bg-[#F0F2FA] p-1 rounded-2xl mb-8">
            <TouchableOpacity 
              onPress={() => setType('Lent')}
              className={`flex-1 flex-row items-center justify-center py-3 rounded-xl ${type === 'Lent' ? 'bg-[#2E3A9D]' : ''}`}
            >
              <ArrowUpRight size={18} color={type === 'Lent' ? 'white' : '#8A94A6'} />
              <Text style={{ fontFamily: 'Poppins-SemiBold' }} className={`ml-2 text-xs ${type === 'Lent' ? 'text-white' : 'text-[#8A94A6]'}`}>I Lent</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setType('Borrowed')}
              className={`flex-1 flex-row items-center justify-center py-3 rounded-xl ${type === 'Borrowed' ? 'bg-[#2E3A9D]' : ''}`}
            >
              <ArrowDownLeft size={18} color={type === 'Borrowed' ? 'white' : '#8A94A6'} />
              <Text style={{ fontFamily: 'Poppins-SemiBold' }} className={`ml-2 text-xs ${type === 'Borrowed' ? 'text-white' : 'text-[#8A94A6]'}`}>I Borrowed</Text>
            </TouchableOpacity>
          </View>

          {/* Form Card */}
          <View className="bg-white rounded-[32px] p-6 shadow-sm border border-[#F0F2FA] mb-6">
            <View className="mb-6">
              <View className="flex-row items-center mb-2">
                <User size={14} color="#8A94A6" />
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase ml-2">Who is this with?</Text>
              </View>
              <View className="flex-row items-center border border-[#E0E4F5] rounded-2xl px-4 py-3 bg-[#FBFBFF]">
                <TextInput placeholder="Enter name or select contact" className="flex-1 text-[#2E3A9D]" style={{ fontFamily: 'Poppins-Regular' }} />
                <TouchableOpacity><Wallet size={20} color="#2E3A9D" /></TouchableOpacity>
              </View>
            </View>

            <View className="mb-6">
              <View className="flex-row items-center mb-2">
                <FileText size={14} color="#8A94A6" />
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase ml-2">Purpose / Notes</Text>
              </View>
              <View className="border border-[#E0E4F5] rounded-2xl px-4 py-3 bg-[#FBFBFF] h-24">
                <TextInput placeholder="What is this for?" multiline className="text-[#2E3A9D]" style={{ fontFamily: 'Poppins-Regular' }} />
              </View>
            </View>

            <View className="flex-row justify-between mb-6">
              <View style={{ width: '48%' }}>
                <View className="flex-row items-center mb-2">
                  <Calendar size={14} color="#8A94A6" />
                  <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase ml-2">Date</Text>
                </View>
                <View className="border border-[#E0E4F5] rounded-2xl px-4 py-3 bg-[#FBFBFF]">
                  <TextInput placeholder="mm/dd/yyyy" className="text-[#2E3A9D]" style={{ fontFamily: 'Poppins-Regular' }} />
                </View>
              </View>
              <View style={{ width: '48%' }}>
                <View className="flex-row items-center mb-2">
                  <Wallet size={14} color="#8A94A6" />
                  <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase ml-2">Via Method</Text>
                </View>
                <View className="border border-[#E0E4F5] rounded-2xl px-4 py-3 bg-[#FBFBFF]">
                  <TextInput placeholder="Cash" className="text-[#2E3A9D]" style={{ fontFamily: 'Poppins-Regular' }} />
                </View>
              </View>
            </View>

            <View className="flex-row space-x-2">
               {['UPI', 'Cash', 'Card', 'Bank'].map((m) => (
                 <TouchableOpacity key={m} className="px-4 py-2 border border-[#E0E4F5] rounded-xl mr-2">
                   <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-[10px] text-[#444B59]">{m}</Text>
                 </TouchableOpacity>
               ))}
            </View>
          </View>

          {/* Reminder Section */}
          <View className="bg-white rounded-[32px] p-6 shadow-sm border border-[#F0F2FA] mb-10">
            <View className="flex-row justify-between items-center mb-6">
              <View className="flex-row items-center">
                <View className="bg-[#FFF5E6] p-3 rounded-2xl mr-4">
                  <Bell size={20} color="#FF9900" />
                </View>
                <View>
                  <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-sm">Set Repayment Reminder</Text>
                  <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-[#8A94A6] text-[10px]">Notify me when it's time to settle</Text>
                </View>
              </View>
              <Switch value={reminderEnabled} onValueChange={setReminderEnabled} trackColor={{ true: '#2E3A9D' }} />
            </View>
            {reminderEnabled && (
              <View>
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] mb-2 uppercase">Remind me on</Text>
                <View className="border border-[#E0E4F5] rounded-2xl px-4 py-3 bg-[#FBFBFF]">
                  <TextInput placeholder="06/25/2024" className="text-[#2E3A9D]" style={{ fontFamily: 'Poppins-Regular' }} />
                </View>
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
        <TouchableOpacity onPress={handleSave} className="flex-2 py-4 bg-[#2E3A9D] rounded-3xl items-center px-10 shadow-lg shadow-blue-500/50">
          <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-base">Save Debt</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddDebtScreen;
