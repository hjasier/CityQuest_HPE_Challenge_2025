import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { CheckCircle, Navigation2 } from 'react-native-feather'
import { useNavigation } from '@react-navigation/native';
import { useCurrentRoute } from '../hooks/useCurrentRoute';
import { useCurrentChallenge } from '../hooks/useCurrentChallenge';
import { useWKBCoordinates } from '../hooks/useWKBCoordinates';
import * as Location from 'expo-location';
import useChallengeCompletion from '../hooks/useChallengeCompletion';

const FixedPanel = ({challenge}) => {

  const navigation = useNavigation();
  const { setCurrentRoute } = useCurrentRoute();
  const { setCurrentChallenge } = useCurrentChallenge();
  const coordinates = useWKBCoordinates(challenge.Location?.point);

  const { navigateToChallengeCompletion } = useChallengeCompletion(navigation);


  const handleRoute = async () => {
    try {
      // Immediately navigate to the Main tab
      navigation.navigate('Main');
  
      // Asynchronously get the current location in the background
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest
      });
  
      // Once location is retrieved, update the route
      setCurrentRoute({
        startCoordinates: [location.coords.longitude, location.coords.latitude], // User's current coordinates
        endCoordinates: [coordinates.longitude, coordinates.latitude], // Challenge coordinates
        profile: 'walking'
      });
  
      // Set the current challenge
      setCurrentChallenge(challenge);
    } catch (error) {
      // If location retrieval fails, show an alert
      Alert.alert('Location Error', 'Unable to retrieve your location. Please check your device settings.');
      console.error(error);
    }
  }
  

  const handleComplete = () => {
    navigateToChallengeCompletion(challenge);
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