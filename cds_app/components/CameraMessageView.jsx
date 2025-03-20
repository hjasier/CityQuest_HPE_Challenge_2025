import React, { useEffect, useRef, useState } from 'react';
import { Animated, View, Text } from 'react-native';
import { styled } from 'nativewind';
import { Camera, CameraView } from 'expo-camera';
import { Gyroscope } from 'expo-sensors';

const AnimatedView = styled(Animated.View);
const AnimatedText = styled(Animated.Text);

const CameraMessageView = ({ isVisible, transcription }) => {
  const viewOpacity = useRef(new Animated.Value(0)).current;
  const [hasPermission, setHasPermission] = useState(null);
  const [gyroscopeData, setGyroscopeData] = useState({ x: 0, y: 0, z: 0 });
  const [isStable, setIsStable] = useState(false);
  const [countdown, setCountdown] = useState(2);
  const [photoTaken, setPhotoTaken] = useState(false);
  const stableTimerRef = useRef(null);
  const countdownTimerRef = useRef(null);
  const stableThreshold = 0.05; // Adjust sensitivity as needed

  // Subscribe to gyroscope data
  useEffect(() => {
    if (isVisible) {
      const subscription = Gyroscope.addListener(gyroscopeData => {
        setGyroscopeData(gyroscopeData);
        
        // Check if phone is stable
        const isCurrentlyStable = 
          Math.abs(gyroscopeData.x) < stableThreshold && 
          Math.abs(gyroscopeData.y) < stableThreshold && 
          Math.abs(gyroscopeData.z) < stableThreshold;
        
        if (isCurrentlyStable && !isStable) {
          // Start stability timer when phone becomes stable
          if (!stableTimerRef.current) {
            stableTimerRef.current = setTimeout(() => {
              setIsStable(true);
              startCountdown();
            }, 1000); // 1 second stability threshold
          }
        } else if (!isCurrentlyStable) {
          // Reset if movement detected
          if (stableTimerRef.current) {
            clearTimeout(stableTimerRef.current);
            stableTimerRef.current = null;
          }
          if (isStable && countdown > 0) {
            // Reset countdown if movement detected during countdown
            setIsStable(false);
            setCountdown(2);
            if (countdownTimerRef.current) {
              clearInterval(countdownTimerRef.current);
              countdownTimerRef.current = null;
            }
          }
        }
      });
      
      return () => {
        subscription.remove();
        if (stableTimerRef.current) clearTimeout(stableTimerRef.current);
        if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      };
    }
  }, [isVisible, isStable, countdown]);

  // Start countdown timer when phone is stable
  const startCountdown = () => {
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    
    countdownTimerRef.current = setInterval(() => {
      setCountdown(prevCount => {
        if (prevCount <= 1) {
          clearInterval(countdownTimerRef.current);
          countdownTimerRef.current = null;
          setPhotoTaken(true);
          // Reset after 2 seconds
          setTimeout(() => {
            setIsStable(false);
            setCountdown(2);
            setPhotoTaken(false);
          }, 2000);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
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
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      stableTimerRef.current = null;
      countdownTimerRef.current = null;
    }
  }, [isVisible]);

  const message = transcription || "I'm listening... Speak now";

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
          <CameraView ratio='1:1' className="flex-1" facing='back'></CameraView>
        )}
        
        {/* Semi-transparent overlay at the top with text */}
        <View className="absolute top-0 w-full bg-black/50 px-2 py-1">
          <Text className="text-white text-xs text-center">
            {message}
          </Text>
        </View>
        
        {/* Countdown overlay in the middle */}
        {isStable && (
          <View className="absolute inset-0 flex items-center justify-center">
            <View className="bg-black/70 rounded-full w-16 h-16 flex items-center justify-center">
              {photoTaken ? (
                <Text className="text-white text-sm font-bold text-center">PHOTO TAKEN!!!</Text>
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