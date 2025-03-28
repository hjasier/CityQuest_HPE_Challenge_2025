import React, { useRef, useState, useMemo, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import BottomSheet, { 
  BottomSheetScrollView, 
  BottomSheetView 
} from '@gorhom/bottom-sheet';
import ChallengesList from './ChallengeList';
import { useCurrentChallenge } from '../hooks/useCurrentChallenge';

const BottomSheetComponent = ({ bottomSheetRef }) => {
  const sheetRef = useRef(null);
  const [isOpen, setIsOpen] = useState(true);
  const { currentChallenge } = useCurrentChallenge();
  
  // Puntos de ajuste para el bottom sheet
  const snapPoints = useMemo(() => ['17%', '50%', '70%', '100%'], []);

  // Efecto para ajustar el bottom sheet cuando cambia el desafío actual
  useEffect(() => {
    sheetRef.current?.snapToIndex(0);
  }, [currentChallenge]);

  return (
    <BottomSheet
      ref={sheetRef}
      snapPoints={snapPoints}
      onClose={() => setIsOpen(false)}
      backgroundStyle={styles.bottomSheet}
      handleStyle={styles.handle}
      // Habilitar el desplazamiento del contenido
      enableContentPanningGesture={true}
      // Permitir que el contenido interno se desplace
      contentPosition="top"
    >
      {/* Usar BottomSheetScrollView para contenido desplazable */}
      <BottomSheetScrollView 
        contentContainerStyle={styles.bottomSheetContent}
        showsVerticalScrollIndicator={false} // Opcional: ocultar indicador de scroll
      >
        <ChallengesList />
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    flex: 1,
  },
  bottomSheetContent: {
    backgroundColor: 'rgba(255, 255, 255, 0)',
    flexGrow: 1, // Usar flexGrow en lugar de flex para contenido desplazable
  }
});

export default BottomSheetComponent;