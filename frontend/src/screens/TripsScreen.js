import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator, RefreshControl, Dimensions, Alert, Modal } from 'react-native';
import { Plus, MapPin, Calendar, Users, ChevronRight, PlaneTakeoff, Wallet, Clock, Trash2, MoreVertical, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const { width } = Dimensions.get('window');

const TripsScreen = ({ navigation }) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState(null);
  const [selectedTripName, setSelectedTripName] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [activeMenuTripId, setActiveMenuTripId] = useState(null);
  const [expandedTripId, setExpandedTripId] = useState(null);

  const fetchTrips = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/trips`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        // Filter out the auto-generated 'Personal Expenses' background trip so it doesn't show in the UI
        setTrips(response.data.data.filter(trip => trip.tripName !== 'Personal Expenses'));
      }
    } catch (error) {
      console.log('Error fetching trips:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTrips();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchTrips();
  };

  const handleDeleteTrip = (tripId, tripName) => {
    setSelectedTripId(tripId);
    setSelectedTripName(tripName);
    setDeleteModalVisible(true);
  };

  const performDeleteTrip = async () => {
    setDeleting(true);
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const response = await axios.delete(`${process.env.EXPO_PUBLIC_API_URL}/trips/${selectedTripId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setTrips(trips.filter(t => t._id !== selectedTripId));
        setDeleteModalVisible(false);
      }
    } catch (error) {
      console.log('Error deleting trip:', error);
      Alert.alert('Error', 'Failed to delete trip. Please try again.');
    } finally {
      setDeleting(false);
      setSelectedTripId(null);
      setSelectedTripName('');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'completed': return '#8A94A6';
      default: return '#2E3A9D';
    }
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 bg-[#F8F9FF] items-center justify-center">
        <ActivityIndicator size="large" color="#2E3A9D" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F8F9FF]">
      {/* Header */}
      <View className="px-6 pt-14 pb-6 bg-white flex-row items-center justify-between border-b border-[#F0F2FA]">
        <View>
          <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-2xl">My Trips</Text>
          <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-[#8A94A6] text-xs">Adventure is calling!</Text>
        </View>
        <TouchableOpacity 
          onPress={() => navigation.navigate('AddTrip')}
          className="bg-[#2E3A9D] p-3 rounded-2xl shadow-lg shadow-blue-500/30"
        >
          <Plus size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ padding: 24 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {trips.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <View className="bg-white p-8 rounded-full mb-6">
              <PlaneTakeoff size={48} color="#E0E4F5" />
            </View>
            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-lg mb-2">No trips yet</Text>
            <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-[#8A94A6] text-sm text-center px-10 mb-8">
              Plan your next adventure and keep track of all your travel expenses.
            </Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('AddTrip')}
              className="bg-[#2E3A9D] px-8 py-4 rounded-2xl shadow-lg shadow-blue-500/30"
            >
              <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white">Create First Trip</Text>
            </TouchableOpacity>
          </View>
        ) : (
          trips.map((trip) => (
            <TouchableOpacity 
              key={trip._id}
              onPress={() => navigation.navigate('TripDetail', { tripId: trip._id })}
              className="bg-white rounded-2xl mb-8 overflow-hidden shadow-sm border border-[#F0F2FA]"
              activeOpacity={0.9}
            >
              {/* Trip Image Header */}
              <View className="h-48 relative">
                <Image 
                  source={{ uri: trip.image }} 
                  className="w-full h-full"
                  resizeMode="cover"
                />
                 <View className="absolute top-4 left-4 bg-white/95 px-3 py-1.5 rounded-full border border-white/50 shadow-sm">
                  <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-[9px] uppercase tracking-wider">
                    {trip.status || 'Upcoming'}
                  </Text>
                </View>
                
                {/* Three-Dot Option Menu Toggler in Top Right */}
                <TouchableOpacity 
                  onPress={() => setActiveMenuTripId(activeMenuTripId === trip._id ? null : trip._id)}
                  style={{ zIndex: 30 }}
                  className="absolute top-4 right-4 bg-white/95 w-8 h-8 rounded-full items-center justify-center border border-white/50 shadow active:bg-blue-50"
                >
                  <MoreVertical size={16} color="#2E3A9D" />
                </TouchableOpacity>

                {/* Floating Dropdown Context Menu */}
                {activeMenuTripId === trip._id && (
                  <View 
                    style={{ zIndex: 40 }}
                    className="absolute top-14 right-4 bg-white rounded-2xl p-2 shadow-2xl border border-[#F0F2FA] w-32"
                  >
                    <TouchableOpacity 
                      onPress={() => {
                        setActiveMenuTripId(null);
                        navigation.navigate('AddTrip', { tripId: trip._id });
                      }}
                      className="py-2.5 px-3 rounded-xl flex-row items-center active:bg-[#F8F9FF] border-b border-[#F8F9FF]"
                    >
                      <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#444B59] text-[11px] ml-1">Edit Trip</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => {
                        setActiveMenuTripId(null);
                        handleDeleteTrip(trip._id, trip.tripName);
                      }}
                      className="py-2.5 px-3 rounded-xl flex-row items-center active:bg-red-50"
                    >
                      <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#FF5252] text-[11px] ml-1">Delete</Text>
                    </TouchableOpacity>
                  </View>
                )}
                <View className="absolute bottom-0 left-0 right-0 h-24 bg-black/40 p-6 justify-end">
                   <View className="flex-row items-center">
                      <MapPin size={12} color="white" />
                      <Text style={{ fontFamily: 'Poppins-SemiBold' }} className="text-white text-xs ml-1">{trip.destination}, {trip.state}</Text>
                   </View>
                </View>
              </View>

              {/* Trip Content */}
              <View className="p-6">
                <View className="flex-row justify-between items-start mb-4">
                  <View className="flex-1">
                    <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-lg mb-1">{trip.tripName}</Text>
                    <View className="flex-row items-center">
                      <Calendar size={12} color="#8A94A6" />
                      <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-[#8A94A6] text-[10px] ml-1">
                        {new Date(trip.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - {new Date(trip.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row">
                    <View className="bg-[#F0F2FA] w-8 h-8 rounded-full items-center justify-center -ml-2 border-2 border-white">
                      <Users size={14} color="#2E3A9D" />
                    </View>
                    <View className="bg-[#2E3A9D] px-2 py-1 rounded-lg ml-2 justify-center">
                      <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-[10px]">+{trip.members?.length || 0}</Text>
                    </View>
                  </View>
                </View>

                {/* Progress Stats */}
                <View className="bg-[#F8F9FF] p-4 rounded-2xl flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    <View className="bg-white p-2 rounded-xl mr-3">
                      <Wallet size={16} color="#2E3A9D" />
                    </View>
                    <View>
                      <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-sm">₹{trip.budget.toLocaleString()}</Text>
                      <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-[#8A94A6] text-[9px] uppercase tracking-wider">Total Budget</Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#4CAF50] text-sm">₹{trip.totalExpenses || 0}</Text>
                    <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-[#8A94A6] text-[9px] uppercase tracking-wider">Spent</Text>
                  </View>
                </View>

                {/* Progress Bar */}
                <View className="mt-4 h-1.5 bg-[#E0E4F5] rounded-full overflow-hidden">
                  <View 
                    className="h-full bg-[#2E3A9D]" 
                    style={{ width: `${Math.min((trip.totalExpenses || 0) / trip.budget * 100, 100)}%` }}
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Reusable Custom Premium Delete Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
          <View className="bg-white w-full rounded-2xl p-6 items-center shadow-2xl border border-[#F0F2FA]">
            {/* Header Icon */}
            <View className="bg-red-50 p-5 rounded-full mb-6">
              <Trash2 size={36} color="#FF5252" />
            </View>
            
            {/* Text details */}
            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-xl text-center mb-2">
              Delete Trip
            </Text>
            <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-[#8A94A6] text-xs text-center leading-5 mb-8">
              Are you absolutely sure you want to delete "{selectedTripName}"? This will permanently delete this trip and all its group expenses. This action is irreversible.
            </Text>
            
            {/* Button Actions */}
            <View className="flex-row w-full justify-between">
              <TouchableOpacity 
                onPress={() => setDeleteModalVisible(false)}
                style={{ width: '48%' }}
                className="py-4 border border-[#E0E4F5] rounded-2xl items-center bg-[#FBFBFF]"
                disabled={deleting}
              >
                <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#8A94A6] text-xs uppercase tracking-[0.5px]">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={performDeleteTrip}
                style={{ width: '48%' }}
                className="py-4 bg-[#FF5252] rounded-2xl items-center shadow-md shadow-red-500/20 justify-center"
                disabled={deleting}
              >
                {deleting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-white text-xs uppercase tracking-[0.5px]">
                    Yes, Delete
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TripsScreen;
