import { View, Text, Image, TouchableOpacity, StyleSheet , Alert } from 'react-native'
import { MapPin, CheckCircle, Navigation2 } from 'react-native-feather'
import MapView from 'react-native-maps';
import React, { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import ChallengeReviews from './ChallengeReviews';
import { useWKBCoordinates } from '../hooks/useWKBCoordinates';
import { Icon } from '@rneui/base';
import DetailsMapPoint from './DetailsMapPoint';
import DetailsMapRoute from './DetailsMapRoute';

const ChallengeDetails = ({challenge}) => {
  const [location, setLocation] = useState(null);


  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se necesita acceso a la ubicación para mostrar el mapa.');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    })();
  }, []);


    
  return (
    <View className="flex-1">
      {/* Challenge Description */}
      <Text className="text-gray-800 leading-5 mb-5">
        {challenge.description}
      </Text>
      
      {/* Challenge Points */}
      <View className="flex-row items-center mb-2">
        <Text className="font-medium">Puntos: </Text>
        <Text className="font-bold pr-2">{challenge.reward}k</Text>
        <Icon name="coins" type="font-awesome-5" color="#FFD700" size={16} className="ml-1" />
      </View>

      {/* Challenge Completion Type */}
      <View className="mb-6">
        <View className="flex-row items-center pb-1">
          <Text className="font-medium">Forma de Completado: </Text>
          <Text className="font-bold pr-2">{challenge.CompletionType.type}</Text>
          <Icon
            name={
              challenge.CompletionType.type === 'PHOTO'
                ? 'camera'
                : challenge.CompletionType.type === 'QR'
                ? 'qr-code'
                : challenge.CompletionType.type === 'GPS'
                ? 'crosshairs-gps'
                : challenge.CompletionType.type === 'GPS-ROUTE'
                ? 'crosshairs-gps'
                : 'check-circle'
            }
            type={
              challenge.CompletionType.type === 'QR'
                ? 'ionicon'
                : challenge.CompletionType.type === 'GPS' || challenge.CompletionType.type === 'GPS-ROUTE'
                ? 'material-community'
                : 'font-awesome-5'
            }
            color="#FFD700"
            size={16}
            className="ml-1"
          />
        </View>

        <Text className="text-gray-400">
          {challenge.CompletionType.type === 'PHOTO'
            ? 'Saca una foto al elemento citado en el desafío estando a al menos 50 metros del mismo.'
            : challenge.CompletionType.type === 'QR'
            ? 'Escanea el QR del ticket/entrada que aplique al desafío para completarlo.'
            : challenge.CompletionType.type === 'GPS'
            ? 'Pasa a menos de 75 metros del punto para completar el desafío.'
            : challenge.CompletionType.type === 'GPS-ROUTE'
            ? 'Pasa por todos los puntosa de la ruta para completar el desafío.'
            : ''}
        </Text>
      </View>
      
      <View className="w-full h-48 rounded-lg overflow-hidden mb-6">
        {challenge.CompletionType.type !== 'GPS-ROUTE' ? (
        <DetailsMapPoint challenge={challenge}/>
        ) : (
        <DetailsMapRoute challenge={challenge}/>
        )}
      </View>

      {/* Reviews */}
      <View className="flex-row items-center mb-6">
        <ChallengeReviews />
      </View>
      

    </View>
  )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
});


export default ChallengeDetails