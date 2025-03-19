import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigationState } from '@react-navigation/native';
import TabNavigator from './TabNavigator';
import MapScreen from '../screens/MapScreen';
import ChallengeDetailsScreen from '../screens/ChallengeDetailsScreen';
import ChallengeScanQRScreen from '../screens/ChallengeScanQRScreen';
import ChallengeCompletedScreen from '../screens/ChallengeCompletedScreen';
import AIChat from '../screens/AIChat';
import Route from '../screens/Route';
import AIButton from "../components/AIButton";

const Stack = createStackNavigator();

const StackNavigator = () => {
  // Get the current screen name from navigation state
  const currentScreen = useNavigationState(state => 
    state?.routes[state.index]?.name
  );
  
  // Only show AIButton if we're not on the AIChat screen
  const showAIButton = currentScreen !== 'AIChat';
  
  return (
    <>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen name="MapScreen" component={MapScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ChallengeDetailsScreen" component={ChallengeDetailsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ChallengeScanQRScreen" component={ChallengeScanQRScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ChallengeCompletedScreen" component={ChallengeCompletedScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AIChat" component={AIChat} options={{ headerShown: false }} />
        <Stack.Screen name="Route" component={Route} options={{ headerShown: false }} />
      </Stack.Navigator>
      {/* Botón de asistente de voz - only show if not on AIChat screen */}
      {showAIButton && <AIButton />}
    </>
  );
};

export default StackNavigator;