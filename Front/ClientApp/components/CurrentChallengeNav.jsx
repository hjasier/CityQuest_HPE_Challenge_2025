import { View, Text, TouchableOpacity, Vibration, Animated, Modal, Pressable } from 'react-native'
import React from 'react'
import { useCurrentChallenge } from '../hooks/useCurrentChallenge';
import { CheckCircle, Navigation2, X, AlertTriangle } from 'react-native-feather';
import { useNavigation } from '@react-navigation/native';
import { useCurrentGeometryRoute } from '../hooks/useCurrentGeometryRoute';
import { set } from 'lodash';
import useChallengeCompletion from '../hooks/useChallengeCompletion';
import { Icon } from '@rneui/base';
import { useChallengeRouteStatus } from '../hooks/useChallengeRouteStatus';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react'; // Added useState import

const CurrentChallengeNav = () => {
  const {currentChallenge , setCurrentChallenge } = useCurrentChallenge();
  const { currentGeometryRoute , setCurrentGeometryRoute } = useCurrentGeometryRoute();
  const navigation = useNavigation();
  const { routeStatus } = useChallengeRouteStatus();

  const { abandonChallenge, navigateToChallengeCompletion } = useChallengeCompletion(navigation);   
  const [showAbandonModal, setShowAbandonModal] = useState(false); // Added state for modal

  const progressAnim = useRef(new Animated.Value(0)).current;

  const completeChallenge = () => {
    Vibration.vibrate();  
    navigateToChallengeCompletion(currentChallenge);
  }

  // Modified to show modal instead of immediate abandon
  const handleAbandonChallenge = () => {
    Vibration.vibrate(100);
    setShowAbandonModal(true);
  }

  // New function to confirm abandonment
  const confirmAbandon = () => {
    setShowAbandonModal(false);
    Vibration.vibrate([0, 100]);
    abandonChallenge();
  }

  // Calculate progress for route type challenges
  const isRouteChallenge = currentChallenge?.CompletionType?.type === 'GPS-ROUTE';
  const progressPercentage = isRouteChallenge ? (routeStatus?.progress || 0) * 100 : 0;
  
  // Animate progress bar when progress changes
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progressPercentage,
      duration: 800,
      useNativeDriver: false
    }).start();
  }, [progressPercentage]);

  return (
    <View className="w-full relative bg-white">
      {/* Abandon Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showAbandonModal}
        onRequestClose={() => setShowAbandonModal(false)}
      >
        <Pressable 
          className="flex-1  justify-center items-center px-5"
          onPress={() => setShowAbandonModal(false)}
        >
          <Pressable 
            className="bg-white w-full rounded-xl py-5 px-4 shadow-xl"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="items-center mb-4">
              <View className="bg-red-100 rounded-full p-3 mb-2">
                <AlertTriangle stroke="#EF4444" width={28} height={28} />
              </View>
              <Text className="text-xl font-bold text-center">¿Abandonar desafío?</Text>
              <Text className="text-gray-600 text-center mt-2 mb-3 px-4">
                Si abandonas este desafío perderás tu progreso actual. ¿Estás seguro?
              </Text>
            </View>
            
            <View className="flex-row space-x-3">
              <TouchableOpacity 
                className="flex-1 py-3 rounded-lg border border-gray-300"
                onPress={() => setShowAbandonModal(false)}
              >
                <Text className="text-center font-semibold text-gray-800">Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="flex-1 py-3 bg-red-500 rounded-lg"
                onPress={confirmAbandon}
              >
                <Text className="text-center font-semibold text-white">Sí, abandonar</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Progress background for route challenges */}
      {isRouteChallenge && (
        <>
          {/* Main progress bar */}
          <Animated.View 
            className="absolute z-10 top-0 left-0 h-full bg-blue-100 rounded-r-xl"
            style={{ width: progressAnim.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%']
            })}}
          />
        </>
      )}
      
      <View className="w-full z-20 bg-opacity-90 px-4 py-3 pt-10 flex-row items-center justify-between shadow-sm border-b border-gray-200">
        {/* Left side - Challenge info */}
        <View className="flex-row items-center">
          <View className="bg-blue-500 rounded-full p-2 mr-3">
            <Navigation2 stroke="white" width={20} height={20} />
          </View>
          <View>
            <Text className="text-sm text-gray-500">En progreso</Text>
            <Text className="text-base font-bold">
              {currentChallenge?.name?.slice(0, 18) || 'Desafío actual'}
              {currentChallenge?.name?.length > 18 ? '...' : ''}
            </Text>
            <Text className="text-sm font-medium text-blue-500">{Math.round(currentGeometryRoute?.remainingDistance || 0)} metros restantes</Text>
          </View>
        </View>
        
        {/* Right side - Action buttons */}
        <View className="flex-row">
          <TouchableOpacity 
            onPress={handleAbandonChallenge}
            className="bg-red-100 rounded-full p-2 mr-2"
          >
            <Icon name="exit" type="ionicon" color="#EF4444" size={20} />
          </TouchableOpacity>
          
          {/* BOTÓN DE COMPLETAR SOLO SI ES QR */}
          {currentChallenge?.CompletionType?.type === 'QR' && (
          <TouchableOpacity 
            onPress={completeChallenge}
            className="bg-green-100 rounded-full p-2"
          >
            <Icon name="qr-code" type="ionicon" color="#10B981" size={20} />
          </TouchableOpacity>
          )}

          {/* BOTÓN DE COMPLETAR SI ES GPS */}
          {currentChallenge?.CompletionType?.type === 'GPS' && (
          <TouchableOpacity 
            onPress={completeChallenge}
            className="bg-green-100 rounded-full p-2"
          >
            <Icon 
              name="crosshairs-gps" 
              type="material-community"
              color="#10B981" 
              size={16} 
              style={{ marginRight: 4 }}
            />
          </TouchableOpacity>
          )}

          {/* BOTÓN DE COMPLETAR SI ES FOTO */}
          {currentChallenge?.CompletionType?.type === 'PHOTO' && (
          <TouchableOpacity 
            onPress={completeChallenge}
            className="bg-green-100 rounded-full p-2"
          >
            <Icon
              name="camera" 
              type="ionicon" 
              color="#10B981" 
              size={20}
              style={{ marginRight: 4 }}
            />
          </TouchableOpacity>
          )}

          {/* PUNTOS RESTANTES SI ES RUTA */}
          {currentChallenge?.CompletionType?.type === 'GPS-ROUTE' && (
            <View className="bg-green-100 rounded-full px-3 py-2 flex-row items-center">
              <Icon 
                name="crosshairs-gps" 
                type="material-community"
                color="#10B981" 
                size={16} 
                style={{ marginRight: 4 }}
              />
              <Text className="text-green-600 font-semibold">
                {routeStatus?.completedPoints || 0}/{routeStatus?.totalPoints || 0}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

export default CurrentChallengeNav