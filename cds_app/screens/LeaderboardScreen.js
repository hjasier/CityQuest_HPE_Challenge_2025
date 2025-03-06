import React from 'react';
import { View, Text, Image, ScrollView, SafeAreaView, StatusBar } from 'react-native';

// Sample data for the leaderboard
const leaderboardData = [
  { id: 1, name: 'EmilyInPhoenix', xp: 345, avatar: 'E', color: '#5DADE2', isCurrentUser: true, position: 1 },
  { id: 2, name: 'william', xp: 283, avatar: null, avatarImage: require('../assets/monkey-avatar.png'), color: '#85C1E9', position: 2 },
  { id: 3, name: 'Xavier', xp: 615, avatar: 'X', color: '#C39BD3', isHighlighted: true, position: 3 },
  { id: 4, name: 'Stevenator', xp: 50, avatar: null, avatarImage: require('../assets/testImg.png'), color: '#F7DC6F', position: 4 },
  { id: 5, name: 'christensen', xp: 60, avatar: 'C', color: '#7DCEA0', position: 5 },
  { id: 6, name: 'Emily Kilber', xp: 58, avatar: 'E', color: '#C39BD3', badgeImage: require('../assets/testImg.png'), position: 6 },
];



// League badge component
const LeagueBadge = () => (
  <View className="flex-row items-center justify-center py-4 border-b border-gray-200">
    <View className="items-center">
      <View className="flex-row mb-2">
        {/* Skill icons */}
        <View className="w-10 h-10 mx-1 rounded-lg bg-yellow-200 opacity-50" />
        <View className="w-10 h-10 mx-1 rounded-lg bg-blue-200" />
        <View className="w-10 h-10 mx-1 rounded-lg bg-pink-200" />
        <View className="w-10 h-10 mx-1 rounded-lg bg-green-300">
        </View>
        <View className="w-10 h-10 mx-1 rounded-lg bg-gray-200" />
        <View className="w-10 h-10 mx-1 rounded-lg bg-gray-200" />
        <View className="w-10 h-10 mx-1 rounded-lg bg-gray-200" />
      </View>
      
      <Text className="text-2xl font-bold text-gray-700 mb-2">Ranking De Hoy</Text>
      

    </View>
  </View>
);

// User row component for the leaderboard
const UserRow = ({ user }) => {
  // Get background color based on highlight status
  const getBgColor = () => {
    if (user.isHighlighted) return 'bg-green-100';
    return 'bg-white';
  };

  // Get position badge style based on position
  const getPositionBadge = () => {
    if (user.position === 1) return 'bg-yellow-400';
    if (user.position === 2) return 'bg-gray-300';
    if (user.position === 3) return 'bg-yellow-600';
    return 'bg-white';
  };

  return (
    <View className={`flex-row items-center px-4 py-3 ${getBgColor()}`}>
      {/* Position number/badge */}
      <View className={`w-8 h-8 rounded-full ${getPositionBadge()} items-center justify-center mr-3`}>
        <Text className="font-bold text-gray-700">{user.position}</Text>
      </View>
      
      {/* Avatar */}
      <View className="relative mr-3">
        <View 
          className="w-12 h-12 rounded-full items-center justify-center"
          style={{ backgroundColor: user.color }}
        >
          {user.avatar ? (
            <Text className="text-white text-xl font-bold">{user.avatar}</Text>
          ) : (
            <View className="w-full h-full rounded-full overflow-hidden">
              <Image source={user.avatarImage} className="w-full h-full" />
            </View>
          )}
        </View>
        
        {/* Online indicator */}
        {(user.position === 1 || user.position === 3) && (
          <View className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
        )}
        
        {/* Badge if exists */}
        {user.badgeImage && (
          <View className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full items-center justify-center">
            <Text>😎</Text>
          </View>
        )}
      </View>
      
      {/* User name and XP */}
      <View className="flex-1 flex-row justify-between items-center">
        <Text className={`text-lg ${user.isCurrentUser ? 'font-bold' : ''}`}>
          {user.name}
        </Text>
        <Text className="text-lg font-bold text-gray-700">{user.xp} XP</Text>
      </View>
    </View>
  );
};

// Main leaderboard component
const LeaderboardScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">

      <ScrollView>
        <LeagueBadge />
        
        {/* Leaderboard list */}
        <View>
          {leaderboardData.map(user => (
            <UserRow key={user.id} user={user} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LeaderboardScreen;