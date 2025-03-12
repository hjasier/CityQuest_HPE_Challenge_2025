import React, { useRef } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import MapGoogle from "../components/MapGoogle";
import MapMapBox from "../components/MapMapBox";

import BottomSheetComponent from "../components/BottomSheet";

const MapScreen = () => {


  return (
    <View style={{ flex: 1, position: 'relative' }}>


      {/* Mapa en el fondo */}
      <MapMapBox />
      {/* Modal que se abrirá con el botón */}
      <BottomSheetComponent  />

      
    </View>
  );
};



export default MapScreen;
