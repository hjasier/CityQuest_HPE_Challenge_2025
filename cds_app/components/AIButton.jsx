import React, { useRef, useState, useEffect } from 'react';
import { Animated, Dimensions, View } from 'react-native';
import { Icon } from '@rneui/base';
import { styled } from 'nativewind';
import { useNavigation } from '@react-navigation/native';
import { usePanResponder } from '../hooks/usePanResponder';
import { 
  createAnimationValues, 
  createBorderRotation,
  setAIThinkingMode,
  setAISpeakingMode,
  resetButton,
  setUserSpeakingMode
} from '../utils/ButtonAnimations';
import RecordingMessage from './RecordingMessage';
import CameraMessageView from './CameraMessageView';

const AnimatedView = styled(Animated.View);
const { width, height } = Dimensions.get('window');
const BUTTON_SIZE = 60;
const MARGIN_RIGHT = 10;

const initialPosition = {
  x: width - BUTTON_SIZE - MARGIN_RIGHT,
  y: height / 2 - BUTTON_SIZE / 2,
};

const DraggableButton = () => {
  const navigation = useNavigation();
  const [isRecording, setIsRecording] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isPressing, setIsPressing] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const pan = useRef(new Animated.ValueXY(initialPosition)).current;
  
  // Initialize animation values from the utility
  const animValues = useRef(createAnimationValues());
  const pulseValue = animValues.current.pulseValue;
  const borderAnimation = animValues.current.borderAnimation;
  const speakingAnimation = animValues.current.speakingAnimation;
  
  // Create interpolated rotation
  const borderRotation = createBorderRotation(borderAnimation);

  // Create a ref to track current state values for the pan responder
  const isRecordingRef = useRef({ isRecording, isDragging });

  // Update the ref whenever state changes
  useEffect(() => {
    isRecordingRef.current = { isRecording, isDragging };
    console.log("isRecording state changed to:", isRecording);
    
    // When recording starts, show camera view after a short delay
    // This simulates a behavior where text appears first, then camera activates
    if (isRecording) {
      setTimeout(() => {
        setShowCamera(true);
      }, 500);
    } else {
      setShowCamera(false);
    }
  }, [isRecording, isDragging]);

  // Create wrapped functions that pass the required dependencies
  const handleSetAIThinkingMode = () => {
    setAIThinkingMode(
      setIsRecording, 
      setIsAiThinking, 
      setIsAiSpeaking, 
      speakingAnimation, 
      borderAnimation
    );
  };

  const handleSetAISpeakingMode = () => {
    setAISpeakingMode(
      setIsRecording, 
      setIsAiThinking, 
      setIsAiSpeaking, 
      borderAnimation, 
      speakingAnimation
    );
  };

  const handleResetButton = () => {
    resetButton(
      setIsAiThinking, 
      setIsAiSpeaking, 
      borderAnimation, 
      speakingAnimation
    );
  };

  const handleSetUserSpeakingMode = () => {
    setUserSpeakingMode(
      setIsRecording, 
      pulseValue
    );
  };

  // Set up pan responder with all the necessary dependencies
  const { panResponder } = usePanResponder({
    pan,
    navigation,
    isRecordingRef,
    isAiThinking,
    isAiSpeaking,
    setIsDragging,
    setIsPressing,
    setIsRecording,
    pulseValue,
    setUserSpeakingMode: handleSetUserSpeakingMode
  });

  return (
    <AnimatedView
      className="absolute w-[60px] h-[60px] justify-center items-center z-40"
      style={{ transform: [...pan.getTranslateTransform()] }}
      {...panResponder.panHandlers}
    >
      {/* Initial text message - visible only when recording but camera not yet shown */}
      {isRecording && !showCamera && (
        <RecordingMessage 
          isRecording={isRecording && !showCamera}
          customMessage="Starting camera..." 
        />
      )}
      
      {/* Camera view with text overlay - replaces the text message after delay */}
      <CameraMessageView 
        isVisible={showCamera} 
        customMessage="I'm listening... Speak now" 
      />
      
      {/* Spinner animation for AI thinking */}
      {isAiThinking && (
        <AnimatedView
          className="absolute w-[70px] h-[70px] rounded-full border-t-2 border-r-2 border-white opacity-75"
          style={{
            transform: [{ rotate: borderRotation }],
          }}
        />
      )}
      
      {/* Growing/shrinking border for AI speaking */}
      {isAiSpeaking && (
        <AnimatedView
          className="absolute rounded-full border-2 border-white opacity-75"
          style={{
            width: 70,
            height: 70,
            transform: [{ scale: speakingAnimation }],
          }}
        />
      )}
      
      <View 
        className={`w-[60px] h-[60px] rounded-full ${isRecording ? 'bg-red-500' : 'bg-primary'} justify-center items-center shadow-md overflow-hidden`}
      >
        {isRecording ? (
          // Mic animation for recording
          <AnimatedView
            style={{
              transform: [{ scale: pulseValue }],
            }}
          >
            <View className="flex-row mt-1">
              {[1, 2, 3].map((dot, index) => (
                <View 
                  key={index} 
                  className="w-1.5 h-1.5 bg-white rounded-full mx-0.5" 
                />
              ))}
            </View>
          </AnimatedView>
        ) : isAiThinking || isAiSpeaking ? (
          <Icon name="sparkles-sharp" type="ionicon" color="white" size={28} />
        ) : (
          <Icon name="sparkles-sharp" type="ionicon" color="white" size={28} />
        )}
      </View>
    </AnimatedView>
  );
};

export default DraggableButton;