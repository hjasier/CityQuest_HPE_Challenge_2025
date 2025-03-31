import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View , Vibration } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RequestPermission from '../components/RequestPermission';
import useChallengeCompletion from '../hooks/useChallengeCompletion';

const ChallengeScanQRScreen = ({route}) => {

    const [facing, setFacing] = useState('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const navigation = useNavigation();
    const { handleChallengeCompleted } = useChallengeCompletion(navigation);

    const challenge = route.params.challenge;


    if (!permission) {
    // Camera permissions are still loading.
    return <View />;
    }

    if (!permission.granted) {
      return (
        <RequestPermission 
          icon="camera-outline"
          title="Permiso para espiar tu camara uwu (ꈍᴗꈍ)♡"
          description="Necesitamos acceso a tu cámara para tomar fotos."
          onRequest={requestPermission}
        />
      );
    }


    function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    const handleBarcodeScanned = ({ data }) => {
        if (scanned) {
            return;
        }
        
        Vibration.vibrate();
        setScanned(true);
        loadChallengeStatus(data);
    };


    const loadChallengeStatus = async (data) => {
      handleChallengeCompleted(challenge);
    }


  return (
    <View style={styles.container}>
      <CameraView 
      style={styles.camera} 
      facing={facing}
      barcodeScannerSettings={{
        barcodeTypes: [
          'code128',
          'aztec',
          'ean13',
          'ean8',
          'pdf417',
          'upc_e',
          'datamatrix',
          'code39',
          'code93',
          'itf14',
          'codabar',
          'upc_a',
          'qr',
      ],
      }}
      onBarcodeScanned={handleBarcodeScanned}
      >
        <View className="items-center justify-center h-full px-4" >
          <View className="w-full rounded-2xl border-8 border-white h-52 w-52"></View>
        </View>
      </CameraView>
    </View>
  )
}

export default ChallengeScanQRScreen




const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});