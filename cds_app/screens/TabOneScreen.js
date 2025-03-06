import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


export default function TabOneScreen() {
  const sheetRef = useRef(null);
  const [isOpen, setIsOpen] = useState(true);

  const snapPoints = useMemo(() => ['25%', '50%', '70%'], []);

  return (
    
      <View style={styles.container}>
        <Text>Open up App.tsx to start working on your app!</Text>
        <BottomSheet ref={sheetRef} snapPoints={snapPoints} enablePanDownToClose={true}>
          <BottomSheetView>
            <Text>Hello</Text>
          </BottomSheetView>
        </BottomSheet>
      </View>
 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
