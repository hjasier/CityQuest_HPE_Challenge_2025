import React, { useRef, useState, useEffect } from 'react';
import { Animated, Dimensions, View } from 'react-native';
import { Icon } from '@rneui/base';
import { styled } from 'nativewind';
import { useNavigation } from '@react-navigation/native';
import { usePanResponder } from '../hooks/usePanResponder';
import { createAnimationValues, createBorderRotation,setAIThinkingMode,setAISpeakingMode,resetButton,setUserSpeakingMode} from '../utils/ButtonAnimations';
import FloatingTranscription from './FloatingTranscription';
import CameraMessageView from './CameraMessageView';
import useVoiceAssistant from '../hooks/useVoiceAssistant';
import { LiveKitRoom } from '@livekit/react-native';
import useWebSocket from "../hooks/useWebSocket";  
import FloatingButton from './FloatingButton';


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
  const [isVoiceConnected, setIsVoiceConnected] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isPressing, setIsPressing] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);


  const pan = useRef(new Animated.ValueXY(initialPosition)).current;
  
  // Initialize animation values from the utility
  const animValues = useRef(createAnimationValues());
  const pulseValue = animValues.current.pulseValue;
  const borderAnimation = animValues.current.borderAnimation;
  const speakingAnimation = animValues.current.speakingAnimation;
  const borderRotation = createBorderRotation(borderAnimation);

  // Create a ref to track current state values for the pan responder
  const isRecordingRef = useRef({ isRecording, isDragging });
  const isVoiceConnectedRef = useRef({ isVoiceConnected, isDragging });

  // Update the ref whenever state changes
  // useEffect(() => {
  //   isRecordingRef.current = { isRecording, isDragging };
  //   console.log("isRecording state changed to:", isRecording);
  // }, [isRecording, isDragging]);

  useEffect(() => {
    isVoiceConnectedRef.current = { isVoiceConnected, isDragging };
    console.log("isVoiceConnected state changed to:", isVoiceConnected);
  }, [isVoiceConnected, isDragging]);

  const handleResetButton = () => {
    resetButton(
      setIsAiThinking, 
      setIsAiSpeaking, 
      setIsRecording,
      borderAnimation, 
      speakingAnimation
    );
  };


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


  const handleSetUserSpeakingMode = () => {
    setUserSpeakingMode(
      setIsRecording, 
      pulseValue
    );
  };

  const { panResponder } = usePanResponder({
    pan,
    navigation,
    isRecordingRef,
    isVoiceConnectedRef,
    isAiThinking,
    isAiSpeaking,
    setIsDragging,
    setIsPressing,
    setIsRecording,
    setIsVoiceConnected,
    pulseValue,
    setUserSpeakingMode: handleSetUserSpeakingMode
  });

  const { isConnected, setIsConnected, token, serverUrl } = useVoiceAssistant();
  const { message, sendMessage, connected, isAiIsSeeing, toggleCamera } = useWebSocket(navigation);


  useEffect(() => {
    if (isRecording) {
      setIsVoiceConnected(true);
      console.log("Assistant Connected:", isConnected);
      if (!isConnected) {
        setIsConnected(true);
      }
    } else {
      if (isConnected) {
        setIsConnected(false);
      }
    }
  }, [isRecording, isConnected, setIsConnected]);

  useEffect(() => {
    console.log("WEBSOCKET connected:", connected);
  } ,[connected]);

  return (
    <LiveKitRoom
    serverUrl={serverUrl}
    token={token}
    connect={isVoiceConnected}
    audio={true}
    video={false}
    onConnected={() => setIsConnected(true)}
    onDisconnected={() => setIsVoiceConnected(false)}
  >
    <AnimatedView
      className="absolute w-[60px] h-[60px] justify-center items-center z-40"
      style={{ transform: [...pan.getTranslateTransform()] }}
      {...panResponder.panHandlers}
    >

      {/* Camera view with text overlay - replaces the text message after delay */}
      <CameraMessageView 
        isVisible={isAiIsSeeing} 
      />

      {/* Initial text message - visible only when recording but camera not yet shown */}
      {isVoiceConnected  && (
        <FloatingTranscription 
          isConnected={isConnected}
        />
      )}
      

      
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
      
      <FloatingButton handleResetButton={handleResetButton} handleSetUserSpeakingMode={handleSetUserSpeakingMode} handleSetAISpeakingMode={handleSetAISpeakingMode} handleSetAIThinkingMode={handleSetAIThinkingMode} isVoiceConnected={isVoiceConnected} isRecording={isRecording} />

    </AnimatedView>
  </LiveKitRoom>
  );
};

export default DraggableButton;