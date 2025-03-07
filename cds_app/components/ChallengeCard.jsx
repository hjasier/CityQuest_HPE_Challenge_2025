import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import testImg from '../assets/testImg.png'
import { Icon } from '@rneui/base'
import { useNavigation } from '@react-navigation/native'

const ChallengeCard = ({challenge}) => {

  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.navigate("ChallengeDetailsScreen")}>
    <View className="rounded-lg shadow-md p-4 mx-2">
      {/* Challenge Title */}
      <View className="flex flex-row">
        <View className="p-2 bg-yellow-400 justify-center items-center align-middle rounded-full">
            <Icon name="hamburger" type="font-awesome-5" color="#888" size={20} />
        </View>
      </View>
      <View className="flex flex-row items-center mb-3">
        <Text className="text-base font-semibold text-gray-800">{challenge.name}</Text>
      </View>

      {/* Content Container */}
      <View className="flex flex-row">
        {/* Image */}
        <Image 
          source={testImg} 
          className="w-14 h-14 rounded-md mr-3" 
          resizeMode="cover" 
        />
        
        {/* Right Side Content */}
        <View className="flex-1">
          {/* Action Buttons */}
          <View className="flex flex-row justify-between mb-3">
            <TouchableOpacity className="bg-green-500 rounded-lg px-3 py-2">
              <View className="flex flex-row items-center space-x-2">
                <Icon name="map-marker-alt" type="font-awesome-5" color="white" size={16} />
                <Text className="text-white font-semibold">Navegar</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity className="bg-green-500 rounded-lg px-3 py-2">
              <View className="flex flex-row items-center space-x-2">
                <Icon name="list" type="font-awesome-5" color="white" size={16} />
                <Text className="text-white font-semibold">Check-Points</Text>
              </View>
            </TouchableOpacity>
          </View>
          
          {/* Stats */}
          <View className="flex flex-row justify-between">
            <View className="flex flex-row items-center">
              <Icon name="heart" type="font-awesome-5" color="#888" size={16} className="mr-1" />
              <Text className="text-gray-700">321</Text>
            </View>

            <View className="flex flex-row items-center">
              <Icon name="route" type="font-awesome-5" color="#888" size={16} className="mr-1" />
              <Text className="text-gray-700">410m</Text>
            </View>

            <View className="flex flex-row items-center">
              <Icon name="flag" type="font-awesome-5" color="#888" size={16} className="mr-1" />
              <Text className="text-gray-700">5128</Text>
            </View>

            <View className="flex flex-row items-center">
              <Icon name="university" type="font-awesome-5" color="#888" size={16} className="mr-1" />
              <Text className="text-gray-700">71</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
    </TouchableOpacity>
  )
}

export default ChallengeCard