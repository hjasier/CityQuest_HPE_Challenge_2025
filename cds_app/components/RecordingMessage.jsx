import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { styled } from 'nativewind';

const AnimatedText = styled(Animated.Text);

const RecordingMessage = ({ isRecording, customMessage }) => {
  const textOpacity = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Animate text message when recording starts/stops
    if (isRecording) {
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(textOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isRecording]);

  const message = customMessage || "I'm listening... Speak now";

  return (
    <AnimatedText
      className="absolute bg-black/50 px-3 py-2 rounded-lg text-white text-center"
      style={{
        opacity: textOpacity,
        bottom: 70, // Position above the button
        minWidth: 150,
        transform: [{ translateX: -45 }], // Center the text
      }}
    >
      {message}
    </AnimatedText>
  );
};

export default RecordingMessage;