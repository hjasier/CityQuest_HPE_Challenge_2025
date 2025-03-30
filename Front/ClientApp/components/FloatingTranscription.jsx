import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { styled } from 'nativewind';
import { Track } from "livekit-client";
import {useVoiceAssistant, useTrackTranscription, useLocalParticipant} from "@livekit/components-react";

const FloatingTranscription = ({ isConnected }) => {
  // Inicializamos el estado de los mensajes
  const [messages, setMessages] = useState([]);
  const { state, audioTrack, agentTranscriptions,  } = useVoiceAssistant();
  const localParticipant = useLocalParticipant();
  const { segments: userTranscriptions } = useTrackTranscription({
    publication: localParticipant.microphoneTrack,
    source: Track.Source.Microphone,
    participant: localParticipant.localParticipant,
  });

  useEffect(() => {
    // Crear el array de mensajes combinados (agente y usuario)
    const allMessages = [
      ...(agentTranscriptions?.map((t) => ({ ...t, type: "agent" })) ?? []),
      ...(userTranscriptions?.map((t) => ({ ...t, type: "user" })) ?? []),
    ].sort((a, b) => a.firstReceivedTime - b.firstReceivedTime);
    
    // Actualizamos el estado con todos los mensajes ordenados
    setMessages(allMessages);
    
  }, [agentTranscriptions, userTranscriptions]);

  // Mostrar solo el último mensaje
  const lastMessage = messages[messages.length - 1];
  const messageToDisplay = lastMessage ? lastMessage.text : "Conectando...";

  return (
    <View
      className="absolute bg-black/50 px-1 py-2 rounded-lg"
      style={{
        bottom: 70, // Posición sobre el botón
        minWidth: 150,
        transform: [{ translateX: -45 }], // Centrar el texto
      }}
    >
      <Text className="text-white text-center">{messageToDisplay}</Text>
    </View>
  );
};

export default FloatingTranscription;
