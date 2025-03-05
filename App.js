import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import StackNavigator from './navigation/StackNavigator';

import { MenuProvider } from 'react-native-popup-menu';


const Stack = createNativeStackNavigator();



function App() {
  return (

      <MenuProvider>
        <NavigationContainer>
            <StackNavigator />
        </NavigationContainer>
      </MenuProvider>

  );
}

export default App;