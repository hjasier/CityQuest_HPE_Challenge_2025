import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

const LoadingScreen = () => {
  // Create animated values for dot animations
  const dotAnimations = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current
  ];

  useEffect(() => {
    // Staggered dot animations
    const animations = dotAnimations.map((animatedValue, index) => 
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 200), // Stagger start times
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true
          })
        ])
      )
    );

    // Start all animations
    animations.forEach(animation => animation.start());

    // Cleanup
    return () => {
      animations.forEach(animation => animation.stop());
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.loadingWrapper}>
        <Text style={styles.loadingText}>Loading</Text>
        <View style={styles.dotContainer}>
          {dotAnimations.map((animation, index) => {
            const scale = animation.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.5]
            });

            const opacity = animation.interpolate({
              inputRange: [0, 1],
              outputRange: [0.4, 1]
            });

            return (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    transform: [{ scale }],
                    opacity
                  }
                ]}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginRight: 15
  },
  dotContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
    marginHorizontal: 4
  }
});

export default LoadingScreen;