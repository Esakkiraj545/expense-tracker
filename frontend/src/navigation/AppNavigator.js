import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import MainTabNavigator from './MainTabNavigator';
import AddExpenseScreen from '../screens/AddExpenseScreen';
import AddDebtScreen from '../screens/AddDebtScreen';
import DebtDetailScreen from '../screens/DebtDetailScreen';
import TripsScreen from '../screens/TripsScreen';
import AddTripScreen from '../screens/AddTripScreen';
import TripDetailScreen from '../screens/TripDetailScreen';
import SettleUpScreen from '../screens/SettleUpScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import PersonalInformationScreen from '../screens/PersonalInformationScreen';
import NotificationScreen from '../screens/NotificationScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import OTPScreen from '../screens/OTPScreen';
import ExpenseDetailScreen from '../screens/ExpenseDetailScreen';






const Stack = createNativeStackNavigator();

const AppNavigator = ({ initialRoute }) => {
  return (
    <Stack.Navigator
      initialRouteName={initialRoute || "Login"}
      screenOptions={{
        headerShown: false,
      }}
    >

      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="OTPScreen" component={OTPScreen} />
      <Stack.Screen name="ExpenseDetail" component={ExpenseDetailScreen} />


      <Stack.Screen name="SignUp" component={SignUpScreen} />

      <Stack.Screen name="Main" component={MainTabNavigator} />
      <Stack.Screen 
        name="AddExpense" 
        component={AddExpenseScreen}
        options={{ presentation: 'modal' }} 
      />
      <Stack.Screen 
        name="AddDebt" 
        component={AddDebtScreen}
        options={{ presentation: 'modal' }} 
      />
      <Stack.Screen name="DebtDetail" component={DebtDetailScreen} />
      <Stack.Screen 
        name="AddTrip" 
        component={AddTripScreen}
        options={{ presentation: 'modal' }} 
      />
      <Stack.Screen name="TripDetail" component={TripDetailScreen} />
      <Stack.Screen name="SettleUp" component={SettleUpScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="PersonalInformation" component={PersonalInformationScreen} />
      <Stack.Screen name="Notifications" component={NotificationScreen} />


    </Stack.Navigator>
  );
};





export default AppNavigator;
