import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Image, Switch, Alert } from 'react-native';
import { ChevronLeft, MoreVertical, Camera, MapPin, Calendar, DollarSign, Users, PlaneTakeoff, Plus } from 'lucide-react-native';


const AddTripScreen = ({ navigation }) => {
  const [budgetEnabled, setBudgetEnabled] = useState(true);

  return (
    <View className="flex-1 bg-[#F8F9FF]">
      {/* Header */}
      <View className="px-6 pt-14 pb-4 bg-white flex-row justify-between items-center border-b border-[#F0F2FA]">
        <TouchableOpacity onPress={() => navigation.goBack()} className="flex-row items-center">
          <ChevronLeft size={24} color="#2E3A9D" />
          <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-lg ml-2">Add Trip</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <MoreVertical size={24} color="#2E3A9D" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Cover Photo */}
        <View className="relative h-56 w-full">
           <Image 
             source={{ uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000' }} 
             className="w-full h-full"
           />
           <View className="absolute inset-0 bg-black/20 items-center justify-center">
              <TouchableOpacity className="bg-white/90 px-6 py-3 rounded-2xl flex-row items-center">
                 <Camera size={20} color="#2E3A9D" />
                 <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-sm ml-2">Change Cover Photo</Text>
              </TouchableOpacity>
           </View>
        </View>

        <View className="p-6">
          {/* Basic Info */}
          <View className="mb-6">
             <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px] mb-2">Trip Name</Text>
             <View className="bg-white border border-[#E0E4F5] rounded-2xl px-4 py-3">
                <TextInput placeholder="e.g., Summer in Bali" className="text-[#2E3A9D]" style={{ fontFamily: 'Poppins-Regular' }} />
             </View>
          </View>

          <View className="mb-6">
             <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px] mb-2">Destination</Text>
             <View className="flex-row items-center bg-white border border-[#E0E4F5] rounded-2xl px-4 py-3">
                <MapPin size={18} color="#8A94A6" />
                <TextInput placeholder="Search city or country" className="flex-1 ml-3 text-[#2E3A9D]" style={{ fontFamily: 'Poppins-Regular' }} />
             </View>
          </View>

          <View className="flex-row justify-between mb-6">
             <View style={{ width: '48%' }}>
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px] mb-2">Start Date</Text>
                <View className="flex-row items-center bg-white border border-[#E0E4F5] rounded-2xl px-4 py-3">
                   <Calendar size={18} color="#8A94A6" />
                   <TextInput placeholder="mm/dd/yyyy" className="flex-1 ml-2 text-[#2E3A9D]" style={{ fontFamily: 'Poppins-Regular' }} />
                </View>
             </View>
             <View style={{ width: '48%' }}>
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px] mb-2">End Date</Text>
                <View className="flex-row items-center bg-white border border-[#E0E4F5] rounded-2xl px-4 py-3">
                   <Calendar size={18} color="#8A94A6" />
                   <TextInput placeholder="mm/dd/yyyy" className="flex-1 ml-2 text-[#2E3A9D]" style={{ fontFamily: 'Poppins-Regular' }} />
                </View>
             </View>
          </View>

          {/* Budgeting Card */}
          <View className="bg-[#F0F2FA] rounded-[32px] p-6 mb-8 border border-[#E0E4F5]">
             <View className="flex-row items-center mb-6">
                <View className="bg-white p-2.5 rounded-xl shadow-sm">
                   <DollarSign size={20} color="#2E3A9D" />
                </View>
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-lg ml-3">Budgeting</Text>
             </View>

             <View className="mb-6">
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase mb-2">Total Trip Budget</Text>
                <View className="bg-white rounded-2xl p-4 flex-row items-center">
                   <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-2xl mr-2">$</Text>
                   <TextInput placeholder="0.00" keyboardType="numeric" className="text-[#1A1A1A] text-3xl flex-1" style={{ fontFamily: 'Poppins-Bold' }} />
                </View>
             </View>

             <View className="flex-row justify-between items-center">
                <View>
                   <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-sm">Individual budget limits</Text>
                   <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-[#8A94A6] text-[10px]">Restrict spending per participant</Text>
                </View>
                <Switch value={budgetEnabled} onValueChange={setBudgetEnabled} trackColor={{ true: '#2E3A9D' }} />
             </View>
          </View>

          {/* Participants */}
          <View className="mb-10">
             <View className="flex-row justify-between items-center mb-6">
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-lg">Participants</Text>
                <TouchableOpacity className="flex-row items-center">
                   <Plus size={16} color="#2E3A9D" />
                   <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-xs ml-1">Add Friends</Text>
                </TouchableOpacity>
             </View>
             
             <View className="flex-row">
                <TouchableOpacity className="w-14 h-14 rounded-full border-2 border-dashed border-[#8A94A6] items-center justify-center mr-4">
                   <Users size={20} color="#8A94A6" />
                </TouchableOpacity>
                {[1, 2, 3].map(i => (
                  <View key={i} className="items-center mr-6">
                     <View className="w-14 h-14 rounded-full bg-[#E0E4F5] border-2 border-white items-center justify-center mb-1">
                        <Users size={24} color="#2E3A9D" />
                     </View>
                     <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-[#8A94A6] text-[10px]">User {i}</Text>
                  </View>
                ))}
             </View>
          </View>

          {/* Create Button */}
          <TouchableOpacity 
            onPress={() => {
              Alert.alert('Success', 'Trip created successfully!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
            }}
            className="bg-[#2E3A9D] py-5 rounded-[24px] flex-row items-center justify-center shadow-lg shadow-blue-500/50 mb-10"
          >
             <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-lg mr-2">Create Trip</Text>
             <PlaneTakeoff size={20} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default AddTripScreen;
