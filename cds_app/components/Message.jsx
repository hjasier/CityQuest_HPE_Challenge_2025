import { View, Text } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';

const Message = ({ type, text }) => {
    const isAgent = type === "agent";
    
    return (
      <View className={`mb-3 flex flex-row ${isAgent ? "justify-start" : "justify-end"}`}>
        {isAgent && (
          <View className="h-10 w-10 rounded-full bg-blue-100 mr-2 items-center justify-center">
            <Ionicons name="chatbubble-ellipses" size={20} color="#3b82f6" />
          </View>
        )}
        
        <View 
          className={`rounded-2xl px-4 py-3 max-w-[80%] ${
            isAgent 
              ? "bg-gray-100 rounded-tl-none" 
              : "bg-blue-500 rounded-tr-none"
          }`}
        >
          <Text 
            className={`${
              isAgent ? "text-gray-800" : "text-white"
            } text-sm`}
          >
            {text}
          </Text>
        </View>
        
        {!isAgent && (
          <View className="h-10 w-10 rounded-full bg-blue-500 ml-2 items-center justify-center">
            <Ionicons name="person" size={18} color="white" />
          </View>
        )}
      </View>
    );
  };

export default Message