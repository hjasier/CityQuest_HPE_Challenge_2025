import { View, Text , Image } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useNavigation } from '@react-navigation/native';
import { Icon } from '@rneui/themed'
import MapScreen from '../screens/MapScreen';
import ChallengeDetailsScreen from '../screens/ChallengeDetailsScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import Account from '../screens/Account';
import CTabBar from '../components/CTabBar';
import LeaderBoard2Screen from '../screens/LeaderBoard2Screen';
import FeedScreen from '../screens/FeedScreen';
import Profile from '../screens/Profile';





const Tab = createBottomTabNavigator()

const TabNavigator = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false); 

  
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

   // Si está cargando, mostrar un loader
   if (isLoading) {
     return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Cargando...</Text>
      </View>
     );
   }


  return (
    <Tab.Navigator 
    tabBar={props => <CTabBar {...props} />}
    screenOptions={({route}) => ({
      tabBarActiveTintColor: '#36BFF9',
      tabBarInactiveTintColor: 'gray',
      tabBarShowLabel: true,
      
      
      tabBarIcon: ({focused , color , size }) => {
        const iconSize = 20; // Set the desired icon size

        if (route.name === 'Explore') {
          return <Icon name="search" type="font-awesome-5" color={focused ? "#36BFF9":"gray"} size={iconSize} />
        } 
        else if (route.name === 'Feed') {
          return <Icon name="flag" type="font-awesome-5" color={focused ? "#36BFF9":"gray"} size={iconSize} />
        }
        else if (route.name === 'Leaderboard') {
          return <Icon name="trophy" type="font-awesome-5" color={focused ? "#36BFF9":"gray"} size={iconSize} />
        }
        else if (route.name === 'Profile') {
          return <Icon name="comment" type="font-awesome-5" color={focused ? "#36BFF9":"gray"} size={iconSize} />
        }
      }

    })}>

      <Tab.Screen name="Explore" component={MapScreen} options={{headerShown:false}}/>
      <Tab.Screen name="Leaderboard" component={LeaderBoard2Screen} options={{headerShown:false}}/>
      <Tab.Screen name="Feed" component={FeedScreen} options={{headerShown:false}} />
      <Tab.Screen name="Profile" component={Profile} options={{headerShown:false}}/>

    </Tab.Navigator>
  )
}

export default TabNavigator