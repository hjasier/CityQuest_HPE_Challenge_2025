import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import useWebSocket from '../hooks/useWebSocket';
import io from "socket.io-client";

const TestWebSock = () => {



    useEffect(() => {
        console.log("TestWebSock useEffect");
    
        try {
            const socketConnection = io("http://192.168.1.144:5000", {
                transports: ["websocket"],
            });
    
            socketConnection.on("connect", () => {
                console.log("Connected to WebSocket");
            });
    
        } catch (error) {
            console.error("Error occurred in WebSocket connection:", error);
        }
    }, []);
    


  return (
    <View className="flex-1 items-center justify-center">
      <Text>TestWebSock</Text>
    </View>
  )
}

export default TestWebSock