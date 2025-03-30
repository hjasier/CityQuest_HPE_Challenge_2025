import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, ActivityIndicator } from 'react-native';
import ChallengeCard from './ChallengeCard'; 
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useFilteredChallenges } from '../hooks/useFilteredChallenges';

const ChallengeList = () => {
  const { filteredChallenges } = useFilteredChallenges();

  useEffect(() => {
    console.log('[COMPONENT] FILTER UPDATE');
  }
  , [filteredChallenges]);

  if (!filteredChallenges) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2345ff" />
      </SafeAreaView>
    );
  }

  return (
      <View className="pb-32">
        <View className="items-center mb-10">
          <Text className="text-lg">{Object.values(filteredChallenges).length} Retos Disponibles</Text>
        </View>
        <BottomSheetFlatList
          data={Object.values(filteredChallenges)} // Convert the state object into an array
          renderItem={({ item }) => <ChallengeCard challenge={item} />}
          keyExtractor={(item) => item.id}
        />
      </View>
  );
};

export default ChallengeList;
