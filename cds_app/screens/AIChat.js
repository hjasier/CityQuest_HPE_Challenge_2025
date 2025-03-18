import React, { useState, useEffect, useRef } from "react";
import {View,Text,ScrollView,TouchableOpacity,SafeAreaView} from "react-native";
import { AudioSession, LiveKitRoom} from '@livekit/react-native';
import {  RoomAudioRenderer } from "@livekit/components-react";

import {TrackReferenceOrPlaceholder, useChat, useLocalParticipant, useTrackTranscription} from "@livekit/components-react";
import SimpleVoiceAssistant from "../components/SimpleVoiceAssistant";



const wsURL = "wss://hpecdsapp-bunrp52d.livekit.cloud";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibXkgbmFtZSIsInZpZGVvIjp7InJvb21Kb2luIjp0cnVlLCJyb29tIjoicm9vbS0yMTY5YTViNiIsImNhblB1Ymxpc2giOnRydWUsImNhblN1YnNjcmliZSI6dHJ1ZSwiY2FuUHVibGlzaERhdGEiOnRydWV9LCJzdWIiOiJteSBuYW1lIiwiaXNzIjoiQVBJNk1GRXp3NUFpZnpDIiwibmJmIjoxNzQyMzI5NDk5LCJleHAiOjE3NDIzNTEwOTl9.Mw7UBivtzE784amGR_9uSG0pJAAk1W6BkOMR4pv0Zz4";


const AIChat = () => {
  const [isConnected, setIsConnected] = useState(false);

  

  

  useEffect(() => {
    const setupAudio = async () => {
      await AudioSession.startAudioSession();
    };
    setupAudio();
    return () => {
      AudioSession.stopAudioSession();
    };
  }, []);


  
  return (
    <LiveKitRoom
      serverUrl={wsURL}
      token={token}
      connect={true}
      audio={true}
      video={false}
      onConnected={() => setIsConnected(true)}
      onDisconnected={() => setIsConnected(false)}
    >

      
      <SafeAreaView className="flex-1 bg-gray-100">
        {/* Header */}
        <View className="flex-row justify-between items-center bg-blue-600 px-5 py-4">
          <Text className="text-lg font-bold text-white">AI Assistant</Text>
          <View className="flex-row items-center">
            <View
              className={`h-3 w-3 rounded-full mr-2 ${
                isConnected ? "bg-green-400" : "bg-red-400"
              }`}
            />
            <TouchableOpacity className="py-1 px-3">
              <Text className="text-white font-medium">Clear</Text>
            </TouchableOpacity>
          </View>
        </View>

        
        <SimpleVoiceAssistant />

      </SafeAreaView>
    </LiveKitRoom>
  );
};

export default AIChat;