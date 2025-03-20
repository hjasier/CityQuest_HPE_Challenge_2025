import React, { useEffect, useRef, useState } from 'react';
import { Animated, View, Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import { Camera, CameraView } from 'expo-camera'; // Changed to expo-camera

const AnimatedView = styled(Animated.View);
const AnimatedText = styled(Animated.Text);

const CameraMessageView = ({ isVisible, customMessage }) => {
  const viewOpacity = useRef(new Animated.Value(0)).current;
  const [hasPermission, setHasPermission] = useState(null);
  
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
    }
  }, [isVisible]);

  const message = customMessage || "I'm listening... Speak now";

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
      </View>
    </AnimatedView>
  );
};

export default CameraMessageView;