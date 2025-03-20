import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import { Mic } from 'lucide-react';
import { Icon } from '@rneui/base';
import { styled } from 'nativewind';
import { createAnimationValues, createBorderRotation,setAIThinkingMode,setAISpeakingMode,resetButton,setUserSpeakingMode} from '../utils/ButtonAnimations';
import { useVoiceAssistant } from '@livekit/components-react';



const FloatingButton = ({handleResetButton,handleSetUserSpeakingMode,handleSetAISpeakingMode,handleSetAIThinkingMode, isVoiceConnected, isRecording }) => {
  const AnimatedView = styled(Animated.View);
  // Initialize animation values from the utility
  const animValues = useRef(createAnimationValues());
  const pulseValue = animValues.current.pulseValue;
  const borderAnimation = animValues.current.borderAnimation;
  const speakingAnimation = animValues.current.speakingAnimation;
  const borderRotation = createBorderRotation(borderAnimation);

  //estado de la conexión
  const { state } = useVoiceAssistant();  

  // useEffect(() => {
  //   console.log("state changed to:", state);
  //   switch (state) {
  //     case "connecting":
  //       console.log("USERMODE");
  //       handleSetUserSpeakingMode();
  //     case "initializing":
  //       console.log("USERMODE");
  //       handleSetUserSpeakingMode();
  //     case "thinking":
  //       console.log("THINKINGMODE");
  //       handleSetAIThinkingMode();
  //     case "speaking":
  //       console.log("SPEAKINGMODE");
  //       handleSetAISpeakingMode();
  //     case "disconnected":
  //       console.log("RESETMODE");
  //       handleResetButton();
  //     default:
  //       break;
  //   }
  // },[state])




  return (
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
      ) : (
        <Icon name="sparkles-sharp" type="ionicon" color="white" size={28} />
      )}
    </View>
  );
};

export default FloatingButton;