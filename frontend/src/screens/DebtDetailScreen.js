import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ChevronLeft, MoreVertical, ArrowUpRight, ArrowDownLeft, CheckCircle2, History, Wallet } from 'lucide-react-native';

const DebtDetailScreen = ({ route, navigation }) => {
  const { debt } = route.params || {};

  if (!debt) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Debt record not found</Text>
      </View>
    );
  }

  const getInitial = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '??';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Construct history from payments and the initial record
  const paymentHistory = debt.payments ? debt.payments.map((p, index) => ({
    id: `pay-${index}`,
    type: 'repayment',
    name: p.note || 'Partial Repayment',
    date: formatDate(p.date),
    method: p.paymentMethod, // Added method
    amount: `+₹${(p.amount || 0).toLocaleString()}`,
    positive: true,
    color: '#4CAF50'
  })) : [];

  const initialRecord = {
    id: 'initial',
    type: debt.type === 'Lent' ? 'loan' : 'borrow',
    name: debt.type === 'Lent' ? 'Initial Loan' : 'Money Borrowed',
    date: formatDate(debt.date),
    method: debt.paymentMethod, // Added method
    amount: `${debt.type === 'Lent' ? '-' : '+'}₹${(debt.amount || 0).toLocaleString()}`,
    positive: debt.type === 'Borrowed',
    color: debt.type === 'Lent' ? '#FF5252' : '#4CAF50'
  };

  const history = [initialRecord, ...paymentHistory.reverse()];

  const payoffProgress = debt.amount > 0 
    ? Math.round(((debt.amount - debt.remainingAmount) / debt.amount) * 100) 
    : 100;

  return (
    <View className="flex-1 bg-[#F8F9FF]">
      {/* Header */}
      <View className="px-6 pt-14 pb-4 flex-row justify-between items-center bg-white border-b border-[#F0F2FA]">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#2E3A9D" />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-lg">Details</Text>
        <TouchableOpacity>
          <MoreVertical size={24} color="#2E3A9D" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        {/* Profile Summary Card */}
        <View className="bg-white rounded-[40px] p-8 shadow-sm border border-[#F0F2FA] relative overflow-hidden mb-8">
           <View 
             style={{ backgroundColor: debt.type === 'Lent' ? '#2E3A9D' : '#FF5252' }} 
             className="absolute left-0 top-0 bottom-0 w-1.5" 
           />
           <View className="flex-row items-center mb-8">
              <View className="w-16 h-16 rounded-full bg-[#E8EBF8] items-center justify-center mr-4 border-2 border-white shadow-sm">
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-xl">{getInitial(debt.personName)}</Text>
              </View>
              <View>
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-2xl">{debt.personName}</Text>
                <View className="flex-row items-center">
                   <View className={`w-2 h-2 rounded-full mr-2 ${debt.status === 'Settled' ? 'bg-[#4CAF50]' : 'bg-[#FF9900]'}`} />
                   <Text style={{ fontFamily: 'Poppins-SemiBold' }} className={`text-[10px] ${debt.status === 'Settled' ? 'text-[#4CAF50]' : 'text-[#FF9900]'}`}>
                      {debt.status}
                   </Text>
                </View>
              </View>
           </View>

           <View className="flex-row justify-between mb-6">
              <View>
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px] mb-1">Total</Text>
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-xl">₹{(debt.amount || 0).toLocaleString()}</Text>
              </View>
              <View className="items-end">
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px] mb-1">Remaining</Text>
                <Text style={{ fontFamily: 'Poppins-Bold' }} className={`text-xl ${((debt.remainingAmount !== undefined ? debt.remainingAmount : debt.amount) || 0) > 0 ? 'text-[#FF5252]' : 'text-[#4CAF50]'}`}>
                    ₹{((debt.remainingAmount !== undefined ? debt.remainingAmount : debt.amount) || 0).toLocaleString()}
                </Text>
              </View>
           </View>

           <View className="flex-row justify-between items-center mb-2">
              <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-[#8A94A6] text-[10px]">Payoff Progress</Text>
              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-[10px]">{payoffProgress}%</Text>
           </View>
           <View className="h-2 bg-[#F0F2FA] rounded-full w-full overflow-hidden">
              <View style={{ width: `${payoffProgress}%` }} className="h-full bg-[#2E3A9D]" />
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
                 <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-sm" numberOfLines={1}>{item.name}</Text>
                 <View className="flex-row items-center">
                   <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-[#8A94A6] text-[10px]">{item.date}</Text>
                   {item.method && (
                     <View className="bg-[#F0F2FA] px-2 py-0.5 rounded-md ml-2">
                       <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-[8px] uppercase">{item.method}</Text>
                     </View>
                   )}
                 </View>
               </View>
               <Text style={{ fontFamily: 'Poppins-Bold' }} className={`text-sm ${item.positive ? 'text-[#4CAF50]' : 'text-[#FF5252]'}`}>
                 {item.amount}
               </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Footer Actions */}
      {debt.status !== 'Settled' && (
        <View className="p-6 bg-white border-t border-[#F0F2FA] absolute bottom-0 left-0 right-0">
          <TouchableOpacity 
            onPress={() => navigation.navigate('SettleUp', { debt })}
            className="bg-[#2E3A9D] py-4 rounded-[24px] items-center mb-4 flex-row justify-center shadow-lg shadow-blue-500/50"
          >
             <Wallet size={18} color="white" />
             <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-base ml-2">Record Payment / Settle</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default DebtDetailScreen;
