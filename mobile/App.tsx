import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import CompareScreen from './src/screens/CompareScreen';
import LeadScreen from './src/screens/LeadScreen';
import PackageDetailScreen from './src/screens/PackageDetailScreen';
import BookingFlowScreen from './src/screens/BookingFlowScreen';
import CustomerDashboardScreen from './src/screens/CustomerDashboardScreen';
import NotificationScreen from './src/screens/NotificationScreen';
import { CompareProvider } from './src/context/CompareContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <CompareProvider>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Home"
          screenOptions={{
            headerStyle: { backgroundColor: '#1e3a8a' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' }
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Travel Lounge 2026' }} />
          <Stack.Screen name="Compare" component={CompareScreen} options={{ title: 'Compare Packages' }} />
          <Stack.Screen name="Lead" component={LeadScreen} options={{ title: 'Confirm Lead' }} />
          <Stack.Screen name="PackageDetail" component={PackageDetailScreen} options={{ title: 'Package Details' }} />
          <Stack.Screen name="BookingFlow" component={BookingFlowScreen} options={{ title: 'Secure Checkout' }} />
          <Stack.Screen name="CustomerDashboard" component={CustomerDashboardScreen} options={{ title: 'My Bookings' }} />
          <Stack.Screen name="Notifications" component={NotificationScreen} options={{ title: 'Alerts' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </CompareProvider>
  );
}
