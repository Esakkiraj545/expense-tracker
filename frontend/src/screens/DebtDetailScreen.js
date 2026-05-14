import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ChevronLeft, MoreVertical, ArrowUpRight, ArrowDownLeft, CheckCircle2, History } from 'lucide-react-native';

const DebtDetailScreen = ({ route, navigation }) => {
  const { person } = route.params || { person: { name: 'Arjun J.', initial: 'AJ', given: '₹5,000', pending: '₹3,200', progress: 36 } };

  const history = [
    { id: 1, type: 'repayment', name: 'Partial Repayment', date: 'Oct 20, 2023', amount: '+₹800', positive: true, color: '#4CAF50' },
    { id: 2, type: 'repayment', name: 'Partial Repayment', date: 'Oct 15, 2023', amount: '+₹1,000', positive: true, color: '#4CAF50' },
    { id: 3, type: 'loan', name: 'Initial Loan', date: 'Oct 10, 2023', amount: '-₹5,000', positive: false, color: '#FF5252' },
  ];

  return (
    <View className="flex-1 bg-[#F8F9FF]">
      {/* Header */}
      <View className="px-6 pt-14 pb-4 flex-row justify-between items-center bg-white border-b border-[#F0F2FA]">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#2E3A9D" />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-lg">{person.name}</Text>
        <TouchableOpacity>
          <MoreVertical size={24} color="#2E3A9D" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        {/* Profile Summary Card */}
        <View className="bg-white rounded-[40px] p-8 shadow-sm border border-[#F0F2FA] relative overflow-hidden mb-8">
           <View className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#2E3A9D]" />
           <View className="flex-row items-center mb-8">
              <View className="w-16 h-16 rounded-full bg-[#E8EBF8] items-center justify-center mr-4 border-2 border-white shadow-sm">
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-xl">{person.initial}</Text>
              </View>
              <View>
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-2xl">{person.name}</Text>
                <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-[#8A94A6] text-xs">Debt Summary</Text>
              </View>
           </View>

           <View className="flex-row justify-between mb-8">
              <View>
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px] mb-1">Total Given</Text>
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-2xl">{person.given}</Text>
              </View>
              <View className="items-end">
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px] mb-1">Remaining</Text>
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#FF5252] text-2xl">{person.pending}</Text>
              </View>
           </View>

           <View className="flex-row justify-between items-center mb-2">
              <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-[#8A94A6] text-[10px]">Payoff Progress</Text>
              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-[10px]">{person.progress}%</Text>
           </View>
           <View className="h-2 bg-[#F0F2FA] rounded-full w-full overflow-hidden">
              <View style={{ width: `${person.progress}%` }} className="h-full bg-[#2E3A9D]" />
           </View>
        </View>

        {/* Transaction History */}
        <View className="flex-row justify-between items-center mb-6">
          <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-lg">Transaction History</Text>
          <TouchableOpacity><History size={20} color="#8A94A6" /></TouchableOpacity>
        </View>

        <View className="mb-32">
          {history.map((item) => (
            <View key={item.id} className="bg-white rounded-[24px] p-4 mb-4 flex-row items-center border border-[#F0F2FA]">
               <View style={{ backgroundColor: item.color, position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, borderRadius: 2 }} />
               <View style={{ backgroundColor: item.positive ? '#E8F5E9' : '#FFE5E5' }} className="p-3 rounded-2xl mr-4 ml-1">
                 {item.positive ? <CheckCircle2 size={20} color="#4CAF50" /> : <ArrowUpRight size={20} color="#FF5252" />}
               </View>
               <View className="flex-1">
                 <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-sm">{item.name}</Text>
                 <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-[#8A94A6] text-[10px]">{item.date}</Text>
               </View>
               <Text style={{ fontFamily: 'Poppins-Bold' }} className={`text-sm ${item.positive ? 'text-[#4CAF50]' : 'text-[#FF5252]'}`}>
                 {item.amount}
               </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Footer Actions */}
      <View className="p-6 bg-[#F8F9FF] absolute bottom-0 left-0 right-0">
        <TouchableOpacity className="bg-[#2E3A9D] py-4 rounded-[24px] items-center mb-4 flex-row justify-center shadow-lg shadow-blue-500/50">
           <History size={18} color="white" />
           <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-base ml-2">Record Repayment</Text>
        </TouchableOpacity>
        <TouchableOpacity className="border border-[#2E3A9D] py-4 rounded-[24px] items-center bg-white">
           <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-base">Settle Full Debt</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DebtDetailScreen;
