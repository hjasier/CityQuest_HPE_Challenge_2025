import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import {
  AudioSession,
  LiveKitRoom,
  useLocalParticipant,
  useTrackTranscription,
} from "@livekit/react-native";
import { useChat } from "@livekit/components-react";
import { Track } from "livekit-client";
import { FontAwesome } from "@expo/vector-icons";
import ListeningDots from "../components/ListeningDots";
import ThinkingDots from "../components/ThinkingDots";

const wsURL = "wss://hpecdsapp-bunrp52d.livekit.cloud";
const token = "YOUR_LIVEKIT_TOKEN_HERE";

const AIChat = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const scrollViewRef = useRef(null);
  
  const localParticipant = useLocalParticipant();
  const localMessages = useTrackTranscription({
    publication: localParticipant.microphoneTrack,
    source: Track.Source.Microphone,
    participant: localParticipant.localParticipant,
  });
  const { chatMessages, send: sendChat } = useChat();

  useEffect(() => {
    const setupAudio = async () => {
      await AudioSession.startAudioSession();
    };
    setupAudio();
    return () => {
      AudioSession.stopAudioSession();
    };
  }, []);

  useEffect(() => {
    const allMessages = chatMessages.map((msg) => ({
      id: msg.timestamp,
      text: msg.message,
      timestamp: new Date(msg.timestamp).toLocaleTimeString(),
      isUser: msg.from?.identity === localParticipant.localParticipant.identity,
    }));
    
    localMessages.segments.forEach((s) => {
      allMessages.push({
        id: s.id,
        text: s.final ? s.text : `${s.text} ...`,
        timestamp: new Date().toLocaleTimeString(),
        isUser: true,
      });
    });

    setMessages(allMessages.sort((a, b) => a.timestamp - b.timestamp));
  }, [chatMessages, localMessages.segments]);

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
      {isConnected ? (
      <SafeAreaView className="flex-1 bg-gray-100">
        <View className="flex-row justify-between items-center bg-blue-600 px-5 py-4">
          <Text className="text-lg font-bold text-white">AI Assistant</Text>
          <View className="flex-row items-center">
            <View className={`h-3 w-3 rounded-full mr-2 ${isConnected ? "bg-green-400" : "bg-red-400"}`} />
            <TouchableOpacity className="py-1 px-3">
              <Text className="text-white font-medium">Clear</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1 px-4" ref={scrollViewRef}>
          {messages.length === 0 ? (
            <View className="flex-1 justify-center items-center py-12">
              <Text className="text-gray-500 text-base text-center">
                Start a conversation by speaking
              </Text>
            </View>
          ) : (
            messages.map((message) => (
              <View
                key={message.id}
                className={`rounded-2xl px-4 py-3 my-2 max-w-3/4 ${
                  message.isUser ? "bg-blue-500 self-end" : "bg-white self-start"
                }`}
              >
                <Text className={message.isUser ? "text-white" : "text-gray-800"}>{message.text}</Text>
                <Text className="text-xs text-right mt-1 text-gray-500">{message.timestamp}</Text>
              </View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
      ):(
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600">Connecting to LiveKit...</Text>
        </View>
      )}
    </LiveKitRoom>
  );
};

export default AIChat;
