import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import AppNavigator from './src/navigation';
import { StatusBar } from 'expo-status-bar';

// NativeWind setup requires this import in some versions, 
// but usually it's handled by babel and tailwind.config.js
import "./global.css"; 

export default function App() {
  return (
    <Provider store={store}>
      <AppNavigator />
      <StatusBar style="auto" />
    </Provider>
  );
}
