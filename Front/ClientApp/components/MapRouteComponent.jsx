import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import MapboxDirections from '@mapbox/mapbox-sdk/services/directions';
import { EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN } from '@env'; // Ensure you have your Mapbox access token in .env

// Configure Mapbox
MapboxGL.setAccessToken(EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN);

const MapRouteComponent = () => {
  const [route, setRoute] = useState(null);

  useEffect(() => {
    // Initialize the Directions service
    const directionsClient = MapboxDirections({
      accessToken: EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN
    });

    // Function to fetch route
    const fetchRoute = async (startCoords, endCoords) => {
      try {
        const response = await directionsClient.getDirections({
          waypoints: [
            { coordinates: startCoords }, // Starting point
            { coordinates: endCoords }    // Destination
          ],
          profile: 'driving', // or 'walking', 'cycling'
          geometries: 'geojson'
        }).send();

        // Extract the route from the response
        const newRoute = response.body.routes[0];
        setRoute(newRoute);
      } catch (error) {
        console.error('Error fetching route:', error);
      }
    };

    // Example: Calculate route from New York to Boston
    fetchRoute(
      [-74.0060, 40.7128], // New York coordinates
      [-71.0589, 42.3601]  // Boston coordinates
    );
  }, []);

  return (
    <View style={styles.container}>
      <MapboxGL.MapView style={styles.map}>
        <MapboxGL.Camera 
          centerCoordinate={[-74.0060, 40.7128]} 
          zoomLevel={5} 
        />
        

        
        {/* Render the route if available */}
        {route && (
          <MapboxGL.ShapeSource 
            id="routeSource" 
            shape={{
              type: 'Feature',
              geometry: route.geometry
            }}
          >
            <MapboxGL.LineLayer 
              id="routeLine"
              style={{
                lineColor: 'blue',
                lineWidth: 4,
                lineOpacity: 0.7
              }}
            />
          </MapboxGL.ShapeSource>
        )}






      </MapboxGL.MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    flex: 1
  }
});

export default MapRouteComponent;