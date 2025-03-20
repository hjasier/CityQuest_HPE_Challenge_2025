import { Animated } from 'react-native';

// Create and initialize animation values
export const createAnimationValues = () => {
  return {
    spinValue: new Animated.Value(0),
    pulseValue: new Animated.Value(1),
    borderAnimation: new Animated.Value(0),
    speakingAnimation: new Animated.Value(1)
  };
};

// Start spinning border animation - FOR THINKING MODE
export const startBorderAnimation = (borderAnimation) => {
  Animated.loop(
    Animated.timing(borderAnimation, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    })
  ).start();
};

// Start growing/shrinking border animation - FOR SPEAKING MODE
export const startSpeakingAnimation = (speakingAnimation) => {
  Animated.loop(
    Animated.sequence([
      Animated.timing(speakingAnimation, {
        toValue: 1.2,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(speakingAnimation, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
    ])
  ).start();
};

// Start pulsing mic animation
export const startPulseAnimation = (pulseValue) => {
  Animated.loop(
    Animated.sequence([
      Animated.timing(pulseValue, {
        toValue: 1.2,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(pulseValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ])
  ).start();
};

// Create interpolated rotation for border
export const createBorderRotation = (borderAnimation) => {
  return borderAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
};

// Button state control functions
export const setAIThinkingMode = (
  setIsRecording, 
  setIsAiThinking, 
  setIsAiSpeaking, 
  speakingAnimation, 
  borderAnimation
) => {
  setIsRecording(false);
  setIsAiThinking(true);
  setIsAiSpeaking(false);
  speakingAnimation.stopAnimation();
  speakingAnimation.setValue(1);
  startBorderAnimation(borderAnimation);
};

export const setAISpeakingMode = (
  setIsRecording, 
  setIsAiThinking, 
  setIsAiSpeaking, 
  borderAnimation, 
  speakingAnimation
) => {
  setIsRecording(false);
  setIsAiThinking(false);
  setIsAiSpeaking(true);
  borderAnimation.stopAnimation();
  borderAnimation.setValue(0);
  startSpeakingAnimation(speakingAnimation);
};

export const resetButton = (
  setIsAiThinking, 
  setIsAiSpeaking, 
  borderAnimation, 
  speakingAnimation
) => {
  setIsAiThinking(false);
  setIsAiSpeaking(false);
  borderAnimation.stopAnimation();
  borderAnimation.setValue(0);
  speakingAnimation.stopAnimation();
  speakingAnimation.setValue(1);
};

export const setUserSpeakingMode = (
  setIsRecording, 
  pulseValue
) => {
  setIsRecording(true);
  startPulseAnimation(pulseValue);
};