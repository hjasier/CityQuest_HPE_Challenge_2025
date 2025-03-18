import React, { useEffect, useState, useRef } from "react";
import { View, Text, ScrollView, ActivityIndicator, Image, TouchableOpacity } from "react-native";
import {
  useVoiceAssistant,
  useTrackTranscription,
  useLocalParticipant,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { Ionicons } from '@expo/vector-icons'; // Requiere instalar: npm install @expo/vector-icons

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

const VoiceAssistantChat = ({isConnected}) => {
  const { state, audioTrack, agentTranscriptions } = useVoiceAssistant();
  const localParticipant = useLocalParticipant();
  const { segments: userTranscriptions } = useTrackTranscription({
    publication: localParticipant.microphoneTrack,
    source: Track.Source.Microphone,
    participant: localParticipant.localParticipant,
  });

  const [messages, setMessages] = useState([]);
  const scrollViewRef = useRef();

  useEffect(() => {
    const allMessages = [
      ...(agentTranscriptions?.map((t) => ({ ...t, type: "agent" })) ?? []),
      ...(userTranscriptions?.map((t) => ({ ...t, type: "user" })) ?? []),
    ].sort((a, b) => a.firstReceivedTime - b.firstReceivedTime);
    setMessages(allMessages);
    
    // Auto-scroll al último mensaje
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [agentTranscriptions, userTranscriptions]);

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-blue-500 p-4 rounded-b-2xl shadow-md">
        <Text className="text-white text-xl font-bold text-center">Laki</Text>
        <Text className="text-blue-100 text-center text-sm">Habla para interactuar</Text>

        <View
            className={`h-3 w-3 rounded-full mr-2 ${
            isConnected ? "bg-green-400" : "bg-red-400"
            }`}
        />
      </View>
      
      {/* Chat Status */}
      <View className="px-4 pt-3">
        <ChatStatus state={state} />
      </View>
      
      {/* Messages */}
      <ScrollView 
        className="flex-1 px-4" 
        ref={scrollViewRef}
        contentContainerStyle={{ paddingVertical: 10 }}
      >
        {messages.length === 0 ? (
          <View className="flex-1 items-center justify-center py-10">
            <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-4">
              <Ionicons name="chatbubbles-outline" size={32} color="#3b82f6" />
            </View>
            <Text className="text-gray-500 text-center">
              Di algo para comenzar la conversación
            </Text>
          </View>
        ) : (
          messages.map((msg, index) => (
            <Message key={msg.id || index} type={msg.type} text={msg.text} />
          ))
        )}
      </ScrollView>
      
      {/* Footer mic indicator */}
      <View className="p-4 border-t border-gray-200">
        <View className="flex-row items-center justify-center bg-gray-100 p-3 rounded-full">
          <Ionicons 
            name={state === "connected" ? "mic" : "mic-off"} 
            size={24} 
            color={state === "connected" ? "#3b82f6" : "#9ca3af"} 
          />
          <Text className="ml-2 text-gray-600">
            {state === "connected" ? "Micrófono activo" : "Esperando..."}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default VoiceAssistantChat;