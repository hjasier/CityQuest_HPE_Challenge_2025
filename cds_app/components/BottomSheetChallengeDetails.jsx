import { View, Text, StyleSheet } from 'react-native'
import React, { useRef, useMemo, useState } from 'react'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import ChallengeDetails from './ChallengeDetails'
import { ScrollView } from 'react-native-gesture-handler'

const BottomSheetChallengeDetails = ({ bottomSheetRef }) => {
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
          className="flex-1" 
          scrollEnabled={isFullyOpened}
          onScroll={handleScroll}  // Detect the scroll event
          scrollEventThrottle={16}  // To optimize performance
          showsVerticalScrollIndicator={false} // Oculta la barra vertical
          showsHorizontalScrollIndicator={false} // (Opcional) Oculta la barra horizontal
        >
          {/* Card Title */}
          <Text className="text-2xl font-bold mb-2">
            Prueba Comida Local en el Área de Deusto
          </Text>
          
          {/* Difficulty and Rating */}
          <View className="flex-row items-center mb-1">
            <Text className="text-gray-700 mr-2">Fácil</Text>
            <View className="flex-row items-center">
              <Text className="text-green-500 font-bold">★</Text>
              <Text className="ml-1">4.3</Text>
            </View>
          </View>
          
          {/* Location */}
          <Text className="text-gray-600 mb-4">
            Deusto, Bilbao, Vizcaya
          </Text>
          
          <View className="h-0.5 bg-gray-100 mb-4" />
          
          {/* Challenge Details Component */}
          <ChallengeDetails />

          
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
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  indicator: {
    backgroundColor: '#DDDDDD',
    width: 40,
    height: 4,
  },
});

export default BottomSheetChallengeDetails;
