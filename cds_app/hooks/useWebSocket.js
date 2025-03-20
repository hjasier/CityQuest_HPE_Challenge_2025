// hooks/useWebSocket.js

import { useState, useEffect } from "react";
import io from "socket.io-client";
import { SERVER_API_URL } from "@env"; 

const useWebSocket = (navigation) => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [connected, setConnected] = useState(false);

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
      // Cuando Flask envíe un comando, lo manejamos aquí
      console.log("Received mobile action:", data);
      setMessage(data);

      // Si el mensaje es 'calculate_route', navegar a la pantalla "Route"
      if (data.show_route) {
        navigation.navigate("Route");
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

  return { message, sendMessage, connected };
};

export default useWebSocket;
