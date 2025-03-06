import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { MapPin, CheckCircle, Navigation2 } from 'react-native-feather'

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
      <View className="w-full h-32 rounded-lg overflow-hidden mb-6">
        <Image
          source={{
            uri: 'https://maps.googleapis.com/maps/api/staticmap?center=Deusto,Bilbao&zoom=14&size=600x300&maptype=roadmap&markers=color:red%7CDeusto,Bilbao&key=YOUR_API_KEY'
          }}
          className="w-full h-full"
          resizeMode="cover"
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

export default ChallengeDetails