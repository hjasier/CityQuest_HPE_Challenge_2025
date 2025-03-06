import { View, Text , Image } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Explore from '../screens/Explore'


import { useNavigation } from '@react-navigation/native';
import { Icon } from '@rneui/themed'
import MapScreen from '../screens/MapScreen';
import TabOneScreen from '../screens/TabOneScreen';
import ChallengeDetailsScreen from '../screens/ChallengeDetailsScreen';





const Tab = createBottomTabNavigator()

const TabNavigator = () => {
  const navigation = useNavigation();
  const [initialRouteName, setInitialRouteName] = useState(''); 
  const [isLoading, setIsLoading] = useState(true); 

  
  useEffect(() => {
    const getLastTab = async () => {
      try {
        console.log('Obteniendo lastTab...');
        const lastTab = await AsyncStorage.getItem('lastTab') || 'None';
        console.log('lastTab GETEADO:', lastTab);
        if (lastTab !== 'None') {
          console.log('Hay lastTab:', lastTab);
        } else {
          console.log('No hay lastTab');
          navigation.navigate("Explore");
        }
      } catch (e) {
        console.log(e);
      }
      finally {
        setIsLoading(false);
      }
    };
    getLastTab();
  }, []);

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
    initialRouteName={initialRouteName}
    screenOptions={({route}) => ({
      tabBarActiveTintColor: '#36BFF9',
      tabBarInactiveTintColor: 'gray',
      tabBarShowLabel: false,
      
      tabBarIcon: ({focused , color , size }) => {

        if (route.name === 'ChallengeDetailsScreen') {
          return <Icon name="search" type="font-awesome-5" color={focused ? "#36BFF9":"gray"} />
        } 
        else if (route.name === 'MapScreen') {
          return <Icon name="flag" type="font-awesome-5" color={focused ? "#36BFF9":"gray"} />
        }
        else if (route.name === 'TabOneScreen') {
          return <Icon name="comment" type="font-awesome-5" color={focused ? "#36BFF9":"gray"} />
        }
      }

    })}>

      <Tab.Screen name="ChallengeDetailsScreen" component={ChallengeDetailsScreen} options={{headerShown:false}}/>
      <Tab.Screen name="MapScreen" component={MapScreen} options={{headerShown:false}} />
      <Tab.Screen name="TabOneScreen" component={TabOneScreen} options={{headerShown:false}}/>
      


    </Tab.Navigator>
  )
}

export default TabNavigator