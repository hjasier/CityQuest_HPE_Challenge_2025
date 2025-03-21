import React, { useEffect, useRef, useState } from 'react';
import { Animated, View, Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import { Camera, CameraView } from 'expo-camera';
import { Gyroscope } from 'expo-sensors';
import { set } from 'lodash';
import { useLocalParticipant} from "@livekit/components-react";



const AnimatedView = styled(Animated.View);
const AnimatedText = styled(Animated.Text);

const CameraMessageView = ({ toggleCamera, isVisible, transcription }) => {
  const viewOpacity = useRef(new Animated.Value(0)).current;
  const [hasPermission, setHasPermission] = useState(null);
  const [gyroscopeData, setGyroscopeData] = useState({ x: 0, y: 0, z: 0 });
  const [isStable, setIsStable] = useState(false);
  // Short countdown to be more responsive
  const [countdown, setCountdown] = useState(2);
  const [photoTaken, setPhotoTaken] = useState(false);
  const stableTimerRef = useRef(null);
  const gyroReadingsRef = useRef([]);
  const cameraRef = useRef(null); // Reference to CameraView
  const localParticipant = useLocalParticipant();
  
  
  
  // Animation for the photo capture flash effect
  const flashAnimation = useRef(new Animated.Value(0)).current;
  
  // Drastically increased threshold for normal handheld use
  const stableThreshold = 0.5; 
  // Small moving average window for faster response
  const movingAverageWindow = 3;

  // Subscribe to gyroscope data
  useEffect(() => {
    if (isVisible) {
      const subscription = Gyroscope.addListener(gyroscopeData => {
        setGyroscopeData(gyroscopeData);
        
        // Add current reading to the last few readings
        gyroReadingsRef.current.push(gyroscopeData);
        
        // Keep only the most recent readings
        if (gyroReadingsRef.current.length > movingAverageWindow) {
          gyroReadingsRef.current.shift();
        }
        
        // Calculate average movement over the window
        const avgMovement = calculateAverageMovement();
        
        // Check if phone is stable using the average movement
        const isCurrentlyStable = avgMovement < stableThreshold;
        
        if (isCurrentlyStable && !isStable) {
          // Start stability timer when phone becomes stable
          if (!stableTimerRef.current) {
            stableTimerRef.current = setTimeout(() => {
              setIsStable(true);
              startCountdown();
            }, 50); // Near-instant response (just enough time to avoid jitter)
          }
        } else if (!isCurrentlyStable && avgMovement > stableThreshold * 3) {
          // Only reset for very significant movement (3x threshold)
          // This makes it extremely tolerant to normal hand movements
          if (stableTimerRef.current) {
            clearTimeout(stableTimerRef.current);
            stableTimerRef.current = null;
          }
          if (isStable && countdown > 0) {
            // Reset countdown if large movement detected during countdown
            setIsStable(false);
          }
        }
      });
      
      return () => {
        subscription.remove();
        if (stableTimerRef.current) clearTimeout(stableTimerRef.current);
        gyroReadingsRef.current = [];
      };
    }
  }, [isVisible, isStable, countdown]);

  // Calculate average movement from gyroscope readings with higher weight on recent readings
  const calculateAverageMovement = () => {
    if (gyroReadingsRef.current.length === 0) return 0;
    
    // Give more weight to the most recent reading for faster response
    const latestReading = gyroReadingsRef.current[gyroReadingsRef.current.length - 1];
    const latestMovement = Math.sqrt(
      Math.pow(latestReading.x, 2) + 
      Math.pow(latestReading.y, 2) + 
      Math.pow(latestReading.z, 2)
    );
    
    // 70% latest reading, 30% historical average for responsiveness
    if (gyroReadingsRef.current.length === 1) return latestMovement;
    
    // Calculate historical average (excluding latest)
    const historicalReadings = gyroReadingsRef.current.slice(0, -1);
    const historicalSum = historicalReadings.reduce((acc, reading) => {
      return acc + Math.sqrt(
        Math.pow(reading.x, 2) + 
        Math.pow(reading.y, 2) + 
        Math.pow(reading.z, 2)
      );
    }, 0);
    
    const historicalAvg = historicalSum / historicalReadings.length;
    
    // Weighted average (70% latest, 30% historical)
    return (0.7 * latestMovement) + (0.3 * historicalAvg);
  };

  // Start countdown timer when phone is stable
  const startCountdown = () => {
    console.log("Starting countdown...");
    setCountdown(2); 
  
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval); 
          takePhoto();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  // Play the camera flash animation
  const playFlashAnimation = () => {
    // Reset animation value
    flashAnimation.setValue(0);
    
    // Create sequence: flash to white, then fade back to transparent
    Animated.sequence([
      // Flash to white
      Animated.timing(flashAnimation, {
        toValue: 1,
        duration: 100, // Quick flash
        useNativeDriver: true,
      }),
      // Fade back to transparent
      Animated.timing(flashAnimation, {
        toValue: 0,
        duration: 300, // Slightly slower fade out
        useNativeDriver: true,
      })
    ]).start();
  };

  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        // Play the flash animation
        playFlashAnimation();
        
        const photo = await cameraRef.current.takePictureAsync();
        console.log("📸 Photo taken!", photo.uri);
        setPhotoTaken(true);
        await sendPhotoToLiveKit(photo);
      
        //wait for 500ms before hiding the camera
        setTimeout(() => {
          toggleCamera();
        }, 500);
      } catch (error) {
        console.error("Error taking photo:", error);
      }
    } else {
      console.warn("Camera is not ready");
    }
  };

    // Function to send photo to LiveKit assistant
  const sendPhotoToLiveKit = async (photo) => {
    try {
      // Primero necesitamos obtener el blob desde la URI de la foto
      const response = await fetch(photo.uri);
      const blob = await response.blob();
      
      // Crear un objeto File a partir del blob
      const fileName = `photo_${Date.now()}.jpg`;
      const fileToSend = new File([blob], fileName, { type: 'image/jpeg' });
      
      // Enviar el archivo usando LiveKit
      const info = await localParticipant.sendFile(fileToSend, {
        mimeType: 'image/jpeg',
        topic: 'user-taken-image', 
        onProgress: (progress) => console.log('Enviando foto, progreso:', Math.ceil(progress * 100)),
      });
      
      console.log(`Foto enviada con ID de stream: ${info.id}`);
    } catch (error) {
      console.error('Error enviando foto a LiveKit:', error);
    }
  };

  useEffect(() => {
    // Request camera permissions
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    // Animate the entire view when visibility changes
    if (isVisible) {
      Animated.timing(viewOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(viewOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      
      // Reset counters when hiding camera
      setIsStable(false);
      setCountdown(2);
      setPhotoTaken(false);
      if (stableTimerRef.current) clearTimeout(stableTimerRef.current);
      stableTimerRef.current = null;
      gyroReadingsRef.current = [];
    }
  }, [isVisible]);

  const message = transcription || "Pulsa para cerrar";

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <View className="absolute bottom-70"><Text>No access to camera</Text></View>;
  }

  return (
    <AnimatedView
      className="absolute rounded-lg overflow-hidden"
      style={{
        opacity: viewOpacity,
        bottom: 70, // Position above the button
        width: 180,
        height: 180,
        transform: [{ translateX: -60 }], // Center the view
        display: isVisible ? 'flex' : 'none',
      }}
    >
      {/* Camera View */}
      <View className="relative w-full h-full border-white border-4 overflow-hidden bg-gray-900">
        {isVisible && (
          <CameraView animateShutter={false} ref={cameraRef} ratio='1:1' className="flex-1" facing='back'></CameraView>
        )}
        
        {/* Flash animation overlay */}
        <Animated.View 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'white',
            opacity: flashAnimation,
          }}
        />
        
        {/* Semi-transparent overlay at the top with text */}
        <TouchableOpacity onPress={() => toggleCamera()} className="absolute top-0 w-full bg-black/50 px-2 py-1">
          <Text className="text-white text-xs text-center">
            {message}
          </Text>
        </TouchableOpacity>
        
        {/* Countdown overlay in the middle */}
        {isStable && (
          <View className="absolute inset-0 flex items-center justify-center">
            <View className="bg-black/10 rounded-full w-16 h-16 flex items-center justify-center">
              {photoTaken ? (
                <Text className="text-white text-sm font-bold text-center">🥔</Text>
              ) : (
                <Text className="text-white text-3xl font-bold">{countdown}</Text>
              )}
            </View>
          </View>
        )}
      </View>
    </AnimatedView>
  );
};

export default CameraMessageView;