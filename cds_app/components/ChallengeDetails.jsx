import { View, Text, Image, TouchableOpacity, StyleSheet , Alert } from 'react-native'
import { MapPin, CheckCircle, Navigation2 } from 'react-native-feather'
import MapView from 'react-native-maps';
import React, { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import ChallengeReviews from './ChallengeReviews';
import MapboxGL from '@rnmapbox/maps';
import { useWKBCoordinates } from '../hooks/useWKBCoordinates';
import { Icon } from '@rneui/base';

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

  console.log(challenge.Location?.point)
  console.log(challenge.Location?.latitude)
  console.log(challenge.Location?.longitude)


  const coordinates = useWKBCoordinates(challenge.Location?.point);


    
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
          <Text className="font-bold pr-2">{challenge.completion_type}</Text>
          <Icon
            name={
              challenge.completion_type === 'PHOTO'
                ? 'camera'
                : challenge.completion_type === 'QR'
                ? 'qrcode'
                : challenge.completion_type === 'GPS'
                ? 'crosshairs-gps'
                : challenge.completion_type === 'GPS-ROUTE'
                ? 'crosshairs-gps'
                : 'check-circle'
            }
            type={
              challenge.completion_type === ('GPS' || 'GPS-ROUTE')
                ? 'material-community'
                : 'font-awesome-5'
            }
            color="#FFD700"
            size={16}
            className="ml-1"
          />
        </View>

        <Text className="text-gray-400">
          {challenge.completion_type === 'PHOTO'
            ? 'Saca una foto al elemento citado en el desafío estando a al menos 50 metros del mismo.'
            : challenge.completion_type === 'QR'
            ? 'Escanea el QR del ticket/entrada que aplique al desafío para completarlo.'
            : challenge.completion_type === 'GPS'
            ? 'Pasa a menos de 75 metros del punto para completar el desafío.'
            : challenge.completion_type === 'GPS-ROUTE'
            ? 'Pasa por todos los puntosa de la ruta para completar el desafío.'
            : ''}
        </Text>
      </View>
      
      <View className="w-full h-48 rounded-lg overflow-hidden mb-6">
        <MapboxGL.MapView
          style={{flex:1}}
          zoomEnabled
          scaleBarEnabled={false}
          styleURL='mapbox://styles/asiier/cm86e6z8s007t01safl5m10hl/draft'
        >
        <MapboxGL.Camera animationDuration={0} 
        centerCoordinate={[coordinates.longitude, coordinates.latitude]} 
        zoomLevel={14} />
        <MapboxGL.PointAnnotation
          id="pointAnnotation"
          coordinate={[coordinates.longitude, coordinates.latitude]}
        >
          <MapPin stroke="#b00202" fill="#FF3B30" />

        </MapboxGL.PointAnnotation>
        </MapboxGL.MapView>
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