import React, { useState } from 'react';
import { FlatList, SafeAreaView, View, Text, ActivityIndicator } from 'react-native';
import ChallengeCard from './ChallengeCard'; 
import { observer } from '@legendapp/state/react';
import { Challenge$ } from '../database/SupaLegend'; // Import the observable

const ChallengeList = observer(() => {
  // Directly bind to the observable instead of using state
  const challenges = Challenge$.get(); // Automatically listens for changes

  
  if (!challenges) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2345ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <View className="items-center">
          <Text className="text-lg">{Object.values(challenges).length} Retos Disponibles</Text>
        </View>
        <FlatList
          data={Object.values(challenges)} // Convert the state object into an array
          renderItem={({ item }) => <ChallengeCard challenge={item} />}
          keyExtractor={(item) => item.id}
        />
      </View>
    </SafeAreaView>
  );
});

export default ChallengeList;
