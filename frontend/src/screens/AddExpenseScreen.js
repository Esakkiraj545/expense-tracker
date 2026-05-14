import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert, Image } from 'react-native';
import { X, Utensils, Car, ShoppingBag, Play, Home, MoreHorizontal, Calendar, CreditCard, Wallet, Camera, Check, ChevronRight } from 'lucide-react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const AddExpenseScreen = ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [otherCategory, setOtherCategory] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    { name: 'Food', icon: Utensils, color: '#FF9900', bg: '#FFF5E6' },
    { name: 'Travel', icon: Car, color: '#2E3A9D', bg: '#E8EBF8' },
    { name: 'Shop', icon: ShoppingBag, color: '#00A3FF', bg: '#E6F7FF' },
    { name: 'Fun', icon: Play, color: '#FF5252', bg: '#FFE5E5' },
    { name: 'Rent', icon: Home, color: '#4CAF50', bg: '#E8F5E9' },
    { name: 'Other', icon: MoreHorizontal, color: '#8A94A6', bg: '#F0F2FA' },
  ];

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need access to your photos to upload attachments.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled) {
      setAttachment(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/expenses`, {
        amount,
        category,
        otherCategory: category === 'Other' ? otherCategory : '',
        note,
        date,
        paymentMethod,
        attachment
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        Alert.alert('Success', 'Expense added successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      console.log('Error adding expense:', error);
      Alert.alert('Error', 'Failed to save expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      className="flex-1 bg-[#F8F9FF]"
    >

      <View className="px-6 pt-14 pb-4 bg-white flex-row justify-between items-center border-b border-[#F0F2FA]">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <X size={24} color="#2E3A9D" />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-lg">Add Expense</Text>
        <View className="w-6" />
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Amount Input */}
        <View className="items-center py-10">
          <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-xs uppercase tracking-[1px] mb-2">Amount Spent</Text>
          <View className="flex-row items-center">
            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-4xl mr-2">₹</Text>
            <TextInput
              placeholder="0.00"
              placeholderTextColor="#E0E4F5"
              className="text-[#2E3A9D] text-5xl"
              style={{ fontFamily: 'Poppins-Bold' }}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              autoFocus
            />
          </View>
        </View>

        {/* Categories */}
        <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-sm mb-4">Select Category</Text>
        <View className="flex-row flex-wrap justify-between">
          {categories.map((cat) => (
            <TouchableOpacity 
              key={cat.name}
              onPress={() => setCategory(cat.name)}
              style={{ width: '31%', marginBottom: 16 }}
              className={`p-4 rounded-3xl items-center border ${category === cat.name ? 'bg-[#2E3A9D] border-[#2E3A9D]' : 'bg-white border-[#F0F2FA]'}`}
            >
              <View style={{ backgroundColor: category === cat.name ? 'rgba(255,255,255,0.2)' : cat.bg }} className="p-3 rounded-2xl mb-2">
                <cat.icon size={20} color={category === cat.name ? 'white' : cat.color} />
              </View>
              <Text style={{ fontFamily: 'Poppins-SemiBold' }} className={`text-[10px] ${category === cat.name ? 'text-white' : 'text-[#8A94A6]'}`}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Other Category Input */}
        {category === 'Other' && (
          <View className="mb-6">
            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px] mb-2 ml-1">Custom Category Name</Text>
            <View className="bg-white border border-[#E0E4F5] rounded-2xl px-4 py-4 shadow-sm">
               <TextInput 
                 placeholder="Enter category name"
                 value={otherCategory} 
                 onChangeText={setOtherCategory} 
                 className="text-[#1A1A1A] text-sm" 
                 style={{ fontFamily: 'Poppins-SemiBold' }} 
               />
            </View>
          </View>
        )}

        {/* Details Section */}
        <View className="bg-white rounded-[32px] p-6 mb-8 border border-[#F0F2FA] shadow-sm">
           {/* Date Picker */}
           <TouchableOpacity 
             onPress={() => setShowDatePicker(true)}
             className="flex-row items-center py-4 border-b border-[#F8F9FF]"
           >
              <View className="bg-[#E8F5E9] p-2.5 rounded-xl mr-4">
                 <Calendar size={18} color="#4CAF50" />
              </View>
              <View className="flex-1">
                 <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-[#8A94A6] text-[10px] uppercase">Date</Text>
                 <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-sm">{date.toDateString()}</Text>
              </View>
              <ChevronRight size={18} color="#8A94A6" />
           </TouchableOpacity>
           
           {showDatePicker && (
             <DateTimePicker
               value={date}
               mode="date"
               display="default"
               onChange={onDateChange}
             />
           )}

           {/* Payment Method */}
           <View className="flex-row items-center py-4 border-b border-[#F8F9FF]">
              <View className="bg-[#FFF5E6] p-2.5 rounded-xl mr-4">
                 <CreditCard size={18} color="#FF9900" />
              </View>
              <View className="flex-1">
                 <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-[#8A94A6] text-[10px] uppercase">Payment Method</Text>
                 <View className="flex-row mt-2">
                    {['Cash', 'Card', 'UPI'].map((m) => (
                      <TouchableOpacity 
                        key={m} 
                        onPress={() => setPaymentMethod(m)}
                        className={`px-4 py-1.5 rounded-full mr-2 ${paymentMethod === m ? 'bg-[#2E3A9D]' : 'bg-[#F0F2FA]'}`}
                      >
                         <Text style={{ fontFamily: 'Poppins-Bold' }} className={`text-[9px] ${paymentMethod === m ? 'text-white' : 'text-[#8A94A6]'}`}>{m}</Text>
                      </TouchableOpacity>
                    ))}
                 </View>
              </View>
           </View>

           {/* Notes */}
           <View className="py-4">
              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px] mb-2 ml-1">Add Note</Text>
              <View className="bg-white border border-[#E0E4F5] rounded-2xl px-4 py-4 shadow-sm h-32 flex-row">
                 <View className="bg-[#E6F7FF] p-2 rounded-xl mr-3 self-start">
                    <X size={16} color="#00A3FF" style={{ transform: [{ rotate: '45deg' }] }} />
                 </View>
                 <TextInput
                   placeholder="What was this for?"
                   placeholderTextColor="#8A94A6"
                   multiline
                   value={note}
                   onChangeText={setNote}
                   style={{ fontFamily: 'Poppins-Regular', textAlignVertical: 'top' }}
                   className="flex-1 text-[#1A1A1A] text-sm h-full"
                 />
              </View>
           </View>
        </View>


        {/* Attachment */}
        <TouchableOpacity 
          onPress={pickImage}
          className="bg-white border-2 border-dashed border-[#E0E4F5] rounded-[32px] p-8 items-center mb-10"
        >
          {attachment ? (
            <View className="items-center">
              <Image source={{ uri: attachment }} style={{ width: 100, height: 100, borderRadius: 16 }} />
              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-[10px] mt-2">Change Image</Text>
            </View>
          ) : (
            <>
              <View className="bg-[#F0F2FA] p-4 rounded-full mb-3">
                <Camera size={24} color="#8A94A6" />
              </View>
              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-sm">Add Attachment</Text>
              <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-[#8A94A6] text-[10px]">Upload receipt or photo</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Save Button */}
        <TouchableOpacity 
          onPress={handleSave}
          disabled={loading}
          className="bg-[#2E3A9D] py-5 rounded-[24px] flex-row items-center justify-center shadow-xl shadow-blue-500/50 mb-10"
        >
          <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-lg mr-2">
            {loading ? 'Saving...' : 'Save Expense'}
          </Text>
          <Check size={20} color="white" />
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddExpenseScreen;

