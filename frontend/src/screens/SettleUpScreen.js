import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { ChevronLeft, MoreVertical, Info, Landmark, QrCode, Wallet, CheckCircle2, User } from 'lucide-react-native';

const SettleUpScreen = ({ navigation }) => {
  const [method, setMethod] = useState('BANK');

  const participants = [
    { id: 1, name: 'Sarah Jenkins', amount: 'You owe $150.00', action: 'PAY', color: '#FF5252' },
    { id: 2, name: 'Marcus Chen', amount: 'You owe $80.00', action: 'PAY', color: '#FF5252' },
    { id: 3, name: 'Elena Rodriguez', amount: 'Owes you $45.00', action: 'SETTLE', color: '#4CAF50' },
  ];

  const handleConfirm = () => {
    Alert.alert('Settlement Recorded', 'Your transactions have been recorded successfully.', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <View className="flex-1 bg-[#F8F9FF]">
      {/* Header */}
      <View className="px-6 pt-14 pb-4 bg-white flex-row justify-between items-center border-b border-[#F0F2FA]">
        <TouchableOpacity onPress={() => navigation.goBack()} className="flex-row items-center">
          <ChevronLeft size={24} color="#2E3A9D" />
          <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-lg ml-2">Settle Up</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <MoreVertical size={24} color="#2E3A9D" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        {/* Balance Card */}
        <View className="bg-[#4151C3] rounded-[32px] p-8 mb-10 shadow-lg shadow-blue-500/30">
           <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white/60 text-[10px] uppercase tracking-[1px] mb-2">Total Net Balance</Text>
           <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-3xl mb-4">You owe $230.00 total</Text>
           <View className="flex-row items-center">
              <Info size={14} color="rgba(255,255,255,0.6)" />
              <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-white/60 text-[10px] ml-2">Across 4 active trip participants</Text>
           </View>
        </View>

        {/* Participants List */}
        <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-lg mb-6">Participants</Text>
        <View className="mb-10">
           {participants.map((p) => (
             <View key={p.id} className="bg-white rounded-3xl p-4 mb-4 flex-row items-center border border-[#F0F2FA] relative overflow-hidden">
                <View style={{ backgroundColor: p.color, position: 'absolute', left: 0, top: 0, bottom: 0, width: 4 }} />
                <View className="w-12 h-12 rounded-full bg-[#E0E4F5] items-center justify-center mr-4 ml-1">
                   <User size={20} color="#2E3A9D" />
                </View>
                <View className="flex-1">
                   <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-sm">{p.name}</Text>
                   <Text style={{ fontFamily: 'Poppins-Bold' }} className={`text-[10px]`} style={{ color: p.color }}>{p.amount}</Text>
                </View>
                <TouchableOpacity className={`px-5 py-2 rounded-xl ${p.action === 'PAY' ? 'bg-[#2E3A9D]' : 'border border-[#E0E4F5]'}`}>
                   <Text style={{ fontFamily: 'Poppins-Bold' }} className={`text-[8px] ${p.action === 'PAY' ? 'text-white' : 'text-[#2E3A9D]'}`}>{p.action}</Text>
                </TouchableOpacity>
             </View>
           ))}
        </View>

        {/* Payment Method */}
        <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-lg mb-6">Payment Method</Text>
        <View className="flex-row justify-between mb-12">
           {[
             { id: 'BANK', name: 'BANK', icon: Landmark },
             { id: 'UPI', name: 'UPI', icon: QrCode },
             { id: 'CASH', name: 'CASH', icon: Wallet },
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
          className="bg-[#2E3A9D] py-5 rounded-[24px] flex-row items-center justify-center shadow-lg shadow-blue-500/50 mb-6"
        >
           <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-lg mr-2">Confirm Settlement</Text>
           <CheckCircle2 size={20} color="white" />
        </TouchableOpacity>

        <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-[#8A94A6] text-[10px] text-center px-10">
           Transactions are recorded but not physically processed through the app.
        </Text>
      </ScrollView>
    </View>
  );
};

export default SettleUpScreen;
