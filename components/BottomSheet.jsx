import React, { useRef, useState, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import ChallengesList from './ChallengeList';

const BottomSheetComponent = ({ bottomSheetRef }) => {
  const sheetRef = useRef(null);
  const [isOpen, setIsOpen] = useState(true);

  const snapPoints = useMemo(() => ['8%', '50%', '70%', '100%'], []);

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
    backgroundColor: 'white',
    flex: 1,
  },
  bottomSheetContent: {
    backgroundColor: 'white',  
    flex: 1,
  }
});

export default BottomSheetComponent;