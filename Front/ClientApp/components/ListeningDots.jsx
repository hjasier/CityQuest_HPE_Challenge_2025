import React, { useRef, useEffect } from 'react';
import { Animated, Easing, View } from 'react-native';



const ListeningDots = () => {
    const dots = [useRef(new Animated.Value(0)).current, 
                  useRef(new Animated.Value(0)).current, 
                  useRef(new Animated.Value(0)).current];
  
    useEffect(() => {
      const animations = dots.map((dot, index) => {
        return Animated.sequence([
          Animated.delay(index * 150),
          Animated.loop(
            Animated.sequence([
              Animated.timing(dot, {
                toValue: 1,
                duration: 400,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.timing(dot, {
                toValue: 0,
                duration: 400,
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
      <View className="flex-row items-center justify-center">
        {dots.map((dot, index) => (
          <Animated.View
            key={index}
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: "#3498db",
              marginHorizontal: 3,
              transform: [
                {
                  scale: dot.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.5],
                  }),
                },
              ],
            }}
          />
        ))}
      </View>
    );
  };
  