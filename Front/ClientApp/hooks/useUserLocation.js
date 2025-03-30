import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';

const useUserLocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let locationSubscription;

    const requestLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permiso denegado', 'Se necesita acceso a la ubicación para mostrar el mapa.');
          setError('Permiso de ubicación denegado');
          return;
        }

        // Obtener ubicación inicial
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation([currentLocation.coords.longitude, currentLocation.coords.latitude]);

        // Suscribirse a actualizaciones de ubicación
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 5, // Cada 5 metros
            timeInterval: 2000,  // Máximo cada 2 segundos
          },
          (newLocation) => {
            setLocation([newLocation.coords.longitude, newLocation.coords.latitude]);
          }
        );
      } catch (err) {
        setError(err.message);
      }
    };

    requestLocation();

    // Cleanup al desmontar
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  return { location, error };
};

export default useUserLocation;
