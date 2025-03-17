import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const AnimatedView = styled(Animated.View);

const AudioWaveformAnimation = ({ isRecording }) => {
  // Create multiple bar animations
  const barCount = 5;
  const bars = useRef(
    Array.from({ length: barCount }, () => new Animated.Value(0.5))
  ).current;
  
  // Effect to animate bars when recording
  useEffect(() => {
    if (isRecording) {
      // Create animations for each bar
      const animations = bars.map((bar, index) => {
        return Animated.loop(
          Animated.sequence([
            Animated.timing(bar, {
              toValue: 1,
              duration: 300 + Math.random() * 400, // Randomize timing
              useNativeDriver: true,
            }),
            Animated.timing(bar, {
              toValue: 0.3,
              duration: 300 + Math.random() * 400,
              useNativeDriver: true,
            }),
          ])
        );
      });
      
      // Start all animations
      Animated.stagger(100, animations).start();
      
      return () => {
        // Stop animations when recording stops
        animations.forEach(anim => anim.stop());
      };
    } else {
      // Reset bars when not recording
      bars.forEach(bar => bar.setValue(0.5));
    }
  }, [isRecording]);
  
  return (
    <StyledView className="flex-row justify-center items-center h-6 space-x-1">
      {bars.map((bar, index) => (
        <AnimatedView
          key={`bar-${index}`}
          className="w-1 bg-white rounded-full"
          style={{
            height: bar.interpolate({
              inputRange: [0, 1],
              outputRange: [4, 16], // Height range from 4 to 16
            }),
            opacity: isRecording ? 1 : 0.5,
          }}
        />
      ))}
    </StyledView>
  );
};

export default AudioWaveformAnimation;