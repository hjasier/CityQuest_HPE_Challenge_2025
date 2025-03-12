import React, { useRef } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import Map from "../components/Map";
import BottomSheetComponent from "../components/BottomSheet";

const MapScreen = () => {


  return (
    <View style={{ flex: 1, position: 'relative' }}>


      {/* Mapa en el fondo */}
      <Map />
      {/* Modal que se abrirá con el botón */}
      <BottomSheetComponent  />

      
    </View>
  );
};



export default MapScreen;
