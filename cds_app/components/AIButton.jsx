import React, { useRef, useState, useEffect } from 'react';
import { Animated, PanResponder, TouchableOpacity, Dimensions, View } from 'react-native';
import { Icon } from '@rneui/base';
import { styled } from 'nativewind';
import { useNavigation } from '@react-navigation/native';

const AnimatedView = styled(Animated.View);
const { width, height } = Dimensions.get('window');
const BUTTON_SIZE = 60;
const MARGIN_RIGHT = 10;
const LONG_PRESS_DURATION = 1000; // 2 seconds in milliseconds
const DRAG_THRESHOLD = 10; // Pixels of movement before considering it a drag

const initialPosition = {
  x: width - BUTTON_SIZE - MARGIN_RIGHT,
  y: height / 2 - BUTTON_SIZE / 2,
};

const DraggableButton = () => {
  const navigation = useNavigation();
  const [isRed, setIsRed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isPressing, setIsPressing] = useState(false);
  const pan = useRef(new Animated.ValueXY(initialPosition)).current;
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
          if (!isDragging) {
            setIsRed(true);
            console.log("Long press detected - turning red");
          }
        }, LONG_PRESS_DURATION);

        // Prepare for dragging
        pan.setOffset({ x: pan.x._value, y: pan.y._value });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (_, gestureState) => {
        // If movement is beyond threshold, consider it dragging
        if (Math.abs(gestureState.dx) > DRAG_THRESHOLD || Math.abs(gestureState.dy) > DRAG_THRESHOLD) {
          if (!isDragging) {
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
        
        // Handle tap for navigation
        if (touchDuration < 500 && isMovementMinimal && !isRed) {
          navigation.navigate('AIChat');
          console.log("Short tap detected - navigating to AIChat");
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

  // Double reset option for red state
  const handleDoublePress = () => {
    if (isRed) {
      setIsRed(false);
      console.log("Double tap detected - resetting red state");
    }
  };

  return (
    <AnimatedView
      className="absolute w-[60px] h-[60px] justify-center items-center z-40"
      style={{ transform: [...pan.getTranslateTransform()] }}
      {...panResponder.panHandlers}
    >
      <View 
        className={`w-[60px] h-[60px] rounded-full ${isRed ? 'bg-red-600' : 'bg-green-600'} justify-center items-center shadow-md`}
        onDoublePress={handleDoublePress}
      >
        <Icon name="sparkles-sharp" type="ionicon" color="white" size={28} />
      </View>
    </AnimatedView>
  );
};

export default DraggableButton;