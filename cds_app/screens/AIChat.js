import React, { useState, useEffect } from "react";
import { AudioSession, LiveKitRoom} from '@livekit/react-native';
import VoiceAssistantChat from "../components/VoiceAssistantChat";
import { LIVEKIT_WS_URL, LIVEKIT_TOKEN } from "@env"; 


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
      serverUrl={LIVEKIT_WS_URL}
      token={LIVEKIT_TOKEN}
      connect={true}
      audio={true}
      video={false}
      onConnected={() => setIsConnected(true)}
      onDisconnected={() => setIsConnected(false)}
    >

      <VoiceAssistantChat  isConnected={isConnected} />

    </LiveKitRoom>
  );
};

export default AIChat;