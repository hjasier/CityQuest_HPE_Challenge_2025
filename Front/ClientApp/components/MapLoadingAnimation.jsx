import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, Easing, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

const MapLoadingAnimation = () => {
  // Animation values
  const pinDropAnim = useRef(new Animated.Value(0)).current;
  const rippleAnim = useRef(new Animated.Value(0)).current;
  const compassRotate = useRef(new Animated.Value(0)).current;
  
  // Add state for showing retry message
  const [showRetryMessage, setShowRetryMessage] = useState(false);

  useEffect(() => {
    // Pin drop animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pinDropAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.bounce,
          useNativeDriver: true
        }),
        Animated.timing(pinDropAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true
        })
      ])
    ).start();

    // Ripple animation
    Animated.loop(
      Animated.timing(rippleAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true
      })
    ).start();

    // Compass rotation
    Animated.loop(
      Animated.timing(compassRotate, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start();

    // Set timer to show retry message after 5 seconds
    const timer = setTimeout(() => {
      setShowRetryMessage(true);
    }, 5000);

    // Clear timer on unmount
    return () => clearTimeout(timer);
  }, []);

  // Interpolations
  const pinTranslateY = pinDropAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -50]
  });

  const rippleScale = rippleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 2]
  });

  const rippleOpacity = rippleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0]
  });

  const compassRotation = compassRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <View style={styles.container}>
      {/* Ripple Effect */}
      <Animated.View 
        style={[
          styles.ripple, 
          {
            transform: [
              { scale: rippleScale }
            ],
            opacity: rippleOpacity
          }
        ]} 
      />

      {/* Map Pin */}
      <Animated.View 
        style={[
          styles.pinContainer, 
          { 
            transform: [
              { translateY: pinTranslateY }
            ] 
          }
        ]}
      >
        <Svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2">
          <Path 
            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" 
            fill="#007AFF" 
            fillOpacity="0.2"
          />
          <Circle cx="12" cy="9" r="3" fill="#007AFF" />
        </Svg>
      </Animated.View>

      {/* Compass */}
      <Animated.View 
        style={[
          styles.compassContainer,
          { 
            transform: [
              { rotate: compassRotation }
            ] 
          }
        ]}
      >
        <Svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#4A4A4A" strokeWidth="2">
          <Path d="M12 2l3 6 6 2-6 2-3 6-3-6-6-2 6-2z" />
        </Svg>
      </Animated.View>

      {/* Loading Text */}
      <Text style={styles.loadingText}>Buscando ubicación...</Text>
      
      {/* Retry Message */}
      {showRetryMessage && (
        <View style={styles.retryContainer}>
          <Text style={styles.retryMessage}>Esto está tomando más de lo usual</Text>
          <Text style={styles.retryingText}>Reintentando...</Text>
        </View>
      )}
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F4F8'
  },
  ripple: {
    position: 'absolute',
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
  },
  pinContainer: {
    marginBottom: 20,
  },
  compassContainer: {
    marginTop: 20,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: '#2C3E50',
    fontWeight: '600'
  },
  retryContainer: {
    marginTop: 15,
    alignItems: 'center'
  },
  retryMessage: {
    fontSize: 16,
    color: '#E74C3C',
    fontWeight: '500'
  },
  retryingText: {
    marginTop: 5,
    fontSize: 14,
    color: '#7F8C8D',
    fontStyle: 'italic'
  }
});

export default MapLoadingAnimation;