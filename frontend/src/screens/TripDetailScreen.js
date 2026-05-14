import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { ChevronLeft, Bell, MoreVertical, Utensils, Home, Car, Play, PieChart, User, Plus } from 'lucide-react-native';


const { width } = Dimensions.get('window');

const TripDetailScreen = ({ route, navigation }) => {
  const { trip } = route.params || { trip: { name: 'Goa Getaway' } };

  return (
    <View className="flex-1 bg-[#F8F9FF]">
      {/* Header */}
      <View className="px-6 pt-14 pb-4 bg-white flex-row justify-between items-center z-10">
        <TouchableOpacity onPress={() => navigation.goBack()} className="flex-row items-center">
          <ChevronLeft size={24} color="#2E3A9D" />
          <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-lg ml-2">{trip.name}</Text>
        </TouchableOpacity>
        <View className="flex-row items-center">
           <TouchableOpacity className="mr-4"><Bell size={24} color="#2E3A9D" /></TouchableOpacity>
           <TouchableOpacity className="w-8 h-8 rounded-full bg-[#E0E4F5] items-center justify-center">
              <User size={16} color="#2E3A9D" />
           </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View className="h-56">
           <Image 
             source={{ uri: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=500' }} 
             className="w-full h-full"
           />
           <View className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
              <View className="bg-[#4CAF50] self-start px-3 py-1 rounded-full mb-2">
                 <Text className="text-white text-[8px] font-bold uppercase">Active • Oct 12 - Oct 18</Text>
              </View>
              <View className="flex-row justify-between items-end">
                 <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-3xl">{trip.name}</Text>
                 <TouchableOpacity 
                   onPress={() => navigation.navigate('SettleUp')}
                   className="bg-[#2E3A9D] px-6 py-2 rounded-full"
                 >
                    <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-[10px] uppercase">Settle Up</Text>
                 </TouchableOpacity>
              </View>
           </View>
        </View>

        <View className="p-6">
          <View className="flex-row justify-between mb-8">
             {/* Budget Utilization */}
             <View className="bg-white rounded-3xl p-5 w-[48%] border border-[#F0F2FA] shadow-sm">
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[8px] uppercase mb-2">Budget Utilization</Text>
                <View className="flex-row items-center justify-between">
                   <View>
                      <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-lg">$1,420.00</Text>
                      <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-[#8A94A6] text-[8px]">/ $2,000.00</Text>
                   </View>
                   <View className="w-10 h-10 rounded-full border-4 border-[#2E3A9D] items-center justify-center">
                      <Text className="text-[#2E3A9D] text-[8px] font-bold">71%</Text>
                   </View>
                </View>
                <View className="h-1.5 bg-[#F0F2FA] rounded-full mt-3 overflow-hidden">
                   <View style={{ width: '71%' }} className="h-full bg-[#2E3A9D]" />
                </View>
             </View>

             {/* Who Paid What */}
             <View className="bg-white rounded-3xl p-5 w-[48%] border border-[#F0F2FA] shadow-sm">
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-[10px] mb-3">Who Paid What</Text>
                <View className="space-y-3">
                   {[
                     { name: 'Alex', amount: '+$550.00', color: '#4CAF50' },
                     { name: 'Sarah', amount: '-$150.00', color: '#FF5252' },
                     { name: 'David', amount: '-$50.00', color: '#FF5252' },
                   ].map((p, i) => (
                     <View key={i} className="flex-row justify-between items-center mb-2">
                        <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-[#444B59] text-[9px]">{p.name}</Text>
                        <Text style={{ fontFamily: 'Poppins-Bold' }} className={`text-[9px]`} style={{ color: p.color }}>{p.amount}</Text>
                     </View>
                   ))}
                </View>
                <TouchableOpacity className="border border-[#E0E4F5] rounded-lg py-1.5 mt-2 items-center">
                   <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-[8px] uppercase">Settle All Debts</Text>
                </TouchableOpacity>
             </View>
          </View>

          {/* Category Summary */}
          <View className="flex-row flex-wrap justify-between mb-8">
             {[
               { name: 'Food', icon: Utensils, amount: '$450.00', color: '#E8EBF8' },
               { name: 'Stay', icon: Home, amount: '$680.00', color: '#E8F0FF' },
               { name: 'Transport', icon: Car, amount: '$190.00', color: '#E6F7FF' },
               { name: 'Fun', icon: Play, amount: '$100.00', color: '#FFF5E6' },
             ].map((cat, i) => (
               <View key={i} style={{ width: '48%' }} className="bg-white rounded-2xl p-4 mb-4 border border-[#F0F2FA] flex-row items-center">
                  <View style={{ backgroundColor: cat.color }} className="p-2 rounded-xl mr-3">
                     <cat.icon size={16} color="#2E3A9D" />
                  </View>
                  <View>
                     <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-[#8A94A6] text-[8px]">{cat.name}</Text>
                     <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-xs">{cat.amount}</Text>
                  </View>
               </View>
             ))}
          </View>

          <View className="flex-row justify-between mb-8">
             {/* Recent Expenses */}
             <View style={{ width: '60%' }}>
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-sm mb-4">Recent Expenses</Text>
                {[
                  { name: 'Dinner at Thalassa', date: 'Oct 14 • Paid by Alex', amount: '$124.50', icon: Utensils },
                  { name: 'Scooter Rental', date: 'Oct 14 • Paid by David', amount: '$45.00', icon: Car },
                  { name: 'Souvenirs', date: 'Oct 13 • Paid by Sarah', amount: '$82.00', icon: Play },
                ].map((exp, i) => (
                  <View key={i} className="flex-row items-center bg-white rounded-2xl p-3 mb-3 border border-[#F0F2FA]">
                     <View className="bg-[#F0F2FA] p-2 rounded-xl mr-3">
                        <exp.icon size={16} color="#2E3A9D" />
                     </View>
                     <View className="flex-1">
                        <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-[9px]">{exp.name}</Text>
                        <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-[#8A94A6] text-[7px]">{exp.date}</Text>
                     </View>
                     <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-[9px]">{exp.amount}</Text>
                  </View>
                ))}
             </View>

             {/* Savings Card */}
             <View style={{ width: '35%' }} className="bg-[#2E3A9D] rounded-3xl p-5 justify-between">
                <View>
                   <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white/60 text-[8px] uppercase">Trip Savings</Text>
                   <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-xl mb-1">$580.00</Text>
                   <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-xs">Remaining</Text>
                </View>
                <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-white/70 text-[7px] mt-4">You are currently under budget by 29%. Great job on managing expenses!</Text>
             </View>
          </View>
        </View>
      </ScrollView>
      
      {/* FAB */}
      <TouchableOpacity className="absolute bottom-10 right-8 w-14 h-14 bg-[#2E3A9D] rounded-full items-center justify-center shadow-xl shadow-blue-900">
         <Plus size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default TripDetailScreen;
