import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, View, Text, ActivityIndicator } from 'react-native';
import ChallengeCard from './ChallengeCard'; 
import { observer } from '@legendapp/state/react';
import { Challenge$ } from '../database/SupaLegend'; // Import the observable
import { ScrollView } from 'react-native-gesture-handler';
import { useChallenges } from '../hooks/useChallenges';

const ChallengeList = observer(() => {
  const { challenges, loading, error, refetch } = useChallenges();

  
  if (!challenges) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2345ff" />
      </SafeAreaView>
    );
  }

  return (
      <View>
        <View className="items-center mb-10">
          <Text className="text-lg">{Object.values(challenges).length} Retos Disponibles</Text>
        </View>
        <FlatList
          data={Object.values(challenges)} // Convert the state object into an array
          renderItem={({ item }) => <ChallengeCard challenge={item} />}
          keyExtractor={(item) => item.id}
        />
      </View>
  );
});

export default ChallengeList;
