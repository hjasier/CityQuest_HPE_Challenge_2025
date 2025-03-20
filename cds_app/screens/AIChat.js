import React from "react";
import { LiveKitRoom } from "@livekit/react-native";
import VoiceAssistantChat from "../components/VoiceAssistantChat";
import useVoiceAssistant from "../hooks/useVoiceAssistant"; // Importa el hook

const AIChat = () => {
  const { isConnected, setIsConnected, token, serverUrl } = useVoiceAssistant();

  return (
    <LiveKitRoom
      serverUrl={serverUrl}
      token={token}
      connect={true}
      audio={true}
      video={false}
      onConnected={() => setIsConnected(true)}
      onDisconnected={() => setIsConnected(false)}
    >
      <VoiceAssistantChat isConnected={isConnected} />
    </LiveKitRoom>
  );
};

export default AIChat;
