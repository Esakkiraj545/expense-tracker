import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { ChevronLeft, MoreVertical, Calendar, CreditCard, FileText, Trash2, Edit3, Share2, MapPin } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const ExpenseDetailScreen = ({ route, navigation }) => {
  const { expense } = route.params;

  const getCategoryTheme = (catName) => {
    const themes = {
      'Food': { color: '#FF9900', bg: '#FFF5E6' },
      'Travel': { color: '#2E3A9D', bg: '#E8F0FF' },
      'Shop': { color: '#00A3FF', bg: '#E6F7FF' },
      'Fun': { color: '#FF5252', bg: '#FFE5E5' },
      'Rent': { color: '#4CAF50', bg: '#E8F5E9' },
      'Other': { color: '#8A94A6', bg: '#F0F2FA' },
    };
    return themes[catName] || themes['Other'];
  };

  const theme = getCategoryTheme(expense.category);

  return (
    <View className="flex-1 bg-[#F8F9FF]">
      {/* Header */}
      <View className="px-6 pt-14 pb-4 bg-white flex-row justify-between items-center border-b border-[#F0F2FA]">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
          <ChevronLeft size={24} color="#2E3A9D" />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-lg">Transaction Details</Text>
        <TouchableOpacity className="p-2">
          <MoreVertical size={24} color="#2E3A9D" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Top Summary Card */}
        <View className="p-6">
          <View className="bg-white rounded-[40px] p-8 items-center border border-[#F0F2FA] shadow-sm">
             <View style={{ backgroundColor: theme.bg }} className="p-5 rounded-3xl mb-4">
                <Text style={{ fontSize: 32 }}>{expense.category === 'Food' ? '🍔' : expense.category === 'Travel' ? '🚗' : '💰'}</Text>
             </View>
             <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-2xl">
               {expense.category === 'Other' ? expense.otherCategory : expense.category}
             </Text>
             <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-[#8A94A6] text-xs mb-6">{expense.note || 'No description provided'}</Text>
             
             <View className="flex-row items-center">
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#FF5252] text-4xl">₹{parseFloat(expense.amount || 0).toLocaleString()}</Text>
             </View>
          </View>
        </View>

        {/* Details List */}
        <View className="px-6">
          <View className="bg-white rounded-[32px] p-6 border border-[#F0F2FA] shadow-sm">
             <View className="flex-row items-center py-4 border-b border-[#F8F9FF]">
                <View className="bg-[#F0F2FA] p-2.5 rounded-xl mr-4">
                   <Calendar size={18} color="#8A94A6" />
                </View>
                <View className="flex-1">
                   <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-[#8A94A6] text-[10px] uppercase">Date & Time</Text>
                   <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-sm">
                     {new Date(expense.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                   </Text>
                </View>
             </View>

             <View className="flex-row items-center py-4 border-b border-[#F8F9FF]">
                <View className="bg-[#F0F2FA] p-2.5 rounded-xl mr-4">
                   <CreditCard size={18} color="#8A94A6" />
                </View>
                <View className="flex-1">
                   <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-[#8A94A6] text-[10px] uppercase">Payment Method</Text>
                   <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-sm">{expense.paymentMethod}</Text>
                </View>
             </View>

             <View className="flex-row items-start py-4">
                <View className="bg-[#F0F2FA] p-2.5 rounded-xl mr-4">
                   <FileText size={18} color="#8A94A6" />
                </View>
                <View className="flex-1">
                   <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-[#8A94A6] text-[10px] uppercase">Note</Text>
                   <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-[#1A1A1A] text-sm leading-6">
                     {expense.note || 'No additional notes attached to this transaction.'}
                   </Text>
                </View>
             </View>
          </View>
        </View>

        {/* Attachment Section */}
        {expense.attachment && (
          <View className="p-6">
            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-sm mb-4">Attachment</Text>
            <View className="bg-white p-4 rounded-[32px] border border-[#F0F2FA] shadow-sm overflow-hidden">
               <Image 
                 source={{ uri: expense.attachment }} 
                 className="w-full h-64 rounded-[24px]"
                 resizeMode="cover"
               />
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View className="px-6 flex-row justify-between mt-6 mb-20">
           <TouchableOpacity className="bg-white border border-[#E0E4F5] p-5 rounded-[24px] w-[31%] items-center">
              <Share2 size={20} color="#2E3A9D" />
              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-[10px] mt-2">Share</Text>
           </TouchableOpacity>
           <TouchableOpacity className="bg-white border border-[#E0E4F5] p-5 rounded-[24px] w-[31%] items-center">
              <Edit3 size={20} color="#2E3A9D" />
              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-[10px] mt-2">Edit</Text>
           </TouchableOpacity>
           <TouchableOpacity className="bg-[#FFE5E5] p-5 rounded-[24px] w-[31%] items-center">
              <Trash2 size={20} color="#FF5252" />
              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#FF5252] text-[10px] mt-2">Delete</Text>
           </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ExpenseDetailScreen;
