import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { ChevronLeft, Trash2, Bell, Wallet, Plane, CheckCheck, Inbox } from 'lucide-react-native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const NotificationScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setNotifications(response.data.data);
      }
    } catch (error) {
      console.log('Error fetching notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const handleMarkAllRead = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const response = await axios.put(
        `${process.env.EXPO_PUBLIC_API_URL}/notifications/mark-read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        // Optimistically mark all read locally
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      }
    } catch (error) {
      console.log('Error marking read:', error);
    }
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All',
      'Are you sure you want to delete all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: performClearAll }
      ]
    );
  };

  const performClearAll = async () => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync('userToken');
      const response = await axios.delete(`${process.env.EXPO_PUBLIC_API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setNotifications([]);
      }
    } catch (error) {
      console.log('Error clearing notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationStyles = (type) => {
    switch (type) {
      case 'DebtReminder':
        return {
          icon: Bell,
          color: '#FF9900',
          bg: '#FFF5E6',
        };
      case 'TripExpense':
        return {
          icon: Plane,
          color: '#4CAF50',
          bg: '#E8F5E9',
        };
      default:
        return {
          icon: Bell,
          color: '#2E3A9D',
          bg: '#E8EBF8',
        };
    }
  };

  return (
    <View className="flex-1 bg-[#F8F9FF]">
      {/* Header */}
      <View className="px-6 pt-14 pb-4 bg-white flex-row justify-between items-center border-b border-[#F0F2FA]">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
            <ChevronLeft size={24} color="#2E3A9D" />
          </TouchableOpacity>
          <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-lg ml-2">Notifications</Text>
        </View>
        <View className="flex-row">
          {notifications.some(n => !n.isRead) && (
            <TouchableOpacity onPress={handleMarkAllRead} className="p-2 mr-2">
              <CheckCheck size={20} color="#4CAF50" />
            </TouchableOpacity>
          )}
          {notifications.length > 0 && (
            <TouchableOpacity onPress={handleClearAll} className="p-2">
              <Trash2 size={20} color="#FF5252" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#2E3A9D" />
        }
      >
        {loading ? (
          <View className="flex-1 justify-center items-center mt-20">
            <ActivityIndicator size="large" color="#2E3A9D" />
          </View>
        ) : notifications.length === 0 ? (
          <View className="flex-1 items-center justify-center mt-32 px-8">
            <View className="w-20 h-20 bg-white rounded-[26px] items-center justify-center shadow-md mb-6 border border-[#F0F2FA]">
              <Inbox size={36} color="#8A94A6" />
            </View>
            <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-lg text-center mb-2">All Caught Up!</Text>
            <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-[#8A94A6] text-xs text-center leading-5">
              You do not have any notifications at the moment. Pull down to refresh or check back later!
            </Text>
          </View>
        ) : (
          <View className="p-6 space-y-4">
            {notifications.map((item) => {
              const styles = getNotificationStyles(item.type);
              const Icon = styles.icon;

              return (
                <View 
                  key={item._id} 
                  className={`bg-white rounded-3xl p-5 border border-[#F0F2FA] flex-row items-start shadow-sm relative ${!item.isRead ? 'border-[#E8EBF8] bg-[#FBFBFF]' : ''}`}
                >
                  {/* Unread Blue Badge */}
                  {!item.isRead && (
                    <View className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#2E3A9D]" />
                  )}

                  {/* Icon Block */}
                  <View style={{ backgroundColor: styles.bg }} className="p-3.5 rounded-2xl mr-4">
                    <Icon size={20} color={styles.color} />
                  </View>

                  {/* Notification Content */}
                  <View className="flex-1 pr-4">
                    <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#1A1A1A] text-sm mb-1">{item.title}</Text>
                    <Text style={{ fontFamily: 'Poppins-Regular' }} className="text-[#444B59] text-xs leading-5 mb-2">{item.message}</Text>
                    <Text style={{ fontFamily: 'Poppins-Medium' }} className="text-[#8A94A6] text-[9px] uppercase tracking-[0.5px]">
                      {new Date(item.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default NotificationScreen;
