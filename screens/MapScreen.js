import React, { useRef } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import Map from "../components/Map";
import BottomSheetComponent from "../components/BottomSheet";

const MapScreen = () => {
  const bottomSheetRef = useRef(null); // Referencia para el modal

  const openModal = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.expand(); // Abre el modal cuando se presiona el botón
    }
  };

  return (
    <View className="flex-1 relative">
      {/* Mapa en el fondo */}
      <Map />

      {/* Botón flotante */}
      <TouchableOpacity
        onPress={openModal} // Llama a la función que abre el modal
        className="absolute bottom-10 right-5 bg-blue-500 p-4 rounded-full shadow-lg"
      >
        <Text className="text-white font-bold">Abrir</Text>
      </TouchableOpacity>

      {/* Modal que se abrirá con el botón */}
      <BottomSheetComponent bottomSheetRef={bottomSheetRef} />
    </View>
  );
};

export default MapScreen;
