import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { Search, Bell, Plus, ChevronRight, User } from 'lucide-react-native';

const TripsScreen = ({ navigation }) => {
  const trips = [
    { 
      id: 1, 
      name: 'Goa Getaway', 
      date: 'Oct 12 - Oct 18', 
      total: '₹45,200', 
      share: '₹12,400', 
      status: 'Active', 
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=500',
      participants: 5
    },
    { 
      id: 2, 
      name: 'Europe 2024', 
      date: 'Dec 20 - Jan 05', 
      total: '€4,500', 
      share: '€1,200', 
      status: 'Planned', 
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=500',
      participants: 2
    },
    { 
      id: 3, 
      name: 'Manali Trek', 
      date: 'Aug 05 - Aug 12', 
      total: '₹22,800', 
      share: 'Settled', 
      status: 'Completed', 
      image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=500',
      participants: 1
    },
  ];

  return (
    <View className="flex-1 bg-[#F8F9FF]">
      {/* Header */}
      <View className="px-6 pt-14 pb-4 bg-white flex-row justify-between items-center">
        <View className="flex-row items-center">
          <View className="w-10 h-10 rounded-full bg-[#E0E4F5] items-center justify-center mr-3">
             <User size={20} color="#2E3A9D" />
          </View>
          <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-2xl">WealthFlow</Text>
        </View>
        <TouchableOpacity>
          <Bell size={24} color="#2E3A9D" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6">
          {/* Search */}
          <View className="flex-row items-center bg-[#F0F2FA] rounded-2xl px-4 py-3 mb-6">
            <Search size={20} color="#8A94A6" />
            <TextInput 
              placeholder="Search your adventures..." 
              className="flex-1 ml-3 text-[#2E3A9D]"
              style={{ fontFamily: 'Poppins-Regular' }}
            />
          </View>

          {/* Filters */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 -mx-2 px-2">
            {['All Trips', 'Active', 'Planned', 'Completed'].map((tab, i) => (
              <TouchableOpacity key={i} className={`px-6 py-2.5 rounded-full mx-1 ${i === 0 ? 'bg-[#2E3A9D]' : 'bg-[#E8EBF8]'}`}>
                <Text style={{ fontFamily: 'Poppins-SemiBold' }} className={`text-xs ${i === 0 ? 'text-white' : 'text-[#8A94A6]'}`}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Trip Cards */}
          {trips.map((trip) => (
            <TouchableOpacity 
              key={trip.id} 
              onPress={() => navigation.navigate('TripDetail', { trip })}
              className="bg-white rounded-[32px] overflow-hidden mb-6 shadow-sm border border-[#F0F2FA]"
            >
              <View className="relative h-48">
                <Image source={{ uri: trip.image }} className="w-full h-full" />
                <View className="absolute top-4 right-4 bg-[#2E3A9D] px-4 py-1.5 rounded-full">
                  <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-[10px] uppercase">{trip.status}</Text>
                </View>
              </View>
              
              <View className="p-6">
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-xl mb-1">{trip.name}</Text>
                <View className="flex-row items-center mb-6">
                   <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-[#8A94A6] text-xs">Oct 12 - Oct 18</Text>
                </View>

                <View className="flex-row justify-between mb-6">
                   <View>
                      <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px]">Total Spent</Text>
                      <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-lg">{trip.total}</Text>
                   </View>
                   <View className="items-end">
                      <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-[10px] uppercase tracking-[1px]">Your Share</Text>
                      <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-lg">{trip.share}</Text>
                   </View>
                </View>

                <View className="flex-row justify-between items-center border-t border-[#F0F2FA] pt-4">
                   <View className="flex-row">
                      {[1,2,3].map(i => (
                        <View key={i} className="w-8 h-8 rounded-full border-2 border-white bg-[#E0E4F5] items-center justify-center -ml-2 first:ml-0">
                           <User size={14} color="#2E3A9D" />
                        </View>
                      ))}
                      {trip.participants > 3 && (
                        <View className="w-8 h-8 rounded-full border-2 border-white bg-[#2E3A9D] items-center justify-center -ml-2">
                           <Text className="text-white text-[10px] font-bold">+{trip.participants - 3}</Text>
                        </View>
                      )}
                   </View>
                   <View className="flex-row items-center">
                      <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-[#2E3A9D] text-xs mr-1">View details</Text>
                      <ChevronRight size={14} color="#2E3A9D" />
                   </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity 
        onPress={() => navigation.navigate('AddTrip')}
        style={{ position: 'absolute', bottom: 120, right: 30 }}
        className="w-16 h-16 bg-[#2E3A9D] rounded-full items-center justify-center shadow-xl shadow-blue-900"
      >
        <Plus size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default TripsScreen;
