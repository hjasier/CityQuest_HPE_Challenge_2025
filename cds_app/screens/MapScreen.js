import React, { useRef, useState, useEffect } from "react";
import { View, TouchableOpacity, Text, Dimensions } from "react-native";
import MapGoogle from "../components/MapGoogle";
import MapMapBox from "../components/MapMapBox";
import BottomSheetComponent from "../components/BottomSheet";
import AIButton from "../components/AIButton";

const MapScreen = () => {

  return (
    <View className="flex-1 relative">
      {/* Mapa en el fondo */}
      <MapMapBox />
      
      {/* DraggableButton - contained within the map's boundaries */}
      <AIButton/>


      <BottomSheetComponent />
    </View>
  );
};

export default MapScreen;