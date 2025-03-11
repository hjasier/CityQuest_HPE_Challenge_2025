import { View, Text, Image, ScrollView, Touchable, TouchableOpacity } from 'react-native';
import React from 'react';
import { tw } from 'nativewind';

const reviews = [
  {
    name: 'John Doe',
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 4,
    reviewText: 'Great challenge, really enjoyed it!',
    timestamp: 'Hace 2 horas',
  },
  {
    name: 'Jane Smith',
    profileImage: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5,
    reviewText: 'Amazing! Would do it again!',
    timestamp: 'Hace 5 horas',
  },
  {
    name: 'Alex Johnson',
    profileImage: 'https://randomuser.me/api/portraits/men/15.jpg',
    rating: 3,
    reviewText: 'It was okay, could be better.',
    timestamp: 'Hace 1 día',
  },
];

const StarRating = ({ rating }) => {
  const stars = Array(5)
    .fill(false)
    .map((_, index) => index < rating);

  return (
    <View className="flex-row">
      {stars.map((isFilled, index) => (
        <Text key={index} className={isFilled ? 'text-yellow-400' : 'text-gray-300'}>
          ★
        </Text>
      ))}
    </View>
  );
};

const ChallengeReviews = () => {
  return (
    <View>
      <View>
        <Text className="text-2xl font-semibold">Reseñas</Text>
        <View className="flex-row items-center">
          <Text className="text-slate-600 text-4xl font-bold my-1">4.3</Text>
          <Text className="text-yellow-500 text-2xl ">★</Text>
        </View>
    </View>
    <View className="space-y-4 pb-36">
      {reviews.map((review, index) => (
        <View key={index} className="p-4 bg-white rounded-lg shadow-md">
          <View className="flex-row items-center mb-2">
            <Image
              source={{ uri: review.profileImage }}
              className="w-10 h-10 rounded-full mr-3"
            />
            <View>
              <Text className="font-semibold text-lg">{review.name}</Text>
              <Text className="text-sm text-gray-500">{review.timestamp}</Text>
            </View>
          </View>
          <StarRating rating={review.rating} />
          <Text className="mt-2 text-gray-700">{review.reviewText}</Text>
        </View>
      ))}
              
      <TouchableOpacity className="bg-gray-100 text-white text-center items-center py-3 rounded-full">
        <Text className="font-bold">Mostrar todas las reseñas</Text>
      </TouchableOpacity>
    </View>

    
    </View>
  );
};

export default ChallengeReviews;
