import { useState, useEffect } from "react";
import { AudioSession } from '@livekit/react-native';
import { EXPO_PUBLIC_LIVEKIT_WS_URL, SERVER_API_URL } from "@env";
import useApiUrl from "./useApiUrl";

const useVoiceAssistant = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [token, setToken] = useState(null);
  const { apiUrl } = useApiUrl();
  

  // Configurar la sesión de audio
  useEffect(() => {
    const setupAudio = async () => {
      console.log("Setting up audio session");
      await AudioSession.startAudioSession();
    };
    setupAudio();

    return () => {
      AudioSession.stopAudioSession();
    };
  }, []);
  

  // Fetchear el token de autenticación
  useEffect(() => {
    const fetchToken = async () => {
      if (!apiUrl) {
        return;
      }
      try {
        const response = await fetch(`${apiUrl}/getToken`);
        if (!response.ok) {
          throw new Error("Failed to fetch token");
        }
        const token = await response.text();
        setToken(token);
      } catch (error) {
        //console.error("Error fetching token:", error);
      }
    };

    fetchToken();
  }, [apiUrl]);

  return {
    isConnected,
    setIsConnected,
    token,
    serverUrl: EXPO_PUBLIC_LIVEKIT_WS_URL,
  };
};

export default useVoiceAssistant;
