import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Import this
import StackNavigator from './navigation/StackNavigator';
import { MenuProvider } from 'react-native-popup-menu';
import { StyleSheet } from 'react-native';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <GestureHandlerRootView>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}



export default App;
