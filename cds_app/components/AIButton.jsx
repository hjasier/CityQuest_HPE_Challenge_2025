import React, { useRef, useState, useEffect } from 'react';
import { Animated, PanResponder, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Icon } from '@rneui/base';

const { width, height } = Dimensions.get('window');
const BUTTON_SIZE = 60;
const MARGIN_RIGHT = 10;
const initialPosition = {
  x: width - BUTTON_SIZE - MARGIN_RIGHT,
  y: height / 2 - BUTTON_SIZE / 2,
};

const DraggableButton = ({ onPress, onRadial1, onRadial2, customBounds = {} }) => {
  // Main button position
  const pan = useRef(new Animated.ValueXY(initialPosition)).current;
  // Animation for menu open/close and main button scale
  const menuAnim = useRef(new Animated.Value(0)).current;
  // Animations for radial buttons scaling
  const radialScale1 = useRef(new Animated.Value(1)).current;
  const radialScale2 = useRef(new Animated.Value(1)).current;
  // States
  const [showMenu, setShowMenu] = useState(false);
  const [buttonPosition, setButtonPosition] = useState(initialPosition);
  const autoCloseTimerRef = useRef(null);

  // Calculate screen center
  const screenCenter = {
    x: width / 2,
    y: height / 2
  };

  // Effect to update button position when dragged
  useEffect(() => {
    const updatePositionListener = pan.addListener(position => {
      setButtonPosition(position);
    });
    
    return () => {
      pan.removeListener(updatePositionListener);
    };
  }, []);

  // Clean up timers
  useEffect(() => {
    return () => {
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
      }
    };
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({ x: pan.x._value, y: pan.y._value });
        pan.setValue({ x: 0, y: 0 });
        
        // If menu is open, close it when starting to drag
        if (showMenu) {
          closeMenu();
        }
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (evt, gestureState) => {
        pan.flattenOffset();
        
        // Ensure button stays within screen boundaries, respecting custom bounds
        const currentX = pan.x._value;
        const currentY = pan.y._value;
        
        // Apply custom bounds if provided, otherwise use screen bounds
        const minX = customBounds.minX !== undefined ? customBounds.minX : 0;
        const maxX = customBounds.maxX !== undefined ? customBounds.maxX : width - BUTTON_SIZE;
        const minY = customBounds.minY !== undefined ? customBounds.minY : 0;
        const maxY = customBounds.maxY !== undefined ? customBounds.maxY - BUTTON_SIZE : height - BUTTON_SIZE;
        
        const clampedX = Math.max(minX, Math.min(currentX, maxX));
        const clampedY = Math.max(minY, Math.min(currentY, maxY));
        
        // Animate button to final position with spring effect
        Animated.spring(pan, {
          toValue: { x: clampedX, y: clampedY },
          useNativeDriver: false,
          friction: 5
        }).start();

        // Treat as tap if movement was minimal
        if (Math.abs(gestureState.dx) < 5 && Math.abs(gestureState.dy) < 5 && onPress) {
          onPress();
        }
      },
    })
  ).current;

  // Rest of the component remains the same...
  const handleMainButtonPress = () => {
    if (showMenu) {
      closeMenu();
    } else {
      setShowMenu(true);
      Animated.timing(menuAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      // Auto-close menu after 5 seconds
      autoCloseTimerRef.current = setTimeout(() => {
        closeMenu();
      }, 5000);
    }
  };

  const closeMenu = () => {
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
    
    Animated.timing(menuAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowMenu(false);
      radialScale1.setValue(1);
      radialScale2.setValue(1);
    });
  };

  const handleRadialButtonPress = (buttonCallback) => {
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
    
    if (buttonCallback) {
      buttonCallback();
    }
    
    closeMenu();
  };

  // Calculate angle from button to screen center
  const getAngleToScreenCenter = () => {
    const buttonCenterX = buttonPosition.x + BUTTON_SIZE / 2;
    const buttonCenterY = buttonPosition.y + BUTTON_SIZE / 2;
    
    // Calculate angle in radians
    return Math.atan2(
      screenCenter.y - buttonCenterY,
      screenCenter.x - buttonCenterX
    );
  };

  // Animation values
  const mainButtonScale = menuAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.8],
  });

  const radialButtonOpacity = menuAnim.interpolate({
    inputRange: [0, 0.1, 1],
    outputRange: [0, 0, 1],
  });

  const radialButtonScale = menuAnim.interpolate({
    inputRange: [0, 0.1, 1],
    outputRange: [0.5, 0.5, 1],
  });

  // Calculate the positions for the radial buttons (oriented to screen center)
  const renderRadialButtons = () => {
    if (!showMenu) return null;
    
    const angle = getAngleToScreenCenter();
    const distance = 70; // Distance from main button
    
    // First radial button (45 degrees clockwise from center)
    const angle1 = angle + Math.PI / 4;
    const x1 = Math.cos(angle1) * distance;
    const y1 = Math.sin(angle1) * distance;
    
    // Second radial button (45 degrees counter-clockwise from center)
    const angle2 = angle - Math.PI / 4;
    const x2 = Math.cos(angle2) * distance;
    const y2 = Math.sin(angle2) * distance;
    
    return (
      <>
        <Animated.View
          style={[
            styles.menuButton,
            {
              opacity: radialButtonOpacity,
              transform: [
                { translateX: menuAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, x1]
                }) },
                { translateY: menuAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, y1]
                }) },
                { scale: Animated.multiply(radialButtonScale, radialScale1) }
              ],
              backgroundColor: 'green',
            },
          ]}
        >
          <TouchableOpacity
            style={styles.touchable}
            onPress={() => handleRadialButtonPress(onRadial1)}
          >
            <Icon name="camera" type="ionicon" color="white" size={15} />
          </TouchableOpacity>
        </Animated.View>
        
        <Animated.View
          style={[
            styles.menuButton,
            {
              opacity: radialButtonOpacity,
              transform: [
                { translateX: menuAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, x2]
                }) },
                { translateY: menuAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, y2]
                }) },
                { scale: Animated.multiply(radialButtonScale, radialScale2) }
              ],
              backgroundColor: 'green',
            },
          ]}
        >
          <TouchableOpacity
            style={styles.touchable}
            onPress={() => handleRadialButtonPress(onRadial2)}
          >
            <Icon name="chatbox" type="ionicon" color="white" size={15} />
          </TouchableOpacity>
        </Animated.View>
      </>
    );
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            ...pan.getTranslateTransform(),
          ],
        },
      ]}
      {...panResponder.panHandlers}
    >
      {renderRadialButtons()}
      
      <Animated.View
        style={[
          styles.button,
          {
            transform: [
              { scale: mainButtonScale },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.touchable}
          onPress={handleMainButtonPress}
          activeOpacity={0.8}
        >
          <Icon name={showMenu ? "close" : "sparkles-sharp"} type="ionicon" color="white" size={28} />
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    zIndex: 2,
  },
  touchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BUTTON_SIZE / 2,
  },
  menuButton: {
    position: 'absolute',
    width: BUTTON_SIZE / 2,
    height: BUTTON_SIZE / 2,
    borderRadius: (BUTTON_SIZE / 2) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    zIndex: 1,
  },
});

export default DraggableButton;