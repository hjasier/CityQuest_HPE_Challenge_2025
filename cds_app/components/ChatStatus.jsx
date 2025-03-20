

import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';

const ChatStatus = ({ state }) => {
    let statusMessage = "";
    let icon = null;
    
    switch (state) {
      case "connecting":
        statusMessage = "Conectando...";
        icon = <ActivityIndicator size="small" color="#3b82f6" />;
        break;
      case "connected":
        statusMessage = "Escuchando...";
        icon = <Ionicons name="mic" size={18} color="#3b82f6" />;
        break;
      case "thinking":
        statusMessage = "Pensando...";
        icon = <ActivityIndicator size="small" color="#3b82f6" />;
        break;
      case "speaking":
        statusMessage = "Respondiendo...";
        icon = <Ionicons name="volume-high" size={18} color="#3b82f6" />;
        break;
      default:
        statusMessage = "Esperando...";
        icon = <Ionicons name="ellipsis-horizontal" size={18} color="#3b82f6" />;
    }
    
    return (
      <View className="flex-row items-center justify-center py-2 bg-blue-50 rounded-full mb-3">
        <View className="mr-2">{icon}</View>
        <Text className="text-blue-500 font-medium">{statusMessage}</Text>
      </View>
    );
};

  
export default ChatStatus