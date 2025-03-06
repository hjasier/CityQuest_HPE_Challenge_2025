import { View, Text } from 'react-native'
import React from 'react'
import ChallengeDetails from './ChallengeDetails'

const BottomSheetChallengeDetails = () => {
  return (
    <View className="flex-1 bg-white rounded-t-3xl -mt-8 px-5 pt-6 shadow-lg">
      {/* Card Title */}
      <Text className="text-2xl font-bold mb-2">
        Prueba Comida Local en el Área de Deusto
      </Text>
      
      {/* Difficulty and Rating */}
      <View className="flex-row items-center mb-1">
        <Text className="text-gray-700 mr-2">Fácil</Text>
        <View className="flex-row items-center">
          <Text className="text-green-500 font-bold">★</Text>
          <Text className="ml-1">4.3</Text>
        </View>
      </View>
      
      {/* Location */}
      <Text className="text-gray-600 mb-4">
        Deusto, Bilbao, Vizcaya
      </Text>
      
      <View className="h-0.5 bg-gray-100 mb-4" />
      
      {/* Challenge Details Component */}
      <ChallengeDetails />
    </View>
  )
}

export default BottomSheetChallengeDetails