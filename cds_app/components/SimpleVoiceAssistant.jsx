import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import {
  useVoiceAssistant,
  useTrackTranscription,
  useLocalParticipant,
} from "@livekit/components-react";
import { Track } from "livekit-client";

const Message = ({ type, text }) => {
  return (
    <View className="mb-2">
      <Text className={`font-bold ${type === "agent" ? "text-blue-500" : "text-gray-800"}`}>
        {type === "agent" ? "Agent: " : "You: "}
      </Text>
      <Text className="text-sm">{text}</Text>
    </View>
  );
};

const SimpleVoiceAssistant = () => {
  const { state, audioTrack, agentTranscriptions } = useVoiceAssistant();
  const localParticipant = useLocalParticipant();
  const { segments: userTranscriptions } = useTrackTranscription({
    publication: localParticipant.microphoneTrack,
    source: Track.Source.Microphone,
    participant: localParticipant.localParticipant,
  });

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const allMessages = [
      ...(agentTranscriptions?.map((t) => ({ ...t, type: "agent" })) ?? []),
      ...(userTranscriptions?.map((t) => ({ ...t, type: "user" })) ?? []),
    ].sort((a, b) => a.firstReceivedTime - b.firstReceivedTime);
    setMessages(allMessages);
  }, [agentTranscriptions, userTranscriptions]);

  return (
    <View className="flex-1 bg-white p-4">
      
      <ScrollView className="flex-1">
        {messages.map((msg, index) => (
          <Message key={msg.id || index} type={msg.type} text={msg.text} />
        ))}
      </ScrollView>
    </View>
  );
};

export default SimpleVoiceAssistant;
