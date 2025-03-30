import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { CheckCircle, Navigation2 } from 'react-native-feather'
import { useNavigation } from '@react-navigation/native';
import { useCurrentRoute } from '../hooks/useCurrentRoute';
import { useCurrentChallenge } from '../hooks/useCurrentChallenge';
import { useWKBCoordinates } from '../hooks/useWKBCoordinates';
import * as Location from 'expo-location';
import useChallengeCompletion from '../hooks/useChallengeCompletion';
import useAcceptChallenge from '../hooks/useAcceptChallenge';

const FixedPanel = ({challenge}) => {

  const navigation = useNavigation();
  const { setCurrentRoute } = useCurrentRoute();
  const { setCurrentChallenge } = useCurrentChallenge();
  const { acceptChallenge } = useAcceptChallenge();

  const coordinates = useWKBCoordinates(challenge.Location?.point);

  const { navigateToChallengeCompletion } = useChallengeCompletion(navigation);


  const handleAcceptChallenge = async () => {
    try {
      // Immediately navigate to the Main tab
      navigation.navigate('Main');
  
      acceptChallenge(challenge);
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
        {(challenge.CompletionType.type === 'QR' || challenge.CompletionType.type ==='PHOTO') ? (
        <>
          <TouchableOpacity onPress={handleComplete} className="flex-row items-center justify-center bg-blue-100 rounded-lg py-3 px-6 w-36">
            <CheckCircle stroke="#3B82F6" width={20} height={20} />
            <Text className="ml-2 font-semibold text-blue-600">Completar</Text>
          </TouchableOpacity>
        
          <TouchableOpacity onPress={handleAcceptChallenge} className="flex-row items-center justify-center bg-gray-100 rounded-lg py-3 px-6 w-36">
            <Navigation2 stroke="#4B5563" width={20} height={20} />
            <Text className="ml-2 font-semibold text-gray-600">Ruta</Text>
          </TouchableOpacity>
        </>
        ):(
          <TouchableOpacity onPress={handleAcceptChallenge} className="flex-row items-center justify-center bg-blue-100 rounded-lg py-3 px-6 w-full">
            <Navigation2 stroke="#3B82F6" width={20} height={20} />
            <Text className="ml-2 font-semibold text-blue-600">Aceptar Desafío</Text>
          </TouchableOpacity>
        )}


        

      </View>

    </View>
  )
}

export default FixedPanel;