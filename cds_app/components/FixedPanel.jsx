import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { CheckCircle, Navigation2 } from 'react-native-feather'
import { useNavigation } from '@react-navigation/native';

const FixedPanel = () => {

  const navigation = useNavigation();

  return (
    <View className="w-full h-24 absolute  bg-white bottom-0 pt-4 px-6 border-t border-slate-300">

      {/* Action Buttons */}
      <View className="flex-row justify-between pb-6">
        <TouchableOpacity onPress={() => navigation.navigate("ChallengeScanQRScreen")} className="flex-row items-center justify-center bg-blue-100 rounded-lg py-3 px-6 w-36">
          <CheckCircle stroke="#3B82F6" width={20} height={20} />
          <Text className="ml-2 font-semibold text-blue-600">Completar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="flex-row items-center justify-center bg-gray-100 rounded-lg py-3 px-6 w-36">
          <Navigation2 stroke="#4B5563" width={20} height={20} />
          <Text className="ml-2 font-semibold text-gray-600">Ruta</Text>
        </TouchableOpacity>
      </View>

    </View>
  )
}

export default FixedPanel