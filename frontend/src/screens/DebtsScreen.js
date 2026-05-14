import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Bell, Plus, User } from 'lucide-react-native';

const DebtsScreen = ({ navigation }) => {
  const debts = [
    { id: 1, name: 'Arjun J.', initial: 'AJ', lastActive: '2 days ago', given: '₹5,000', pending: '₹3,200', progress: 36, priority: true, color: '#FF5252' },
    { id: 2, name: 'Sana Nair', initial: 'SN', lastActive: '4 hours ago', given: '₹4,000', pending: '₹2,000', progress: 50, priority: false, color: '#FFB300' },
    { id: 3, name: 'Rahul K.', initial: 'RK', lastActive: 'Yesterday', given: '₹3,000', pending: '₹300', progress: 90, priority: false, color: '#4CAF50' },
  ];

  return (
    <View className="flex-1 bg-[#F8F9FF]">
      {/* Header */}
      <View className="px-6 pt-14 pb-6 bg-white flex-row justify-between items-center">
        <View className="flex-row items-center">
          <View className="w-10 h-10 rounded-full bg-[#2E3A9D] items-center justify-center mr-3">
            <User size={20} color="white" />
          </View>
          <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-[#2E3A9D] text-xl">Xpenso</Text>
        </View>
        <TouchableOpacity className="p-2 border border-[#E0E4F5] rounded-xl">
          <Bell size={20} color="#2E3A9D" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Summary Row */}
        <View className="flex-row justify-between mt-6">
          <View className="bg-white rounded-3xl p-5 w-[48%] shadow-sm border border-[#F0F2FA]">
            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px] mb-2">Total Pending</Text>
            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#FF5252] text-2xl">₹8,500</Text>
          </View>
          <View className="bg-white rounded-3xl p-5 w-[48%] shadow-sm border border-[#F0F2FA]">
            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px] mb-2">Total Given</Text>
            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-2xl">₹12,000</Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <View className="flex-row mt-8 bg-[#F0F2FA] p-1 rounded-2xl">
          {['All', 'Pending', 'Settled'].map((tab, i) => (
            <TouchableOpacity key={i} className={`flex-1 py-2.5 rounded-xl items-center ${i === 0 ? 'bg-[#2E3A9D]' : ''}`}>
              <Text style={{ fontFamily: 'Poppins-SemiBold' }} className={`text-xs ${i === 0 ? 'text-white' : 'text-[#8A94A6]'}`}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Debt List */}
        <View className="mt-8 mb-32">
          {debts.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              onPress={() => navigation.navigate('DebtDetail', { person: item })}
              className="bg-white rounded-[32px] p-5 mb-4 shadow-sm border border-[#F0F2FA] flex-row relative overflow-hidden"
            >
              <View style={{ backgroundColor: item.color, position: 'absolute', left: 0, top: 0, bottom: 0, width: 6 }} />
              
              <View className="bg-[#E8EBF8] w-14 h-14 rounded-full items-center justify-center mr-4">
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-lg">{item.initial}</Text>
              </View>

              <View className="flex-1">
                <View className="flex-row justify-between items-start mb-4">
                  <View>
                    <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-lg">{item.name}</Text>
                    <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-[#8A94A6] text-[10px]">Last active: {item.lastActive}</Text>
                  </View>
                  {item.priority && (
                    <View className="bg-[#FFE5E5] px-3 py-1 rounded-lg">
                      <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#FF5252] text-[8px] uppercase">High Priority</Text>
                    </View>
                  )}
                </View>

                <View className="flex-row justify-between mb-4">
                  <View>
                    <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase">Given</Text>
                    <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-base">{item.given}</Text>
                  </View>
                  <View className="items-end">
                    <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase">Pending</Text>
                    <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#FF5252] text-base">{item.pending}</Text>
                  </View>
                </View>

                <View className="flex-row justify-between items-center mb-2">
                  <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-[#8A94A6] text-[10px]">Payoff Progress</Text>
                  <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-[10px]">{item.progress}%</Text>
                </View>
                <View className="h-1.5 bg-[#F0F2FA] rounded-full w-full overflow-hidden">
                  <View style={{ width: `${item.progress}%` }} className="h-full bg-[#2E3A9D]" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
