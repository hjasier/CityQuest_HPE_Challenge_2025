import TabNavigator from './TabNavigator'
import { createStackNavigator } from '@react-navigation/stack';
import MapScreen from '../screens/MapScreen';
import ChallengeDetailsScreen from '../screens/ChallengeDetailsScreen';
import ChallengeScanQRScreen from '../screens/ChallengeScanQRScreen';
import ChallengeCompletedScreen from '../screens/ChallengeCompletedScreen';
import AIChat from '../screens/AIChat';



const Stack = createStackNavigator();

const StackNavigator = () => {

  return (
    <Stack.Navigator>
      
        <Stack.Screen name="Main" component={TabNavigator}/>
        <Stack.Screen name="MapScreen" component={MapScreen} options={{headerShown:false}} />
        <Stack.Screen name="ChallengeDetailsScreen" component={ChallengeDetailsScreen} options={{headerShown:false}} />
        <Stack.Screen name="ChallengeScanQRScreen" component={ChallengeScanQRScreen} options={{headerShown:false}} />
        <Stack.Screen name="ChallengeCompletedScreen" component={ChallengeCompletedScreen} options={{headerShown:false}} />
        <Stack.Screen name="AIChat" component={AIChat} options={{headerShown:false}} />

      
    </Stack.Navigator>
  )
}

export default StackNavigator