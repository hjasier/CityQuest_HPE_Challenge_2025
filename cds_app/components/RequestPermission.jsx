import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const RequestPermission = ({ 
  icon = "alert-circle-outline", 
  title = "Permiso Requerido", 
  description = "Esta función requiere permisos adicionales.", 
  onRequest 
}) => {
  return (
    <View className="flex-1 items-center justify-center bg-gray-900 p-6">
      <Ionicons name={icon} size={80} color="#FBBF24" />
      <Text className="text-2xl font-bold text-yellow-400 mt-3">{title}</Text>
      <Text className="text-md text-white text-center mt-2 px-4">{description}</Text>

      <Pressable 
        onPress={onRequest} 
        className="mt-6 bg-yellow-500 px-6 py-3 rounded-lg active:scale-95"
      >
        <Text className="text-lg font-semibold text-gray-900">Conceder Permiso</Text>
      </Pressable>
    </View>
  );
};

export default RequestPermission;
