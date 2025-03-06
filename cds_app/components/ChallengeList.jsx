import React from 'react';
import { FlatList, SafeAreaView, View } from 'react-native';
import ChallengeCard from './ChallengeCard'; // Asegúrate de importar el componente
import { Text } from 'react-native';

const ChallengeList = () => {
  // Datos de ejemplo para los desafíos (puedes personalizar esto según sea necesario)
  const challenges = [
    { id: '1', title: 'Desafío 1' },
    { id: '2', title: 'Desafío 2' },
    { id: '3', title: 'Desafío 3' },
    { id: '4', title: 'Desafío 4' },
    { id: '5', title: 'Desafío 5' },
    { id: '6', title: 'Desafío 6' },
  ];

  return (
    <SafeAreaView className="flex">
      
      <View >
      <View className="items-center">
        <Text>27 Retos Disponibles</Text>
      </View>


      <FlatList
        data={challenges}
        renderItem={({ item }) => <ChallengeCard challenge={item} />}
        keyExtractor={(item) => item.id} 
      />
    </View>
      
    </SafeAreaView>
  );
};

export default ChallengeList;
