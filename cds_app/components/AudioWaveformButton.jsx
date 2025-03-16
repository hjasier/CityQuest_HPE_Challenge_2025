import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const AnimatedView = styled(Animated.View);

const AudioWaveformButton = ({ isRecording }) => {
  // Create animated values for each bar in the waveform
  const bar1 = useRef(new Animated.Value(0.3)).current;
  const bar2 = useRef(new Animated.Value(0.5)).current;
  const bar3 = useRef(new Animated.Value(0.7)).current;
  const bar4 = useRef(new Animated.Value(0.4)).current;
  const bar5 = useRef(new Animated.Value(0.6)).current;

  // Animation function to create the pulsing effect
  const animateBar = (barRef, minHeight, maxHeight, duration) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(barRef, {
          toValue: maxHeight,
          duration: duration,
          useNativeDriver: false,
        }),
        Animated.timing(barRef, {
          toValue: minHeight,
          duration: duration,
          useNativeDriver: false,
        }),
      ])
    ).start();
  };

  // Start or stop the animations based on recording state
  useEffect(() => {
    if (isRecording) {
      // Start animations with different timings for a more natural look
      animateBar(bar1, 0.2, 0.8, 600);
      animateBar(bar2, 0.3, 0.9, 450);
      animateBar(bar3, 0.2, 1.0, 500);
      animateBar(bar4, 0.3, 0.8, 550);
      animateBar(bar5, 0.2, 0.9, 650);
    } else {
      // Reset animations
      bar1.setValue(0.3);
      bar2.setValue(0.5);
      bar3.setValue(0.7);
      bar4.setValue(0.4);
      bar5.setValue(0.6);
    }

    // Clean up animations when component unmounts or recording state changes
    return () => {
      bar1.stopAnimation();
      bar2.stopAnimation();
      bar3.stopAnimation();
      bar4.stopAnimation();
      bar5.stopAnimation();
    };
  }, [isRecording]);

  if (!isRecording) return null;

  return (
    <StyledView className="flex flex-row items-center justify-center w-full h-full">
      <AnimatedView
        className="bg-white mx-1 rounded-full"
        style={{
          width: 3,
          height: bar1.interpolate({
            inputRange: [0, 1],
            outputRange: ['10%', '60%'],
          }),
        }}
      />
      <AnimatedView
        className="bg-white mx-1 rounded-full"
        style={{
          width: 3,
          height: bar2.interpolate({
            inputRange: [0, 1],
            outputRange: ['10%', '60%'],
          }),
        }}
      />
      <AnimatedView
        className="bg-white mx-1 rounded-full"
        style={{
          width: 3,
          height: bar3.interpolate({
            inputRange: [0, 1],
            outputRange: ['10%', '70%'],
          }),
        }}
      />
      <AnimatedView
        className="bg-white mx-1 rounded-full"
        style={{
          width: 3,
          height: bar4.interpolate({
            inputRange: [0, 1],
            outputRange: ['10%', '60%'],
          }),
        }}
      />
      <AnimatedView
        className="bg-white mx-1 rounded-full"
        style={{
          width: 3,
          height: bar5.interpolate({
            inputRange: [0, 1],
            outputRange: ['10%', '60%'],
          }),
        }}
      />
    </StyledView>
  );
};

export default AudioWaveformButton;