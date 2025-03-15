import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Alert, Dimensions } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import * as Location from 'expo-location';
import DraggableButton from './AIButton'; // Import the component

// Configure Mapbox token
MapboxGL.setAccessToken("pk.eyJ1IjoiYXNpaWVyIiwiYSI6ImNrenU0aW9zMjE4ZnEyb285eW1yY3p2N3oifQ.T2QoudfHezOdNRnRx2wIcA");

const Map = () => {
  const [location, setLocation] = useState(null);
  const mapRef = useRef(null);
  const { width, height } = Dimensions.get('window');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se necesita acceso a la ubicación para mostrar el mapa.');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation([currentLocation.coords.longitude, currentLocation.coords.latitude]);
    })();
  }, []);

  // Handle button press
  const handleButtonPress = () => {
    console.log('Main button pressed');
  };

  // Handle radial button 1 press - Example: Take a photo at current location
  const handleRadial1Press = () => {
    console.log('Camera button pressed');
    // Implement camera functionality here
  };

  // Handle radial button 2 press - Example: Center map on user location
  const handleRadial2Press = () => {
    console.log('Chat button pressed');
    if (location && mapRef.current) {
      mapRef.current.setCamera({
        centerCoordinate: location,
        zoomLevel: 15,
        animationDuration: 1000,
      });
    }
  };

  return (
    <View style={styles.container}>
      {location ? (
        <View style={styles.mapContainer}>
          <MapboxGL.MapView
            ref={mapRef}
            style={styles.map}
            zoomEnabled
            scaleBarEnabled={false}
            styleURL='mapbox://styles/asiier/cm86e6z8s007t01safl5m10hl/draft'
          >
            <MapboxGL.Camera centerCoordinate={location} zoomLevel={15} />
            {/* <MapboxGL.UserLocation visible={true} /> */}
          </MapboxGL.MapView>
          
          {/* DraggableButton - contained within the map's boundaries */}
          <DraggableButton
            onPress={handleButtonPress}
            onRadial1={handleRadial1Press}
            onRadial2={handleRadial2Press}
          />
        </View>
      ) : (
        <View style={styles.loading} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  mapContainer: {
    flex: 1,
    position: 'relative', // This is important for properly positioning the button
  },
  map: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Map;