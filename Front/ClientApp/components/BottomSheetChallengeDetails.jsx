import { View, Text, StyleSheet } from 'react-native'
import React, { useRef, useMemo, useState, useEffect } from 'react'
import BottomSheet, { 
  BottomSheetScrollView, 
  BottomSheetView 
} from '@gorhom/bottom-sheet'
import ChallengeDetails from './ChallengeDetails'
import { useRoute } from '@react-navigation/native'
import { supabase } from '../database/supabase'

const BottomSheetChallengeDetails = ({ bottomSheetRef }) => {
  const route = useRoute();
  const challenge = route.params.challenge;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Ref for the bottom sheet
  const sheetRef = useRef(bottomSheetRef || null);
  
  // Define snap points
  const snapPoints = useMemo(() => ['65%', '85%', '100%'], []);
  
  // State to track if the bottom sheet is fully open
  const [isFullyOpened, setIsFullyOpened] = useState(false);

  // Handle the onChange event of the BottomSheet
  const handleSheetChanges = (index) => {
    // Check if the sheet is fully open
    setIsFullyOpened(index === 2);
  };

  // Helper function to determine difficulty text
  const getDifficultyText = (priority) => {
    if (!priority) return 'Normal';
    if (priority <= 1) return 'Fácil';
    if (priority <= 2) return 'Medio';
    return 'Fácil';
  };

  // Loading state UI
  if (loading) {
    return (
      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        initialSnapIndex={0}
        handleIndicatorStyle={styles.indicator}
        backgroundStyle={styles.bottomSheetBackground}
      >
        <BottomSheetView style={styles.contentContainer}>
          <Text className="text-center p-10">Cargando reto...</Text>
        </BottomSheetView>
      </BottomSheet>
    );
  }

  // Error state UI
  if (error) {
    return (
      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        initialSnapIndex={0}
        handleIndicatorStyle={styles.indicator}
        backgroundStyle={styles.bottomSheetBackground}
      >
        <BottomSheetView style={styles.contentContainer}>
          <Text className="text-center p-10 text-red-500">Error: {error}</Text>
        </BottomSheetView>
      </BottomSheet>
    );
  }

  return (
    <BottomSheet
      ref={sheetRef}
      snapPoints={snapPoints}
      initialSnapIndex={0}
      handleIndicatorStyle={styles.indicator}
      backgroundStyle={styles.bottomSheetBackground}
      onChange={handleSheetChanges}
      enableContentPanningGesture={true}
      contentPosition="top"
    >
      <BottomSheetScrollView 
        contentContainerStyle={styles.contentContainer}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {challenge && (
          <View className="px-5">
            {/* Card Title */}
            <Text className="text-2xl font-bold mb-2">
              {challenge.name}
            </Text>
            
            {/* Difficulty and Rating */}
            <View className="flex-row items-center mb-1">
              <Text className="text-gray-700 mr-2">
                {getDifficultyText(challenge.priority)}
              </Text>
              <View className="flex-row items-center">
                <Text className="text-green-500 font-bold">★</Text>
                <Text className="ml-1">{challenge.reward}</Text>
              </View>
            </View>
            
            {/* Location */}
            <Text className="text-gray-600 mb-4">
              {challenge.Location?.name || 'Ubicación no disponible'}
            </Text>
            
            <View className="h-0.5 bg-gray-100 mb-4" />
            
            {/* Challenge Details Component */}
            <ChallengeDetails 
              challenge={challenge} 
            />
          </View>
        )}
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  contentContainer: {
    flexGrow: 1,
    paddingTop: 10,
  },
  indicator: {
    display: 'none',
    backgroundColor: '#DDDDDD',
    width: 40,
    height: 4,
  },
});

export default BottomSheetChallengeDetails;