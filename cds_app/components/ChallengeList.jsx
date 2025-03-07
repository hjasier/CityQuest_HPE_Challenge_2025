import React, { useEffect } from 'react';
import { FlatList, SafeAreaView, View, Text, ActivityIndicator } from 'react-native';
import ChallengeCard from './ChallengeCard'; // Make sure this component exists and is styled correctly
import { observer } from '@legendapp/state/react';
import { challenges$  } from '../database/SupaLegend'; // Import the observable




// Observer to listen for changes in challenges$
const ChallengeList = observer(() => {
  const challenges = challenges$.get();
  
  if (!challenges) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2345ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="">
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
