import { View, Text, TouchableOpacity, Image, ImageBackground } from 'react-native'
import React from 'react'
import testImg from '../assets/preview2.png'
import { Icon } from '@rneui/base'
import { useNavigation } from '@react-navigation/native'
// Remove the expo-linear-gradient import

const ChallengeCard = ({challenge}) => {
  const navigation = useNavigation();
  
  // Format date for display
  const formatExpirationDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  const getChallengeType = (challenge) => {
    switch (challenge.type) {
      case 1:
        return {'icon':'hamburger','iconType':'material', 'text': 'Comida Local','color':'#FF6B35'};
      case 2:
        return {'icon':'monument','iconType':'font-awesome-5', 'text': 'Visita','color':'rgb(250 204 21)'};
      case 3:
        return {'icon':'route','iconType':'font-awesome-5', 'text': 'Ruta','color':'#4CAF50'};
    }
  }

  const challengeType = getChallengeType(challenge);

  return (
    <TouchableOpacity 
      className="mb-4 mx-2"
      onPress={() => navigation.navigate("ChallengeDetailsScreen", { challenge: challenge })}
      activeOpacity={0.9}
    >
      <View className="bg-white rounded-xl overflow-hidden shadow-lg">
        {/* Challenge Image with Overlay */}
        <View className="relative">
          <ImageBackground 
            source={challenge.cover_url ? { uri: challenge.cover_url } : testImg}
            className="h-20 w-full"
            resizeMode="cover"
          >
            {/* Overlay instead of gradient */}
            <View className="absolute bottom-0 left-0 right-0 h-20 bg-black opacity-30" />
            
            {/* Challenge Type Badge */}
            <View className="absolute top-3 left-3 px-3 py-1 rounded-full flex-row items-center" style={{ backgroundColor: challengeType.color }}>  
              <Icon 
                name={challengeType.icon}
                type="font-awesome-5" 
                color={"#333"} 
                size={14} 
              />
              <Text className="text-xs font-bold text-gray-800 ml-1">
              {challengeType.text}

              </Text>
            </View>
            
            {/* Priority Badge (if exists) */}
            {challenge.priority && (
              <View className="absolute top-3 right-3 px-3 py-1 bg-red-500 rounded-full">
                <Text className="text-xs font-bold text-white">Top {challenge.priority}</Text>
              </View>
            )}
            
            {/* Expiration Date */}
            <View className="absolute bottom-3 right-3 flex-row items-center z-10">
              <Icon name="clock" type="font-awesome-5" color="white" size={12} />
              <Text className="text-xs text-white ml-1">
                Expira: {formatExpirationDate(challenge.expiration_date)}
              </Text>
            </View>
          </ImageBackground>
        </View>
        
        {/* Challenge Content */}
        <View className="p-4">
          {/* Title and Description */}
          <Text className="text-lg font-bold text-gray-800 mb-1">{challenge.name}</Text>
          <Text className="text-sm text-gray-600 mb-3" numberOfLines={2}>
            {challenge.description}
          </Text>
          
          {/* Action Buttons */}
          {/* <View className="flex-row justify-between mb-4">
            <TouchableOpacity 
              className="bg-green-500 rounded-lg px-4 py-2 flex-row items-center"
              activeOpacity={0.8}
            >
              <Icon name="map-marker-alt" type="font-awesome-5" color="white" size={14} />
              <Text className="text-white font-semibold ml-2">Navigate</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className="bg-blue-500 rounded-lg px-4 py-2 flex-row items-center"
              activeOpacity={0.8}
            >
              <Icon name="list" type="font-awesome-5" color="white" size={14} />
              <Text className="text-white font-semibold ml-2">Checkpoints</Text>
            </TouchableOpacity>
          </View> */}
          
          {/* Stats Row */}
          <View className="flex-row justify-between px-2 pt-3 border-t border-gray-100">
            <View className="flex-row items-center">
              <Icon name="star" type="font-awesome-5" solid color="#FFC107" size={14} />
              <Text className="text-gray-700 ml-1 text-xs">Recompensa: {challenge.reward}</Text>
            </View>

            <View className="flex-row items-center">
              <Icon 
                name={challenge.repeatable ? "sync" : "check-circle"} 
                type="font-awesome-5" 
                color={challenge.repeatable ? "#4CAF50" : "#888"} 
                size={14} 
              />
              <Text className="text-gray-700 ml-1 text-xs">
                {challenge.repeatable ? "Repetible" : "Una-vez"}
              </Text>
            </View>

            <View className="flex-row items-center">
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
                color="#2196F3"
                size={16}
                className="ml-1"
              />
              <Text className="text-gray-700 ml-1 text-xs">
                {challenge.CompletionType.type}
              </Text>
            </View>

            
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default ChallengeCard