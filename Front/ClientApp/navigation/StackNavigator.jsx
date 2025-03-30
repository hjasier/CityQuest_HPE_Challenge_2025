import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigationState } from '@react-navigation/native';
import TabNavigator from './TabNavigator';
import MapScreen from '../screens/MapScreen';
import ChallengeDetailsScreen from '../screens/ChallengeDetailsScreen';
import ChallengeScanQRScreen from '../screens/ChallengeScanQRScreen';
import ChallengeCompletedScreen from '../screens/ChallengeCompletedScreen';
import AIChatScreen from '../screens/AIChatScreen';
import Route from '../screens/Route';
import AIButton from "../components/AIButton";
import MapRouteComponent from '../components/MapRouteComponent';
import Account from '../screens/Account';
import CreateCollaborativeGroup from '../screens/CreateCollaborativeGroup';
import JoinGroupScreen from '../screens/JoinGroupScreen';
import MyGroupScreen from '../screens/MyGroupScreen';
import RequestApiUrlScreen from '../screens/RequestApiUrlScreen';

const Stack = createStackNavigator();

const StackNavigator = () => {
  // Get the current screen name from navigation state
  const currentScreen = useNavigationState(state => 
    state?.routes[state.index]?.name
  );
  
  // Only show AIButton if we're not on the AIChatScreen screen
  const showAIButton = currentScreen !== 'AIChatScreen';
  
  return (
    <>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen name="MapScreen" component={MapScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ChallengeDetailsScreen" component={ChallengeDetailsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ChallengeScanQRScreen" component={ChallengeScanQRScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ChallengeCompletedScreen" component={ChallengeCompletedScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AIChatScreen" component={AIChatScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Route" component={Route} options={{ headerShown: false }} />
        <Stack.Screen name="MapRouteComponent" component={MapRouteComponent} options={{ headerShown: false }} />
        <Stack.Screen name="Account" component={Account} options={{ headerShown: false }} />
        <Stack.Screen name="CreateCollaborativeGroup" component={CreateCollaborativeGroup} options={{ headerShown: false }} />
        <Stack.Screen name="JoinGroupScreen" component={JoinGroupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MyGroupScreen" component={MyGroupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="RequestApiUrlScreen" component={RequestApiUrlScreen} options={{ headerShown: false }} />
      </Stack.Navigator>

      {/* Botón de asistente de voz */}
      {showAIButton && <AIButton />}
    </>
  );
};

export default StackNavigator;