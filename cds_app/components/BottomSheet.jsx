import React, { useRef, useState, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import ChallengesList from './ChallengeList';

const BottomSheetComponent = ({ bottomSheetRef }) => {
  const sheetRef = useRef(null);
  const [isOpen, setIsOpen] = useState(true);

  const snapPoints = useMemo(() => ['17%', '50%', '70%', '100%'], []);

  return (
    <BottomSheet
      ref={sheetRef}
      snapPoints={snapPoints}
      onClose={() => setIsOpen(false)}
      backgroundStyle={styles.bottomSheet}  // Aplica el fondo rojo a todo el BottomSheet
      handleStyle={styles.handle}  // Personaliza la barra superior
    >
      <BottomSheetView style={styles.bottomSheetContent}>
        <ChallengesList />
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    flex: 1,
  },
  bottomSheetContent: {
    backgroundColor:'rgba(255, 255, 255, 0)',  
    flex: 1,
  }
});

export default BottomSheetComponent;