import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ConfettiCannon from "react-native-confetti-cannon";
import { useNavigation } from "@react-navigation/native";

const ChallengeCompletedScreen = ({ route }) => {

  const data = route.params?.data;
  const navigation = useNavigation();

  return (
    <View className="flex-1 items-center justify-center bg-gray-900 p-5">
      {/* Confeti Animado */}
      <ConfettiCannon count={100} origin={{ x: 200, y: -10 }} fadeOut={true} />

      {/* Icono y Mensaje */}
      <Ionicons name="trophy-outline" size={80} color="#FFD700" />
      <Text className="text-3xl font-bold text-yellow-400 mt-3">
        ¡Reto Completado!
      </Text>
      <Text className="text-lg text-white text-center mt-2">
        Has logrado un nuevo desafío. 🎉
      </Text>

      {/* Sección de Código */}

      <View className="bg-gray-800 p-3 rounded-lg max-h-20 mt-2 items-center my-3">
        <Text className="text-green-400 font-mono">{data? data : ''}</Text>
      </View>

      {/* Botón de Continuar */}
      <Pressable
        onPress={() => navigation.navigate("Main")}
        className="mt-6 bg-yellow-500 px-6 py-3 rounded-lg active:scale-95"
      >
        <Text className="text-lg font-semibold text-gray-900">Continuar</Text>
      </Pressable>
    </View>
  );
};

export default ChallengeCompletedScreen;
