// hooks/useWebSocket.js

import { useState, useEffect } from "react";
import io from "socket.io-client";
import { SERVER_API_URL } from "@env"; 
import * as Location from 'expo-location';
import useAcceptChallenge from "./useAcceptChallenge";
import useApiUrl from "./useApiUrl";

const useWebSocket = (navigation) => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [connected, setConnected] = useState(false);
  const [isAiIsSeeing, setIsAiIsSeeing] = useState(false); // Estado para controlar la cámara
  const { acceptChallenge } = useAcceptChallenge();
  const { apiUrl } = useApiUrl();

  useEffect(() => {
    if (!apiUrl) {
      return;
    }
    console.log("Connecting to WebSocket:", apiUrl);
    // Crear la conexión WebSocket
    const socketConnection = io(apiUrl, {
      transports: ["websocket"],
    });

    const handle_send_location = async () => {
      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest
        });
        const data = {
          type: "location", 
          location: {"lat": location.coords.latitude, "lon": location.coords.longitude}
        };
        socketConnection.emit("mobile_response", data);
        console.log("Location sent:", data);
      } catch (error) {
        console.error("Error sending location:", error);
      }
    };

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
        case "accept_challenge":
          acceptChallenge(data.challenge);
          break;
        case "get_location":
          handle_send_location();
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
  }, [navigation,apiUrl]);



  
  const sendMessage = (data) => {
    console.log("Socket is connected:", connected);
    if (socket && connected) {
      try {
        socket.emit("mobile_response", data);
        console.log("Message sent to server:", data);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };


  const toggleCamera = () => {
    setIsAiIsSeeing((prev) => !prev);
  };

  return { message, sendMessage, connected, isAiIsSeeing, toggleCamera };
};

export default useWebSocket;
