import { useRef, useState, useEffect } from 'react';
import { PanResponder, Vibration } from 'react-native';
import { Animated } from 'react-native';

const DRAG_THRESHOLD = 10; // Pixels of movement before considering it a drag
const LONG_PRESS_DURATION = 1000; // 1 second in milliseconds

export const usePanResponder = ({
  pan,
  navigation,
  isRecordingRef,
  isAiThinking,
  isAiSpeaking,
  setIsDragging,
  setIsPressing,
  setIsRecording,
  pulseValue,
  setUserSpeakingMode
}) => {
  const longPressTimer = useRef(null);
  const touchStartTime = useRef(0);
  const initialTouch = useRef({ x: 0, y: 0 });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only become responder if we're moving beyond threshold
        return Math.abs(gestureState.dx) > DRAG_THRESHOLD || Math.abs(gestureState.dy) > DRAG_THRESHOLD;
      },
      onPanResponderGrant: (evt) => {
        // Remember when and where the touch started
        touchStartTime.current = Date.now();
        initialTouch.current = { x: evt.nativeEvent.pageX, y: evt.nativeEvent.pageY };
        setIsPressing(true);
        
        // Start the long press timer
        longPressTimer.current = setTimeout(() => {
          if (!isRecordingRef.current.isDragging) {
            Vibration.vibrate(200); // Vibrate for 200ms
            setUserSpeakingMode();
          }
        }, LONG_PRESS_DURATION);
  
        // Prepare for dragging
        pan.setOffset({ x: pan.x._value, y: pan.y._value });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (_, gestureState) => {
        // If movement is beyond threshold, consider it dragging
        if (Math.abs(gestureState.dx) > DRAG_THRESHOLD || Math.abs(gestureState.dy) > DRAG_THRESHOLD) {
          if (!isRecordingRef.current.isDragging) {
            setIsDragging(true);
            // Cancel long press timer when dragging starts
            if (longPressTimer.current) {
              clearTimeout(longPressTimer.current);
              longPressTimer.current = null;
            }
          }
          // Only update position if actually dragging
          return Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false })(_, gestureState);
        }
        return false;
      },
      onPanResponderRelease: (_, gestureState) => {
        // Calculate if this is a tap (short duration, minimal movement)
        const touchDuration = Date.now() - touchStartTime.current;
        const isMovementMinimal = Math.abs(gestureState.dx) < DRAG_THRESHOLD && Math.abs(gestureState.dy) < DRAG_THRESHOLD;
        
        // Clear the long press timer
        if (longPressTimer.current) {
          clearTimeout(longPressTimer.current);
          longPressTimer.current = null;
        }
        
        // Handle tap for navigation only if NOT recording/thinking/speaking
        if (touchDuration < 500 && isMovementMinimal) {
          console.log("Current recording state:", isRecordingRef.current.isRecording);
          
          if (!isRecordingRef.current.isRecording && !isAiThinking && !isAiSpeaking) {
            console.log("Short tap detected - navigating to AIChat");
            navigation.navigate('AIChat');
          } else if (isRecordingRef.current.isRecording) {
            console.log("Button is already recording - stopping recording");
            setIsRecording(false);
            pulseValue.stopAnimation();
            pulseValue.setValue(1);
          }
        }
        
        // Reset states
        pan.flattenOffset();
        setIsDragging(false);
        setIsPressing(false);
      },
      onPanResponderTerminate: () => {
        // If the gesture is terminated for any reason
        if (longPressTimer.current) {
          clearTimeout(longPressTimer.current);
          longPressTimer.current = null;
        }
        setIsPressing(false);
        setIsDragging(false);
      },
    })
  ).current;

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, []);

  return { panResponder, longPressTimer };
};