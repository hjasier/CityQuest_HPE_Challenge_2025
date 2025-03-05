import React, { useMemo } from "react";
import { View, Text } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";

const BottomSheetComponent = ({ bottomSheetRef }) => {
  const snapPoints = useMemo(() => ["10%", "50%", "100%"], []);

  return (
    <BottomSheet
      ref={bottomSheetRef} // Controlamos el modal desde MapScreen.js
      index={-1} // El modal empieza cerrado
      snapPoints={snapPoints}
      enablePanDownToClose={true} // Permite cerrarlo deslizando hacia abajo
      backgroundStyle={{ backgroundColor: "white" }}
    >
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-lg font-bold">Contenido del Modal</Text>
      </View>
    </BottomSheet>
  );
};

export default BottomSheetComponent;
