import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const ConnectionFace = ({ isConnected, connected }) => {
  const mouthAnimation = useRef(new Animated.Value(0)).current;
  const isHappy = isConnected && connected;
  
  useEffect(() => {
    Animated.timing(mouthAnimation, {
      toValue: isHappy ? 1 : 0,
      duration: 500,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [isConnected, connected, isHappy]);

  const AnimatedPath = Animated.createAnimatedComponent(Path);
  
  return (
    <View className="relative h-10 w-10 rounded-full flex items-center justify-center">
      <View className="flex flex-row absolute top-2">
        <View className={`h-2 w-2 rounded-full mr-3 ${isConnected ? "bg-green-400" : "bg-red-400"}`} />
        <View className={`h-2 w-2 rounded-full ${connected ? "bg-green-400" : "bg-red-400"}`} />
      </View>
      <View className="absolute bottom-2">
        <Svg height="6" width="30">
          <AnimatedPath
            d={mouthAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: ['M5,3 Q15,0 25,3', 'M5,0 Q15,6 25,0']
            })}
            stroke="white"
            strokeWidth="1.5"
            fill="none"
          />
        </Svg>
      </View>
    </View>
  );
};

export default ConnectionFace;