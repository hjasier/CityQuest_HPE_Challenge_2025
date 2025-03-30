import { View, Text } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Updates from 'expo-updates';
import { useEffect } from 'react';


const UpdateAppButton = () => {

    
  async function onFetchUpdateAsync() {
    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        alert('Se ha encontrado una nueva actualización');
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
      else {
        alert('No se ha encontrado ninguna actualización.');
      }
    } catch (error) {
      alert(`Error fetching latest Expo update: ${error}`);
    }
  }


  return (
    <TouchableOpacity onPress={() => onFetchUpdateAsync()} className="flex-row items-center justify-between p-4 border-b border-gray-100">
        <View className="flex-row items-center">
        <View className="bg-blue-100 p-2 rounded-lg mr-3">
            <Ionicons name="cloud-download-outline" size={22} color="#rgb(63, 184, 254)" />
        </View>
        <View>
            <Text className="text-gray-700 font-medium">Actualizar app</Text>
            <Text className="text-gray-500 text-xs">Updates Enabled: {Updates.isEnabled ? 'Yes ': 'No'}</Text> 
            <Text className="text-gray-500 text-xs">Version: {Updates.runtimeVersion}</Text>
        </View>

        </View>
        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
    </TouchableOpacity>
  )
}

export default UpdateAppButton