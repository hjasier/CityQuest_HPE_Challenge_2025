import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { CheckCircle, Navigation2 } from 'react-native-feather'
import { useNavigation } from '@react-navigation/native';
import { useCurrentRoute } from '../hooks/useCurrentRoute';
import { useCurrentChallenge } from '../hooks/useCurrentChallenge';
import { useWKBCoordinates } from '../hooks/useWKBCoordinates';
import * as Location from 'expo-location';

const FixedPanel = ({challenge}) => {

  const navigation = useNavigation();
  const { setCurrentRoute } = useCurrentRoute();
  const { setCurrentChallenge } = useCurrentChallenge();
  const coordinates = useWKBCoordinates(challenge.Location?.point);
  const [userLocation, setUserLocation] = useState(null);


  const handleRoute = async () => {
    try {
      // Get current position when route is requested
      const location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest});
      
      // Set the current route before navigating
      setCurrentRoute({
        startCoordinates: [location.coords.longitude, location.coords.latitude], // User's current coordinates
        endCoordinates: [coordinates.longitude, coordinates.latitude], // Challenge coordinates
        profile: 'walking'
      });

      setCurrentChallenge(challenge);

      // Navigate to Main tab
      navigation.navigate('Main');
    } catch (error) {
      Alert.alert('Error', 'Unable to retrieve your location. Please check your device settings.');
      console.error(error);
    }
  }

  const handleComplete = () => {
    if (challenge?.completion_type === 'QR') {
      // Navigate to QR screen
      navigation.navigate("ChallengeScanQRScreen");
    }
    else if (challenge?.completion_type === 'WKB') {
      // Navigate to WKB screen
      navigation.navigate("CompleteWKBChallengeScreen",{challenge: challenge});
    }
  }

  return (
    <View className="w-full h-24 absolute  bg-white bottom-0 pt-4 px-6 border-t border-slate-300">

      {/* Action Buttons */}
      <View className="flex-row justify-between pb-6">
        <TouchableOpacity onPress={handleComplete} className="flex-row items-center justify-center bg-blue-100 rounded-lg py-3 px-6 w-36">
          <CheckCircle stroke="#3B82F6" width={20} height={20} />
          <Text className="ml-2 font-semibold text-blue-600">Completar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={handleRoute} className="flex-row items-center justify-center bg-gray-100 rounded-lg py-3 px-6 w-36">
          <Navigation2 stroke="#4B5563" width={20} height={20} />
          <Text className="ml-2 font-semibold text-gray-600">Ruta</Text>
        </TouchableOpacity>
      </View>

    </View>
  )
}

export default FixedPanel;