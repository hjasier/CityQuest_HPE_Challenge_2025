import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Easing,
} from "react-native";
import {
  AudioSession,
  LiveKitRoom,
  useTracks,
  TrackReferenceOrPlaceholder,
  VideoTrack,
  isTrackReference,
  registerGlobals,
} from '@livekit/react-native';

import { Track } from 'livekit-client';
import { FontAwesome } from "@expo/vector-icons";
import ListeningDots from "../components/ListeningDots";
import ThinkingDots from "../components/ThinkingDots";




const wsURL = "wss://hpecdsapp-bunrp52d.livekit.cloud";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibXkgbmFtZSIsInZpZGVvIjp7InJvb21Kb2luIjp0cnVlLCJyb29tIjoicm9vbS0yYjdmZDZkNCIsImNhblB1Ymxpc2giOnRydWUsImNhblN1YnNjcmliZSI6dHJ1ZSwiY2FuUHVibGlzaERhdGEiOnRydWV9LCJzdWIiOiJteSBuYW1lIiwiaXNzIjoiQVBJZGhYOG80NDJUQnpMIiwibmJmIjoxNzQyMjM4Mzg3LCJleHAiOjE3NDIyNTk5ODd9.teoUXThebsHNfMjSeCvrkwODpymQso8LJmbb430bAM0";


const AIChat = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([]);
  const [transcription, setTranscription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef(null);
  

  const { agentTranscriptions } = useVoiceAssistant();
  const localParticipant = useLocalParticipant();
  const { segments: userTranscriptions } = useTrackTranscription({
    publication: localParticipant.microphoneTrack,
    source: Track.Source.Microphone,
    participant: localParticipant.localParticipant,
  });

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
    if (userTranscriptions.length > 0) {
      const latestUserText = userTranscriptions[userTranscriptions.length - 1].text;
      setTranscription(latestUserText);
    }
  }, [userTranscriptions]);
  
  useEffect(() => {
    if (agentTranscriptions.length > 0) {
      const latestAIText = agentTranscriptions[agentTranscriptions.length - 1].text;
      addAIMessage(latestAIText);
    }
  }, [agentTranscriptions]);
  

  const generateMessageId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const formatTimestamp = () => {
    const now = new Date();
    return `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  const clearChat = () => {
    setMessages([]);
    setTranscription("");
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    
    if (isListening) {
      // If stopping listening and there's transcription, add as user message
      if (transcription.trim()) {
        addUserMessage(transcription);
        setTranscription("");
      }
    }
  };

  const addUserMessage = (text) => {
    const newMessage = {
      id: generateMessageId(),
      text: text,
      isUser: true,
      timestamp: formatTimestamp(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const addAIMessage = (text) => {
    setIsLoading(false);
    const newMessage = {
      id: generateMessageId(),
      text: text,
      isUser: false,
      timestamp: formatTimestamp(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const handleTranscriptionUpdate = (text) => {
    setTranscription(text);
  };

  const handleAIResponse = (text) => {
    setIsLoading(true);
    // Simulate AI thinking time
    setTimeout(() => {
      addAIMessage(text);
      setIsLoading(false);
    }, 1500);
  };

  useEffect(() => {
    if (transcription.trim()) {
      // When transcription changes, scroll to bottom
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  }, [transcription]);

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
            <TouchableOpacity onPress={clearChat} className="py-1 px-3">
              <Text className="text-white font-medium">Clear</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Chat Messages */}
        <ScrollView
          className="flex-1 px-4"
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {messages.length === 0 ? (
            <View className="flex-1 justify-center items-center py-12">
              <Text className="text-gray-500 text-base text-center">
                Start a conversation by pressing the microphone button
              </Text>
            </View>
          ) : (
            <View className="py-4">
              {messages.map((message) => (
                <View
                  key={message.id}
                  className={`rounded-2xl px-4 py-3 my-2 max-w-3/4 ${
                    message.isUser
                      ? "bg-blue-500 self-end ml-auto"
                      : "bg-white self-start mr-auto shadow-sm"
                  }`}
                >
                  <Text className={`text-base ${message.isUser ? "text-white" : "text-gray-800"}`}>
                    {message.text}
                  </Text>
                  <Text className={`text-xs text-right mt-1 ${message.isUser ? "text-blue-100" : "text-gray-500"}`}>
                    {message.timestamp}
                  </Text>
                </View>
              ))}

              {/* AI is typing indicator */}
              {isLoading && (
                <View className="bg-white self-start mr-auto rounded-2xl px-4 py-2 my-2 shadow-sm">
                  <Text className="text-gray-500 text-sm mb-1">AI is thinking</Text>
                  <ThinkingDots />
                </View>
              )}
            </View>
          )}
        </ScrollView>

        {/* Live Transcription */}
        {isListening && transcription && (
          <View className="bg-white mx-4 mb-2 rounded-lg p-3 shadow-sm">
            <Text className="text-gray-800">{transcription}</Text>
          </View>
        )}

        {/* Controls */}
        <View className="p-4 flex-row justify-between items-center border-t border-gray-300 bg-white">
          <TouchableOpacity
            onPress={toggleListening}
            className={`px-4 py-3 rounded-full flex-row items-center justify-center ${
              isListening ? "bg-red-500" : "bg-blue-600"
            }`}
            style={{ width: 150 }}
          >
            {isListening ? (
              <>
                <FontAwesome name="microphone" size={20} color="white" />
                <View className="ml-2">
                  <ListeningDots />
                </View>
              </>
            ) : (
              <>
                <FontAwesome name="microphone" size={20} color="white" />
                <Text className="text-white ml-2">Start Listening</Text>
              </>
            )}
          </TouchableOpacity>

          {/* End Conversation Button */}
          <TouchableOpacity
            onPress={clearChat}
            className="bg-gray-600 px-4 py-3 rounded-full"
          >
            <Text className="text-white">End Conversation</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LiveKitRoom>
  );
};

export default AIChat;