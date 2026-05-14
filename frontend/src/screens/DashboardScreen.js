import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Bell, ChevronDown, Utensils, Car, FileText, LayoutGrid, Wallet, CreditCard, Plane, User } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const DashboardScreen = () => {
  return (
    <View className="flex-1 bg-[#F8F9FF]">
      {/* Header */}
      <View className="px-6 pt-14 pb-6 bg-white flex-row justify-between items-center">
        <View className="flex-row items-center">
          <View className="w-10 h-10 rounded-full bg-[#2E3A9D] items-center justify-center mr-3">
            <User size={20} color="white" />
          </View>
          <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-[#2E3A9D] text-lg">
            Hi, Aryan
          </Text>
        </View>
        <TouchableOpacity className="p-2 border border-[#E0E4F5] rounded-xl">
          <Bell size={20} color="#2E3A9D" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Summary Cards */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-6 -mx-6 px-6">
          <View className="bg-[#4151C3] w-[260px] rounded-[24px] p-6 mr-4 relative overflow-hidden">
            <View className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#FF5252]" />
            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white/60 text-[10px] tracking-[1px] uppercase mb-2">
              This Month Spent
            </Text>
            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-3xl mb-4">
              ₹12,450
            </Text>
            <View className="bg-white/20 self-start px-3 py-1 rounded-full flex-row items-center">
              <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-white text-[10px]">
                ↗ 8% vs last month
              </Text>
            </View>
          </View>

          <View className="bg-[#E8EBF8] w-[260px] rounded-[24px] p-6 relative overflow-hidden">
            <View className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#4CAF50]" />
            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D]/60 text-[10px] tracking-[1px] uppercase mb-2">
              Savings
            </Text>
            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-3xl mb-4">
              ₹7,500
            </Text>
            <View className="h-1 bg-[#2E3A9D]/10 rounded-full w-full overflow-hidden">
              <View className="h-full bg-[#2E3A9D] w-[60%]" />
            </View>
          </View>
        </ScrollView>

        {/* Daily Activity */}
        <View className="bg-white rounded-[32px] p-6 mt-8 shadow-sm">
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-lg">Daily Activity</Text>
              <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-[#8A94A6] text-xs">Your spending across the week</Text>
            </View>
            <TouchableOpacity className="bg-[#F0F2FA] px-4 py-2 rounded-xl flex-row items-center">
              <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-[#2E3A9D] text-[10px] uppercase mr-2">Weekly</Text>
              <ChevronDown size={14} color="#2E3A9D" />
            </TouchableOpacity>
          </View>
          
          {/* Chart Placeholder */}
          <View className="h-20 flex-row items-end justify-between px-2 mb-2">
            {[40, 60, 45, 80, 50, 70, 60].map((h, i) => (
              <View key={i} style={{ height: h, width: 8 }} className="bg-[#E8EBF8] rounded-full" />
            ))}
          </View>
          <View className="flex-row justify-between px-1">
            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((d, i) => (
              <Text key={i} style={{ fontFamily: 'Poppins-SemiBold' }} className="text-[#8A94A6] text-[8px]">{d}</Text>
            ))}
          </View>
        </View>

        {/* Smart Insight */}
        <View className="bg-[#4151C3] rounded-[32px] p-6 mt-8 relative overflow-hidden">
          <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-xl mb-2">Smart Insight</Text>
          <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-white/80 text-xs mb-6">
            You spent 12% more on food this week. Try cooking at home to save ₹1,200.
          </Text>
          <TouchableOpacity className="bg-white py-4 rounded-2xl items-center">
            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-xs uppercase tracking-[1px]">View Report</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Transactions */}
        <View className="mt-8 mb-32">
          <View className="flex-row justify-between items-center mb-6">
            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-lg">Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-[#2E3A9D] text-xs uppercase">See All</Text>
            </TouchableOpacity>
          </View>

          {[
            { icon: Utensils, name: 'Burger King', cat: 'Food & Dining', time: 'Today', amount: '-₹450', color: '#FFF5E6', iconColor: '#FF9900' },
            { icon: Car, name: 'Uber Trip', cat: 'Travel', time: 'Yesterday', amount: '-₹280', color: '#E8F0FF', iconColor: '#2E3A9D' },
            { icon: FileText, name: 'Electricity Bill', cat: 'Bills', time: '2 days ago', amount: '-₹1,200', color: '#E6F7FF', iconColor: '#00A3FF' },
          ].map((item, i) => (
            <View key={i} className="flex-row items-center mb-4 bg-white p-4 rounded-2xl border border-[#F0F2FA]">
              <View style={{ backgroundColor: item.color }} className="p-3 rounded-2xl mr-4">
                <item.icon size={20} color={item.iconColor} />
              </View>
              <View className="flex-1">
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-sm">{item.name}</Text>
                <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-[#8A94A6] text-[10px]">{item.cat} • {item.time}</Text>
              </View>
              <View className="items-end">
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#FF5252] text-sm">{item.amount}</Text>
                <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-[#8A94A6] text-[8px] uppercase">Debit</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};


export default DashboardScreen;
