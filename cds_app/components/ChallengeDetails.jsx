import { View, Text, Image, TouchableOpacity, StyleSheet , Alert } from 'react-native'
import { MapPin, CheckCircle, Navigation2 } from 'react-native-feather'
import MapView from 'react-native-maps';
import React, { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import ChallengeReviews from './ChallengeReviews';
import MapboxGL from '@rnmapbox/maps';


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
      <View className="flex-row items-center mb-6">
        <Text className="font-medium">Puntos: </Text>
        <Text className="font-bold">{challenge.reward}k</Text>
      </View>
      
      {/* Map View */}
      <View className="w-full h-48 rounded-lg overflow-hidden mb-6">
        <MapboxGL.MapView
          style={{flex:1}}
          zoomEnabled
          scaleBarEnabled={false}
          styleURL='mapbox://styles/asiier/cm86e6z8s007t01safl5m10hl/draft'
        >
        <MapboxGL.Camera animationDuration={0} 
        centerCoordinate={[challenge.Location?.longitude, challenge.Location?.latitude]} 
        zoomLevel={14} />
        <MapboxGL.PointAnnotation
          id="pointAnnotation"
          coordinate={[challenge.Location?.longitude, challenge.Location?.latitude]}
        >
          <MapPin stroke="#2AF" fill="#000" />
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