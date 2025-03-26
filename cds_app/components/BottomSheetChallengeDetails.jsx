import { View, Text, StyleSheet } from 'react-native'
import React, { useRef, useMemo, useState, useEffect } from 'react'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import ChallengeDetails from './ChallengeDetails'
import { ScrollView } from 'react-native-gesture-handler'
import { useRoute } from '@react-navigation/native'
import { supabase } from '../lib/supabase' // Import your Supabase client

const BottomSheetChallengeDetails = ({ bottomSheetRef }) => {

  const route = useRoute();
  const challengeId = route.params?.challengeId;
  
  // State for the challenge data
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch challenge data
  useEffect(() => {
    const fetchChallengeData = async () => {
      try {
        setLoading(true);
        
        // Query the challenge from your database
        const { data, error } = await supabase
          .from('Challenge')
          .select(`
            *,
            Location:location (name),
            ChallengeType:type (name)
          `)
          .eq('id', challengeId)
          .single();
          
        if (error) {
          throw error;
        }
        
        setChallenge(data);
      } catch (err) {
        console.error('Error fetching challenge:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (challengeId) {
      fetchChallengeData();
    }
  }, [challengeId]);
  
  // Ref for the bottom sheet
  const sheetRef = useRef(bottomSheetRef || null);
  
  // Define snap points
  const snapPoints = useMemo(() => ['65%', '85%', '100%'], []);
  
  // State to track if the bottom sheet is fully open
  const [isFullyOpened, setIsFullyOpened] = useState(false);

  // Handle the onChange event of the BottomSheet
  const handleSheetChanges = (index) => {
    // Check if the sheet is fully open
    if (index === 2) {
      setIsFullyOpened(true);
    } else {
      setIsFullyOpened(false);
    }
  };

  // Handle the scroll event to detect when user tries to scroll past the top
  const handleScroll = (event) => {
    const contentOffsetY = event.nativeEvent.contentOffset.y;

    // If the user is at the top and tries to scroll up when the sheet is fully open
    if (contentOffsetY <= 0 && isFullyOpened) {
      // Set the BottomSheet to 85% instead of closing it
      sheetRef.current?.snapToIndex(1); // Snap to the 85% position
    }
  };

  // Helper function to determine difficulty text
  const getDifficultyText = (priority) => {
    if (!priority) return 'Normal';
    if (priority <= 1) return 'Fácil';
    if (priority <= 2) return 'Medio';
    return 'Difícil';
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
      onChange={handleSheetChanges}  // Add the onChange event listener
    >
      <BottomSheetView style={styles.contentContainer}>
        {/* Conditionally render ScrollView based on the bottom sheet state */}
        <ScrollView 
          className="flex-1 px-5" 
          scrollEnabled={isFullyOpened}
          onScroll={handleScroll}  // Detect the scroll event
          scrollEventThrottle={16}  // To optimize performance
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          {challenge && (
            <>
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
            </>
          )}
        </ScrollView>
      </BottomSheetView>
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
    flex: 1,
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