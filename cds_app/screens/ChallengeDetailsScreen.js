import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeft } from 'react-native-feather'
import BottomSheetChallengeDetails from '../components/BottomSheetChallengeDetails'
import { useNavigation } from '@react-navigation/native'
import FixedPanel from '../components/FixedPanel'
import FixedHeaderChallengeDetails from '../components/FixedHeaderChallengeDetails'

const ChallengeDetailsScreen = () => {

  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-white">

      {/* Fixed Header */}
      <FixedHeaderChallengeDetails />

      {/* Food Image */}
      <View className="w-full h-72">
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1592321675774-3de57f3ee0dc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
          }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      {/* Bottom Sheet with Challenge Details */}
      <BottomSheetChallengeDetails />
      <FixedPanel />
    </View>
  )
}

export default ChallengeDetailsScreen