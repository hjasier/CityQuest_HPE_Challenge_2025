import React, { useEffect, useState, useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import {useVoiceAssistant, useTrackTranscription, useLocalParticipant } from "@livekit/components-react";
import { Track } from "livekit-client";
import { Ionicons } from '@expo/vector-icons';
import useWebSocket from "../hooks/useWebSocket";  
import { useNavigation } from '@react-navigation/native';
import ConnectionFace from "./ConnectionFace";
import ChatStatus from "./ChatStatus";
import Message from "./Message";



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
  
  const navigation = useNavigation();
  const { message, sendMessage, connected } = useWebSocket(navigation);

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



  

  const openCamera = () => {
    sendMessage("TESST DE MENSAJE");
    console.log("Abriendo la cámara...");
  };


  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-primary p-4 pt-10 rounded-b-2xl shadow-md">
        <Text className="text-white text-xl font-bold text-center">Magellan AI</Text>
        <TouchableOpacity onPress={openCamera}>
          <Text className="text-blue-100 text-center text-sm">Habla para interactuar</Text>
        </TouchableOpacity>
        <View className=" absolute left-4 top-5 flex-col items-center justify-center mt-4 space-y-1">
          <ConnectionFace isConnected={isConnected} connected={connected} />
        </View>
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