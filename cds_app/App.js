import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { supabase } from './database/supabase';
import Auth from './components/Auth';
import StackNavigator from './navigation/StackNavigator';
import { SessionProvider, useSession } from './hooks/SessionProvider';
import * as NavigationBar from 'expo-navigation-bar';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Esto es para cargar la sesión al inicio
    supabase.auth.getSession().then(({ data: { session } }) => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  NavigationBar.setPositionAsync('absolute')
  // transparent backgrounds to see through
  NavigationBar.setBackgroundColorAsync('#ffffff00')
  // changes the color of the button icons "dark||light"
  //NavigationBar.setButtonStyleAsync("dark");

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SessionProvider>
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
      </SessionProvider>
    </GestureHandlerRootView>
  );
}
