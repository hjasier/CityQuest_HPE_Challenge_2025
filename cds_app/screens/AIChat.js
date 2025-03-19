import React, { useState, useEffect } from "react";
import { AudioSession, LiveKitRoom} from '@livekit/react-native';
import VoiceAssistantChat from "../components/VoiceAssistantChat";
import { LIVEKIT_WS_URL, SERVER_API_URL } from "@env"; 

const AIChat = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [token, setToken] = useState(null);


  useEffect(() => {
    const setupAudio = async () => {
      await AudioSession.startAudioSession();
    };
    setupAudio();
    return () => {
      AudioSession.stopAudioSession();
    };
  }, []);

  
  {/* Fetchear el token de auth para livekit desde nuestra api */}
  useEffect(() => {
    const fetchToken = async () => {
      console.log('Fetching token');
      try {
        const response = await fetch(`${SERVER_API_URL}/getToken`);
        if (!response.ok) {
          throw new Error('Failed to fetch token');
        }
        const token = await response.text(); 
        setToken(token);  
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };
    fetchToken();
  }, []);
  
  
  


  return (
    <LiveKitRoom
      serverUrl={LIVEKIT_WS_URL}
      token={token}
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