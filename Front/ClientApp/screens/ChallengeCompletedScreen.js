import React, { useState, useRef, useEffect } from "react";
import { 
  View, 
  Text, 
  Pressable, 
  ScrollView, 
  Image, 
  TextInput,
  TouchableOpacity,
  Platform,
  ActivityIndicator 
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import ConfettiCannon from "react-native-confetti-cannon";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import { AirbnbRating } from 'react-native-ratings';

const ChallengeCompletedScreen = ({ route }) => {
  const challenge = route.params?.challenge;
  const navigation = useNavigation();
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);
  const confettiRef = useRef(null);


  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Se necesitan permisos para acceder a la galería');
      return;
    }
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8, // Reduced quality for better performance
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      alert("Por favor, añade una valoración antes de enviar");
      return;
    }
    
    setIsSubmitting(true);
    
    // Aquí iría la lógica para enviar la reseña y la imagen al backend
    // Por ejemplo:
    // const reviewData = {
    //   challengeId: challenge.id,
    //   rating,
    //   comment: review,
    //   image: image ? await uploadImage(image) : null
    // };
    // await api.submitReview(reviewData);
    
    // Simulamos una carga
    setTimeout(() => {
      setIsSubmitting(false);
      alert("¡Gracias por tu reseña!");
      navigation.navigate("Main");
    }, 1000);
  };

  // Helper function for rating text
  const getRatingText = () => {
    if (rating === 0) return 'Toca una estrella para valorar';
    if (rating === 1) return 'Muy mala experiencia';
    if (rating === 2) return 'Podría mejorar';
    if (rating === 3) return 'Experiencia aceptable';
    if (rating === 4) return 'Buena experiencia';
    return 'Excelente experiencia';
  };

  return (
    <ScrollView className="flex-1 bg-gray-900">
      <View className="items-center justify-center p-5 pb-10">
        {/* Confeti Animado con menos partículas y gestión por ref */}
        
        {showConfetti && (
        <View className="absolute top-0 left-0 right-0 bottom-0">
          <ConfettiCannon
            ref={confettiRef}
            count={200} 
            origin={{ x: -10, y: 0 }}
            fallSpeed={2000}
            fadeOut={true}
            autoStart={true}
          />
        </View>
        )}

        {/* Icono y Mensaje */}
        <View className="items-center mb-6 mt-14">
          <View className="bg-yellow-500/20 p-5 rounded-full mb-2">
            <Ionicons name="trophy-outline" size={80} color="#FFD700" />
          </View>
          <Text className="text-3xl font-bold text-yellow-400">
            ¡Reto Completado!
          </Text>
          <Text className="text-lg text-white text-center mt-1">
            +{challenge.reward} puntos añadidos 🎉
          </Text>
        </View>

        {/* Detalles del reto */}
        <View className="w-full bg-gray-800 rounded-xl p-4 mb-6">
          {challenge.cover_url && (
            <Image
              source={{ uri: challenge.cover_url }}
              className="w-full h-40 rounded-lg mb-3"
              resizeMode="cover"
            />
          )}
          <Text className="text-xl font-bold text-white mb-1">{challenge.name}</Text>
          <Text className="text-white/70 mb-3">{challenge.description}</Text>
          
          <View className="flex-row items-center mt-1">
            <Ionicons name="location" size={16} color="#FFD700" />
            <Text className="text-white/70 ml-1 flex-1">{challenge.Location.name}</Text>
          </View>
          
          <View className="flex-row items-center mt-1">
            <Ionicons name="medal" size={16} color="#FFD700" />
            <Text className="text-white/70 ml-1">{challenge.ChallengeType.type.toUpperCase()}</Text>
          </View>
        </View>

        {/* Sección de reseña */}
        <View className="w-full bg-gray-800 rounded-xl p-4 mb-6">
          <Text className="text-xl font-bold text-white mb-3">
            ¿Cómo ha sido tu experiencia?
          </Text>
          
          <Text className="text-white/70 mb-2">Valoración</Text>
          <AirbnbRating
            count={5}
            defaultRating={0}
            size={30}
            showRating={false}
            onFinishRating={setRating}
            selectedColor="#FFD700"
            unSelectedColor="#767676"
          />
          
          <View className="items-center mb-2 mt-2">
            <Text className="text-white/70 italic">
              {getRatingText()}
            </Text>
          </View>
          
          <Text className="text-white/70 mt-4 mb-2">Comentarios (opcional)</Text>
          <TextInput
            className="bg-gray-700 text-white p-3 rounded-lg min-h-[100] text-base"
            multiline
            placeholder="Comparte tu experiencia..."
            placeholderTextColor="#9CA3AF"
            value={review}
            onChangeText={setReview}
          />
          
          <Text className="text-white/70 mt-4 mb-2">Añadir foto (opcional)</Text>
          <TouchableOpacity onPress={pickImage} className="bg-gray-700 p-4 rounded-lg items-center mb-3">
            {!image ? (
              <>
                <MaterialIcons name="add-photo-alternate" size={30} color="#9CA3AF" />
                <Text className="text-white/70 mt-2">Seleccionar imagen</Text>
              </>
            ) : (
              <Image source={{ uri: image }} className="w-full h-48 rounded-lg" />
            )}
          </TouchableOpacity>
          
          {image && (
            <TouchableOpacity 
              onPress={() => setImage(null)} 
              className="flex-row items-center justify-center"
            >
              <Text className="text-red-400">Eliminar imagen</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Botones */}
        <View className="w-full flex-row justify-between space-x-3 mt-2">
          <Pressable
            onPress={() => navigation.navigate("Main")}
            className="flex-1 border border-yellow-500 py-3 rounded-lg active:scale-95 items-center"
          >
            <Text className="text-base font-semibold text-yellow-500">Omitir</Text>
          </Pressable>
          
          <Pressable
            onPress={handleSubmitReview}
            disabled={isSubmitting}
            className="flex-1 bg-yellow-500 py-3 rounded-lg active:scale-95 items-center"
          >
            {isSubmitting ? (
              <ActivityIndicator color="#1F2937" />
            ) : (
              <Text className="text-base font-semibold text-gray-900">Enviar Reseña</Text>
            )}
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

export default ChallengeCompletedScreen;