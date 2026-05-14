import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/DashboardScreen';
import ExpensesScreen from '../screens/ExpensesScreen';
import DebtsScreen from '../screens/DebtsScreen';
import TripsScreen from '../screens/TripsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { View, Text } from 'react-native';
import AnimatedTabBar from './AnimatedTabBar';

const Tab = createBottomTabNavigator();

// Placeholder components for other tabs
const Placeholder = ({ name }) => (
  <View className="flex-1 items-center justify-center bg-[#F8F9FF]">
    <Text style={{ fontFamily: 'Poppins-Bold' }} className="text-[#2E3A9D] text-xl">{name} Coming Soon</Text>
  </View>
);

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={props => <AnimatedTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Expenses" component={ExpensesScreen} />
      <Tab.Screen name="Debts" component={DebtsScreen} />
      <Tab.Screen name="Trips" component={TripsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};





export default MainTabNavigator;
