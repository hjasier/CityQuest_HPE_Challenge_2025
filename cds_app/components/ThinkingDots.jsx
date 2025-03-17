import React, { useRef, useEffect } from 'react';
import { Animated, Easing, View } from 'react-native';



const ThinkingDots = () => {
    const dots = [useRef(new Animated.Value(0)).current, 
                  useRef(new Animated.Value(0)).current, 
                  useRef(new Animated.Value(0)).current];
  
    useEffect(() => {
      const animations = dots.map((dot, index) => {
        return Animated.sequence([
          Animated.delay(index * 200),
          Animated.loop(
            Animated.sequence([
              Animated.timing(dot, {
                toValue: 1,
                duration: 500,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.timing(dot, {
                toValue: 0,
                duration: 500,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
            ])
          ),
        ]);
      });
  
      Animated.parallel(animations).start();
  
      return () => {
        animations.forEach(animation => animation.stop());
      };
    }, []);
  
    return (
      <View className="flex-row items-center justify-center py-2">
        {dots.map((dot, index) => (
          <Animated.View
            key={index}
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: "#95a5a6",
              marginHorizontal: 2,
              opacity: dot,
            }}
          />
        ))}
      </View>
    );
  };