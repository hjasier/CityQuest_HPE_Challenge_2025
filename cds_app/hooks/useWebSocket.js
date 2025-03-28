// hooks/useWebSocket.js

import { useState, useEffect } from "react";
import io from "socket.io-client";
import { SERVER_API_URL } from "@env"; 

const useWebSocket = (navigation) => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [connected, setConnected] = useState(false);
  const [isAiIsSeeing, setIsAiIsSeeing] = useState(false); // Estado para controlar la cámara

  useEffect(() => {
    console.log("Connecting to WebSocket:", SERVER_API_URL);
    // Crear la conexión WebSocket
    const socketConnection = io(SERVER_API_URL, {
      transports: ["websocket"],
    });

    socketConnection.on("connect", () => {
      setConnected(true);
      console.log("Connected to WebSocket");
    });

    socketConnection.on("disconnect", () => {
      setConnected(false);
      console.log("Disconnected from WebSocket");
    });

    socketConnection.on("mobile_action", (data) => {
      const action = data.action;
      console.log("Received mobile action:", action);

      switch (action) {
        case "show_route":
          navigation.navigate("Route");
          break;
        case "show_camera":
          setIsAiIsSeeing(true);
          break;
        default:
          console.log("Unknown action:", action);
          break;
      }


    });

    setSocket(socketConnection);

    return () => {
      socketConnection.disconnect();
    };
  }, [navigation]);



  
  const sendMessage = (data) => {
    console.log("Socket is connected:", connected);
    if (socket && connected) {
      console.log("Sending message to server:", data);
      socket.emit("mobile_response", data);
    }
  };

  const toggleCamera = () => {
    setIsAiIsSeeing((prev) => !prev);
  };

  return { message, sendMessage, connected, isAiIsSeeing, toggleCamera };
};

export default useWebSocket;
