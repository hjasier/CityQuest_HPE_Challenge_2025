import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { SvgXml } from 'react-native-svg';
import PodiumSvg from '../assets/img/podium.svg';

// This section has been removed since we're now importing the SVG file directly

// Sample data for the leaderboard
const leaderboardData = [
    { id: 4, name: 'Liam', xp: 512, isOnline: true },
    { id: 5, name: 'Olivia', xp: 734, isOnline: false },
    { id: 6, name: 'Noah', xp: 289, isOnline: true },
    { id: 7, name: 'Emma', xp: 612, penalty: -15, isOnline: false },
    { id: 8, name: 'Oliver', xp: 845, isOnline: true },
    { id: 9, name: 'Ava', xp: 403, isOnline: false },
    { id: 10, name: 'Elijah', xp: 670, isOnline: true },
    { id: 11, name: 'Sophia', xp: 921, isOnline: false },
    { id: 12, name: 'James', xp: 378, isOnline: true }
  ];


// Top 3 players data
const topPlayers = [
  { id: 1, name: 'hjasier', position: 1 },
  { id: 2, name: 'hjasier', position: 2 },
  { id: 3, name: 'hjasier', position: 3 }
];

const LeaderboardScreen = () => {
  // Calculate time remaining in the day for the countdown
  const currentTime = new Date();
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  const timeRemaining = endOfDay - currentTime;
  
  const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  
    function getTimeLeft() {
        const now = new Date();
        const midnight = new Date(now);
        midnight.setHours(24, 0, 0, 0); // Próxima medianoche
        const diff = Math.floor((midnight - now) / 1000); // Diferencia en segundos

        return {
        hours: Math.floor(diff / 3600),
        minutes: Math.floor((diff % 3600) / 60),
        seconds: diff % 60,
        };
    }
  
    useEffect(() => {
        const interval = setInterval(() => {
        setTimeLeft(getTimeLeft());
        }, 1000); // Actualiza cada segundo

        return () => clearInterval(interval); // Limpia el intervalo al desmontar
    }, []);

  // Render each leaderboard item
  const renderItem = ({ item }) => {
    const isPenalized = item.penalty !== undefined && item.penalty < 0;
    
    return (
      <View className={`flex-row items-center py-3.5 px-4 ${isPenalized ? 'bg-green-100' : ''}`}>
        <Text className="text-lg font-medium w-8 text-blue-600">{item.id}</Text>
        <View className="flex-row items-center flex-1">
          
          {/* Avatar with online status */}
          <View className="relative mr-3.5">
            <Image 
              source={{ uri: 'https://xsgames.co/randomusers/avatar.php?g=male' }} 
              className="w-12 h-12 rounded-full"
            />
            {item.isOnline && (
              <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
            )}

            {/* Badge if exists */}
            {item.badgeImage && (
            <View className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full items-center justify-center">
                <Text>😎</Text>
            </View>
            )}
          </View>

          <Text className="text-xl font-normal">{item.name}</Text>
        </View>
        {isPenalized && (
          <Text className="mr-3 text-red-500">{item.penalty} XP</Text>
        )}
        <Text className="text-base font-medium">{item.xp} XP</Text>
      </View>
    );
  };



  const formatTimeValue = (value) => (value < 10 ? `0${value}` : value);

  return (
    <SafeAreaView className="flex-1 pt-8 bg-white">
      <ScrollView>
        <View className="items-center pt-4 pb-6">
          <Text className="text-xl font-bold mb-1">
            {formatTimeValue(timeLeft.hours)} horas{" "}
            {formatTimeValue(timeLeft.minutes)} minutos{" "}
            {formatTimeValue(timeLeft.seconds)} segundos
          </Text>
          <TouchableOpacity>
            <Text className="text-yellow-500 font-medium flex-row items-center">
              🏆 Ver premios de hoy
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Podium section */}
        <View className="mb-6">
          <PodiumSvg width="100%" height={170} />
          
          {/* Avatars on podium */}
          <View className="flex-row justify-between  -mt-16 px-5">


            {/* 2nd place */}
            <View className="items-center flex flex-row mt-4">
              <Image 
                source={{ uri: 'https://xsgames.co/randomusers/avatar.php?g=pixel' }} 
                className="w-9 h-9 rounded-full mb-2 border-2 border-gray-300"
              />
              <Text className="text-sm font-medium">{topPlayers[1].name}</Text>
            </View>
            
            {/* 1st place */}
            <View className="items-center mx-2 -mt-2">
              <Image 
                source={{ uri: 'https://xsgames.co/randomusers/avatar.php?g=female' }} 
                className="w-10 h-10 rounded-full  border-2 border-yellow-400"
              />
              <Text className="text-sm font-medium">{topPlayers[0].name}</Text>
            </View>
            
            {/* 3rd place */}
            <View className="items-center mx-2 mt-7 flex flex-row">
              <Image 
                source={{ uri: 'https://xsgames.co/randomusers/avatar.php?g=male' }} 
                className="w-6 h-6 rounded-full  border-2 border-orange-400"
              />
              <Text className="text-sm font-medium">{topPlayers[2].name}</Text>
            </View>
          </View>
        </View>
        
        {/* Leaderboard list */}
        <FlatList
          data={leaderboardData}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View className="h-px bg-gray-100" />}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default LeaderboardScreen;