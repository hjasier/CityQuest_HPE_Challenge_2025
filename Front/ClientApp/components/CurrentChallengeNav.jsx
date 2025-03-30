import { View, Text, TouchableOpacity, Vibration } from 'react-native'
import React from 'react'
import { useCurrentChallenge } from '../hooks/useCurrentChallenge';
import { CheckCircle, Navigation2, X } from 'react-native-feather';
import { useNavigation } from '@react-navigation/native';
import { useCurrentGeometryRoute } from '../hooks/useCurrentGeometryRoute';
import { set } from 'lodash';
import useChallengeCompletion from '../hooks/useChallengeCompletion';

const CurrentChallengeNav = () => {
  const {currentChallenge , setCurrentChallenge } = useCurrentChallenge();
  const { currentGeometryRoute , setCurrentGeometryRoute } = useCurrentGeometryRoute();
  const navigation = useNavigation();
  
  const { abandonChallenge, navigateToChallengeCompletion } = useChallengeCompletion(navigation);   

  const completeChallenge = () => {
    Vibration.vibrate();  
    navigateToChallengeCompletion(currentChallenge);
  }

  const handleAbandonChallenge = () => {
    Vibration.vibrate();  
    abandonChallenge();
  }


  return (
    <View className="w-full bg-white bg-opacity-20 px-4 py-3 pt-10 flex-row items-center justify-between shadow-sm border-b border-gray-200">
      {/* Left side - Challenge info */}
      <View className="flex-row items-center">
        <View className="bg-blue-500 rounded-full p-2 mr-3">
          <Navigation2 stroke="white" width={20} height={20} />
        </View>
        <View>
          <Text className="text-sm text-gray-500">En progreso</Text>
          <Text className="text-base font-bold">
          {currentChallenge?.name?.slice(0, 20) || 'Desafío actual'}
          {currentChallenge?.name?.length > 20 ? '...' : ''}
          </Text>
          <Text className="text-sm font-medium text-blue-500">{Math.round(currentGeometryRoute?.distance || 0)} metros restantes</Text>
        </View>
      </View>
      
      {/* Right side - Action buttons */}
      <View className="flex-row">
        <TouchableOpacity 
          onPress={abandonChallenge}
          className="bg-red-100 rounded-full p-2 mr-2"
        >
          <X stroke="#EF4444" width={20} height={20} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={completeChallenge}
          className="bg-green-100 rounded-full p-2"
        >
          <CheckCircle stroke="#10B981" width={20} height={20} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default CurrentChallengeNav