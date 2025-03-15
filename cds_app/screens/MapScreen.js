import React, { useRef, useState, useEffect } from "react";
import { View, TouchableOpacity, Text, Dimensions } from "react-native";
import MapGoogle from "../components/MapGoogle";
import MapMapBox from "../components/MapMapBox";
import BottomSheetComponent from "../components/BottomSheet";
import DraggableButton from "../components/AIButton";

const MapScreen = () => {
  const [bottomSheetHeight, setBottomSheetHeight] = useState(0);
  const bottomSheetRef = useRef(null);
  
  // Handlers for DraggableButton actions
  const handleMainButtonPress = () => {
    console.log('Main button pressed');
    // Implement main button functionality
  };

  const handleRadial1Press = () => {
    console.log('Camera button pressed');
    // Implement camera functionality
  };

  const handleRadial2Press = () => {
    console.log('Chat button pressed');
    // Implement chat functionality
  };

  // Measure the BottomSheet height
  const onBottomSheetLayout = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.measure((x, y, width, height, pageX, pageY) => {
        setBottomSheetHeight(height);
      });
    }
  };
  
  // Get screen dimensions
  const { height: screenHeight } = Dimensions.get('window');
  
  // Calculate the safe area for the draggable button
  const buttonSafeAreaHeight = screenHeight - bottomSheetHeight;

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      {/* Mapa en el fondo */}
      <MapMapBox />
      
      {/* Modal que se abrirá con el botón */}
      <View 
        ref={bottomSheetRef}
        onLayout={onBottomSheetLayout}
      >
        <BottomSheetComponent />
      </View>
    </View>
  );
};

export default MapScreen;