import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, View, Text, ActivityIndicator } from 'react-native';
import ChallengeCard from './ChallengeCard'; 
import { observer } from '@legendapp/state/react';
import { Challenge$ } from '../database/SupaLegend'; // Import the observable
import { supabase } from '../database/supabase';
import { ScrollView } from 'react-native-gesture-handler';

const ChallengeList = observer(() => {
  const [challenges, setChallenges] = useState(null);
  //const challenges = Challenge$.get(); 

  async function fetchChallenges() {
    let { data: Challenge, error } = await supabase
    .from('Challenge')
    .select('*')
    setChallenges(Challenge)
  }

  useEffect(() => {
    fetchChallenges()
  }
  , [])


  const channels = supabase.channel('custom-all-channel')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'Challenge' },
    (payload) => {
      console.log('Change received!', payload)
      fetchChallenges()
    }
  )
  .subscribe()
  
  if (!challenges) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2345ff" />
      </SafeAreaView>
    );
  }

  return (
      <View>
        <View className="items-center">
          <Text className="text-lg">{Object.values(challenges).length} Retos Disponibles</Text>
        </View>
        <ScrollView className="pb-64">
        <FlatList
          data={Object.values(challenges)} // Convert the state object into an array
          renderItem={({ item }) => <ChallengeCard challenge={item} />}
          keyExtractor={(item) => item.id}
        />
     </ScrollView>
      </View>
  );
});

export default ChallengeList;
