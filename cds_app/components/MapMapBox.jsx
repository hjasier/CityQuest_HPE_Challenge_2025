import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import * as Location from 'expo-location';


// Configurar el token de Mapbox
MapboxGL.setAccessToken("pk.eyJ1IjoiYXNpaWVyIiwiYSI6ImNrenU0aW9zMjE4ZnEyb285eW1yY3p2N3oifQ.T2QoudfHezOdNRnRx2wIcA");

const Map = () => {
  const [location, setLocation] = useState(null);

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

  return (
    <View style={styles.container}>
      {location ? (
        <MapboxGL.MapView style={styles.map} zoomEnabled scaleBarEnabled={false} styleURL='mapbox://styles/asiier/cm86e6z8s007t01safl5m10hl/draft'>
          <MapboxGL.Camera centerCoordinate={location} zoomLevel={15} />
          {/* <MapboxGL.UserLocation visible={true} /> */}
        </MapboxGL.MapView>
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
