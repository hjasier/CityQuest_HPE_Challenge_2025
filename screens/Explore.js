import { View, Text , TouchableHighlight } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { MaterialIcons , FontAwesome } from '@expo/vector-icons';

import { TouchableOpacity } from 'react-native-gesture-handler';
import ChallengeCard from '../components/ChallengeCard';


const MacrosMain = () => {

  return (
    <SafeAreaView className="flex-1">

      <ChallengeCard />
      <ChallengeCard />
      <ChallengeCard />
      <ChallengeCard />



    </SafeAreaView>
  )
}

export default MacrosMain