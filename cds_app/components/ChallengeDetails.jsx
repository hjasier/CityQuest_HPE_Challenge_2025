import { View, Text, Image, TouchableOpacity, StyleSheet , Alert } from 'react-native'
import { MapPin, CheckCircle, Navigation2 } from 'react-native-feather'
import MapView from 'react-native-maps';
import React, { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import ChallengeReviews from './ChallengeReviews';


const ChallengeDetails = () => {
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
        Come cualquier tipo de alimento en un bar local dentro de la zona, el ticket de compra tendrá el QR que tendrás que escanear para completar el reto.
      </Text>
      
      {/* Challenge Points */}
      <View className="flex-row items-center mb-6">
        <Text className="font-medium">Puntos: </Text>
        <Text className="font-bold">500k</Text>
      </View>
      
      {/* Map View */}
      <View className="w-full h-48 rounded-lg overflow-hidden mb-6">
      {/* <MapView 
        style={styles.map}
        region={location} 
        showsUserLocation={true}
        followsUserLocation={true}
        scrollEnabled={false}  // Evita que el usuario deslice el mapa
        zoomEnabled={true}  // Permite hacer zoom
      /> */}
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