import { View, Text } from 'react-native'
import TabNavigator from './TabNavigator'
import { createStackNavigator } from '@react-navigation/stack';
import Explore from '../screens/Explore';
import MapScreen from '../screens/MapScreen';
import ChallengeDetailsScreen from '../screens/ChallengeDetailsScreen';



const Stack = createStackNavigator();

const StackNavigator = () => {

  return (
    <Stack.Navigator>
      
        <Stack.Screen name="Main" component={TabNavigator}/>
        <Stack.Screen name="Explore" component={Explore} options={{headerShown:false}} />
        <Stack.Screen name="MapScreen" component={MapScreen} options={{headerShown:false}} />
        <Stack.Screen name="ChallengeDetailsScreen" component={ChallengeDetailsScreen} options={{headerShown:false}} />

      
    </Stack.Navigator>
  )
}

export default StackNavigator