import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator, Platform, KeyboardAvoidingView, Image, Modal } from 'react-native';
import { ChevronLeft, Utensils, Home, Car, Fuel, ShoppingBag, Plus, Calendar, CreditCard, Wallet, Smartphone, Camera, X, Check, Save, User, ChevronDown } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const CATEGORIES = [
  { id: 'Food', name: 'Food', icon: Utensils, color: '#FF9F43' },
  { id: 'Stay', name: 'Stay', icon: Home, color: '#4834D4' },
  { id: 'Transport', name: 'Transport', icon: Car, color: '#6AB04C' },
  { id: 'Fuel', name: 'Fuel', icon: Fuel, color: '#EB4D4B' },
  { id: 'Shopping', name: 'Shopping', icon: ShoppingBag, color: '#F093FB' },
  { id: 'Others', name: 'Others', icon: Plus, color: '#8A94A6' },
];

const PAYMENT_METHODS = [
  { id: 'UPI', name: 'UPI', icon: Smartphone },
  { id: 'Cash', name: 'Cash', icon: Wallet },
  { id: 'Card', name: 'Card', icon: CreditCard },
];

const AddExpenseScreen = ({ route, navigation }) => {
  const { tripId } = route.params || {};
  const [selectedTripId, setSelectedTripId] = useState(tripId || '');
  const [trips, setTrips] = useState([]);
  const [showTripModal, setShowTripModal] = useState(false);
  const [tripsLoading, setTripsLoading] = useState(false);

  const [trip, setTrip] = useState(null);
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Food');
  const [customCategory, setCustomCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [selectedPayer, setSelectedPayer] = useState(null); // Will store user ID
  const [date, setDate] = useState(new Date());
  const [note, setNote] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Fetch all trips if no specific tripId was passed
  React.useEffect(() => {
    const fetchAllTrips = async () => {
      if (tripId) return; // Open from a specific trip, no need to fetch all
      setTripsLoading(true);
      try {
        const token = await SecureStore.getItemAsync('userToken');
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/trips`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setTrips(response.data.data);
          if (response.data.data.length > 0) {
            setSelectedTripId(response.data.data[0]._id);
          } else {
            Alert.alert(
              'No Trips Found',
              'You need to create a trip first before adding an expense.',
              [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
          }
        }
      } catch (error) {
        console.log('Error fetching all trips:', error);
      } finally {
        setTripsLoading(false);
      }
    };
    fetchAllTrips();
  }, [tripId]);

  // Fetch the selected trip's members and details
  React.useEffect(() => {
    if (!selectedTripId) return;
    const fetchTripMembers = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/trips/${selectedTripId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setTrip(response.data.data);
          // Set default payer as trip owner
          setSelectedPayer(response.data.data.owner._id);
        }
      } catch (error) {
        console.log('Error fetching trip members:', error);
      }
    };
    fetchTripMembers();
  }, [selectedTripId]);

  const handleSaveExpense = async () => {
    if (!selectedTripId) {
      Alert.alert('Error', 'Please select a trip');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (selectedCategory === 'Others' && !customCategory) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }

    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/expenses`, {
        trip: selectedTripId,
        amount: parseFloat(amount),
        category: selectedCategory === 'Others' ? customCategory : selectedCategory,
        paymentMethod,
        paidBy: selectedPayer,
        date,
        note
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
      Alert.alert('Error', 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) setDate(selectedDate);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-[#F8F9FF]"
    >
      {/* Header */}
      <View className="px-6 pt-14 pb-4 bg-white flex-row items-center justify-between border-b border-[#F0F2FA]">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
          <X size={24} color="#2E3A9D" />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-lg">Add Xpenso</Text>
        <TouchableOpacity onPress={handleSaveExpense} disabled={loading}>
           {loading ? <ActivityIndicator size="small" color="#2E3A9D" /> : <Check size={24} color="#2E3A9D" />}
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Amount Input */}
        <View className="bg-white px-6 py-10 items-center border-b border-[#F0F2FA]">
           <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px] mb-2">Amount Spent</Text>
           <View className="flex-row items-center">
              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-4xl mr-2">₹</Text>
              <TextInput 
                placeholder="0.00"
                keyboardType="numeric"
                className="text-[#1A1A1A] text-5xl"
                style={{ fontFamily: 'Poppins-Bold' }}
                value={amount}
                onChangeText={setAmount}
                autoFocus={true}
              />
           </View>
        </View>

        <View className="p-6">
          {/* Trip Selection - Only when not opened from a specific trip */}
          {!tripId && (
            <View className="mb-8">
              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px] mb-2">Select Trip</Text>
              <TouchableOpacity 
                onPress={() => setShowTripModal(true)}
                className="bg-white border border-[#E0E4F5] rounded-2xl px-4 py-4 shadow-sm flex-row items-center justify-between"
              >
                <View className="flex-row items-center">
                  <View className="w-8 h-8 rounded-full bg-[#EBF0FF] items-center justify-center mr-3">
                    <Text className="text-[#2E3A9D] font-bold text-xs">✈️</Text>
                  </View>
                  <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-[#1A1A1A] text-sm">
                    {trip ? trip.tripName : 'Select a Trip...'}
                  </Text>
                </View>
                <ChevronDown size={18} color="#2E3A9D" />
              </TouchableOpacity>
            </View>
          )}

          {/* Who Paid Section - Only for Group Trips */}
          {trip && trip.tripType !== 'solo' && (
            <View className="mb-8">
              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px] mb-4">Who Paid?</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-2 px-2">
                {/* Owner */}
                <TouchableOpacity 
                  onPress={() => setSelectedPayer(trip.owner._id)}
                  className={`items-center mr-4 p-3 rounded-2xl border-2 ${selectedPayer === trip.owner._id ? 'bg-[#2E3A9D] border-[#2E3A9D]' : 'bg-white border-[#F0F2FA]'}`}
                >
                  <View className={`w-10 h-10 rounded-full items-center justify-center mb-1 ${selectedPayer === trip.owner._id ? 'bg-white/20' : 'bg-[#E0E4F5]'}`}>
                    <User size={20} color={selectedPayer === trip.owner._id ? 'white' : '#2E3A9D'} />
                  </View>
                  <Text style={{ fontFamily: 'Poppins-Bold' }} className={`text-[8px] ${selectedPayer === trip.owner._id ? 'text-white' : 'text-[#444B59]'}`}>You</Text>
                </TouchableOpacity>

                {/* Other Members who have joined */}
                {trip.members.filter(m => m.status === 'joined' && m.user).map((member) => (
                  <TouchableOpacity 
                    key={member.user._id}
                    onPress={() => setSelectedPayer(member.user._id)}
                    className={`items-center mr-4 p-3 rounded-2xl border-2 ${selectedPayer === member.user._id ? 'bg-[#2E3A9D] border-[#2E3A9D]' : 'bg-white border-[#F0F2FA]'}`}
                  >
                    <View className={`w-10 h-10 rounded-full items-center justify-center mb-1 ${selectedPayer === member.user._id ? 'bg-white/20' : 'bg-[#E0E4F5]'}`}>
                      <User size={20} color={selectedPayer === member.user._id ? 'white' : '#2E3A9D'} />
                    </View>
                    <Text style={{ fontFamily: 'Poppins-Bold' }} className={`text-[8px] ${selectedPayer === member.user._id ? 'text-white' : 'text-[#444B59]'}`}>
                      {member.user.name || member.email.split('@')[0]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Category Section */}
          <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px] mb-4">Category</Text>
          <View className="flex-row flex-wrap justify-between mb-6">
             {CATEGORIES.map((cat) => (
               <TouchableOpacity 
                 key={cat.id}
                 onPress={() => setSelectedCategory(cat.id)}
                 className={`w-[31%] aspect-square rounded-[24px] items-center justify-center mb-3 border-2 ${selectedCategory === cat.id ? 'bg-[#2E3A9D] border-[#2E3A9D]' : 'bg-white border-[#F0F2FA]'}`}
               >
                  <View className={`p-3 rounded-2xl mb-1 ${selectedCategory === cat.id ? 'bg-white/20' : 'bg-[#F8F9FF]'}`}>
                    <cat.icon size={24} color={selectedCategory === cat.id ? 'white' : cat.color} />
                  </View>
                  <Text style={{ fontFamily: 'Poppins-Bold' }} className={`text-[10px] ${selectedCategory === cat.id ? 'text-white' : 'text-[#444B59]'}`}>{cat.name}</Text>
               </TouchableOpacity>
             ))}
          </View>

          {selectedCategory === 'Others' && (
            <View className="mb-6">
               <View className="bg-white border border-[#2E3A9D] rounded-2xl px-4 py-4 shadow-sm">
                  <TextInput 
                    placeholder="Enter category name (e.g., Gifts)"
                    className="text-[#1A1A1A] text-sm"
                    style={{ fontFamily: 'Poppins-SemiBold' }}
                    value={customCategory}
                    onChangeText={setCustomCategory}
                  />
               </View>
            </View>
          )}

          {/* Payment Method */}
          <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px] mb-4">Payment Method</Text>
          <View className="flex-row justify-between mb-8">
             {PAYMENT_METHODS.map((method) => (
               <TouchableOpacity 
                 key={method.id}
                 onPress={() => setPaymentMethod(method.id)}
                 className={`flex-1 flex-row items-center justify-center py-4 rounded-2xl mx-1 border ${paymentMethod === method.id ? 'bg-[#2E3A9D] border-[#2E3A9D]' : 'bg-white border-[#E0E4F5]'}`}
               >
                  <method.icon size={16} color={paymentMethod === method.id ? 'white' : '#2E3A9D'} />
                  <Text style={{ fontFamily: 'Poppins-Bold' }} className={`ml-2 text-xs ${paymentMethod === method.id ? 'text-white' : 'text-[#2E3A9D]'}`}>{method.name}</Text>
               </TouchableOpacity>
             ))}
          </View>

          {/* Date Picker */}
          <View className="mb-8">
            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px] mb-2">Date</Text>
            <TouchableOpacity 
              onPress={() => setShowDatePicker(true)}
              className="bg-white border border-[#E0E4F5] rounded-2xl px-4 py-4 shadow-sm flex-row items-center"
            >
               <Calendar size={18} color="#2E3A9D" />
               <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="ml-3 text-[#1A1A1A]">
                  {date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
               </Text>
            </TouchableOpacity>
            {showDatePicker && <DateTimePicker value={date} mode="date" onChange={onDateChange} />}
          </View>

          {/* Bill Attachment */}
          <View className="mb-8">
            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px] mb-2">Bill Attachment</Text>
            <TouchableOpacity className="bg-white border border-dashed border-[#2E3A9D] rounded-2xl p-8 items-center justify-center">
               <Camera size={32} color="#2E3A9D" />
               <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-xs mt-2">Take Photo or Upload Bill</Text>
            </TouchableOpacity>
          </View>

          {/* Notes */}
          <View className="mb-10">
            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px] mb-2">Notes</Text>
            <View className="bg-white border border-[#E0E4F5] rounded-2xl px-4 py-4 shadow-sm h-32">
               <TextInput 
                 placeholder="What was this for?"
                 multiline textAlignVertical="top"
                 className="flex-1 text-[#1A1A1A] text-sm"
                 style={{ fontFamily: 'Poppins-Regular' }}
                 value={note}
                 onChangeText={setNote}
               />
            </View>
          </View>

          <TouchableOpacity 
            onPress={handleSaveExpense}
            disabled={loading}
            className="bg-[#2E3A9D] py-5 rounded-[24px] flex-row items-center justify-center shadow-lg shadow-blue-500/50 mb-10"
          >
             {loading ? <ActivityIndicator color="white" /> : <><Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-lg mr-2">Save Xpenso</Text><Save size={20} color="white" /></>}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Trip Selector Modal */}
      <Modal
        visible={showTripModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTripModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-[32px] p-6 max-h-[80%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-lg">Select a Trip</Text>
              <TouchableOpacity onPress={() => setShowTripModal(false)} className="p-2">
                <X size={20} color="#2E3A9D" />
              </TouchableOpacity>
            </View>

            {tripsLoading ? (
              <ActivityIndicator size="large" color="#2E3A9D" className="my-10" />
            ) : (
              <ScrollView showsVerticalScrollIndicator={false} className="mb-6">
                {trips.map((t) => (
                  <TouchableOpacity
                    key={t._id}
                    onPress={() => {
                      setSelectedTripId(t._id);
                      setShowTripModal(false);
                    }}
                    className={`p-4 rounded-2xl mb-3 flex-row items-center justify-between border-2 ${selectedTripId === t._id ? 'bg-[#EBF0FF] border-[#2E3A9D]' : 'bg-[#F8F9FF] border-[#F0F2FA]'}`}
                  >
                    <View className="flex-row items-center">
                      <View className="w-10 h-10 rounded-full bg-white items-center justify-center mr-3 shadow-sm">
                        <Text className="text-lg">✈️</Text>
                      </View>
                      <View>
                        <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-sm">{t.tripName}</Text>
                        <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-[#8A94A6] text-[10px]">{t.tripType === 'solo' ? 'Solo Trip' : 'Group Trip'}</Text>
                      </View>
                    </View>
                    {selectedTripId === t._id && <Check size={18} color="#2E3A9D" />}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default AddExpenseScreen;
