import React, { useRef } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import Map from "../components/Map";
import BottomSheetComponent from "../components/BottomSheet";

const MapScreen = () => {


  return (
    <View style={{ flex: 1, position: 'relative' }}>
      {/* Mapa en el fondo */}
      <Map />

      {/* Botón flotante */}
      <TouchableOpacity
        style={{
          position: "absolute", bottom: 10, right: 5, backgroundColor: "#3b82f6", padding: 16, borderRadius: 50, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: { width: 0, height: 3 }
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Abrir</Text>
      </TouchableOpacity>

      {/* Modal que se abrirá con el botón */}
      <BottomSheetComponent  />
    </View>
  );
};



export default MapScreen;
