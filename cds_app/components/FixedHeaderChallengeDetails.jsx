import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { ArrowLeft } from 'react-native-feather'
import { useNavigation } from '@react-navigation/native';

const FixedHeaderChallengeDetails = () => {
  const navigation = useNavigation();

  return (
    <View>

      {/* Header with back button */}
      <View className="absolute z-10 top-12 left-4">
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          className="bg-white p-2 rounded-full shadow-md"
        >
          <ArrowLeft stroke="#000" width={24} height={24} />
        </TouchableOpacity>
      </View>

    </View>
  )
}

export default FixedHeaderChallengeDetails