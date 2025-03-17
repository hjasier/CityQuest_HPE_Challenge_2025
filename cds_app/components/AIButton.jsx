import React, { useRef, useState } from 'react';
import { Animated, PanResponder, TouchableOpacity, Dimensions, View } from 'react-native';
import { Icon } from '@rneui/base';
import { styled } from 'nativewind';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

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
  const [isDragging, setIsDragging] = useState(false); // Nuevo estado para controlar el arrastre
  
  const pan = useRef(new Animated.ValueXY(initialPosition)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        // Solo permitir pan responder si se detecta un movimiento significativo
        const { dx, dy } = gestureState;
        return Math.abs(dx) > 10 || Math.abs(dy) > 10; // Ajusta el umbral para que no se active por un toque leve
      },
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsDragging(true); // Empieza a arrastrar
        pan.setOffset({ x: pan.x._value, y: pan.y._value });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
        setIsDragging(false); // Deja de arrastrar cuando se suelta
      },
    })
  ).current;

  const onMainButtonPress = () => {
    navigation.navigate('AIChat');
    if (!isDragging) { // Solo permitir el toque si no estamos arrastrando
      setIsRecording(!isRecording);
      console.log('Main Button Pressed');
    }
  };

  return (
    <AnimatedView
      className="absolute w-[60px] h-[60px] justify-center items-center z-40"
      style={{ transform: [...pan.getTranslateTransform()] }}
      {...panResponder.panHandlers}
    >
      <TouchableWithoutFeedback onPress={onMainButtonPress}>
        <TouchableOpacity
          className="w-[60px] h-[60px] rounded-full bg-green-600 justify-center items-center shadow-md"
          onPress={onMainButtonPress}
        >
          {isRecording ? (
            <View className="w-[60px] h-[60px] rounded-full bg-red-600 justify-center items-center"></View>
          ) : (
            <Icon name="sparkles-sharp" type="ionicon" color="white" size={28} />
          )}
        </TouchableOpacity>
      </TouchableWithoutFeedback>
    </AnimatedView>
  );
};

export default DraggableButton;
