import { createStackNavigator } from '@react-navigation/stack';
import SearchAlim from '../screens/SearchAlim';
import AlimSum from '../screens/AlimSum';
import MacrosMain from '../screens/MacrosMain'


const NestedStack = createStackNavigator();

const MacrosStack = () => (
  <NestedStack.Navigator>
    <NestedStack.Screen name="MacrosMain" component={MacrosMain} options={{headerShown: false}} />
    <NestedStack.Screen name="SearchAlim" component={SearchAlim} options={{headerShown: false}} />
    <NestedStack.Screen name="AlimSum" component={AlimSum} options={{headerShown: false}} />
    
  </NestedStack.Navigator>
);

export default MacrosStack;
