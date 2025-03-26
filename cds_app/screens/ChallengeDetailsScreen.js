import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeft } from 'react-native-feather'
import BottomSheetChallengeDetails from '../components/BottomSheetChallengeDetails'
import { useNavigation, useRoute } from '@react-navigation/native'
import FixedPanel from '../components/FixedPanel'
import FixedHeaderChallengeDetails from '../components/FixedHeaderChallengeDetails'

const ChallengeDetailsScreen = () => {

  const route = useRoute();
  const challenge = route.params.challenge;

  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-white">

      {/* Fixed Header */}
      <FixedHeaderChallengeDetails />

      {/* Food Image */}
      <View className="w-full h-72">
        <Image
          source={challenge.cover_url ? { uri: challenge.cover_url } : testImg}
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