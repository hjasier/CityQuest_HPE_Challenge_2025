import { View, Text, StyleSheet } from 'react-native'
import React, { useRef, useMemo } from 'react'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import ChallengeDetails from './ChallengeDetails'

const BottomSheetChallengeDetails = ({ bottomSheetRef }) => {
  // Ref for the bottom sheet
  const sheetRef = useRef(bottomSheetRef || null);
  
  // Define snap points
  const snapPoints = useMemo(() => ['60%', '85%','100%'], []);

  return (
    <BottomSheet
      ref={sheetRef}
      snapPoints={snapPoints}
      initialSnapIndex={0}
      handleIndicatorStyle={styles.indicator}
      backgroundStyle={styles.bottomSheetBackground}
    >
      <BottomSheetView style={styles.contentContainer}>
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
      </BottomSheetView>
    </BottomSheet>
  )
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

export default BottomSheetChallengeDetails