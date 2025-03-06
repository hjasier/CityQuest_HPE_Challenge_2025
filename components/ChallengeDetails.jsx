import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { MapPin, CheckCircle, Navigation2 } from 'react-native-feather'
import MapView from 'react-native-maps';


const ChallengeDetails = () => {

    
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
      <MapView 
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
      </View>
      
      {/* Action Buttons */}
      <View className="flex-row justify-between pb-6">
        <TouchableOpacity className="flex-row items-center justify-center bg-blue-100 rounded-lg py-3 px-6 w-44">
          <CheckCircle stroke="#3B82F6" width={20} height={20} />
          <Text className="ml-2 font-semibold text-blue-600">Completar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="flex-row items-center justify-center bg-gray-100 rounded-lg py-3 px-6 w-44">
          <Navigation2 stroke="#4B5563" width={20} height={20} />
          <Text className="ml-2 font-semibold text-gray-600">Ruta</Text>
        </TouchableOpacity>
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