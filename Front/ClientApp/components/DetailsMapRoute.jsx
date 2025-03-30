import { View, Text } from 'react-native'
import React, { useMemo } from 'react'
import MapboxGL from '@rnmapbox/maps';
import { useWKBCoordinates } from '../hooks/useWKBCoordinates';
import { MapPin } from 'react-native-feather';

const DetailsMapRoute = ({ challenge }) => {
  const coordinates = useWKBCoordinates(challenge.Location?.point);
  const routeCoordinates = useWKBCoordinates(challenge.Location.Route[0].linestring);
  
  // Create GeoJSON geometry from route coordinates
  const routeGeometry = useMemo(() => {
    if (!routeCoordinates || !Array.isArray(routeCoordinates) || routeCoordinates.length < 2) {
      return null;
    }
    
    // Transform array of {latitude, longitude} objects to GeoJSON format [lng, lat]
    const coordinates = routeCoordinates.map(coord => [coord.longitude, coord.latitude]);
    
    return {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: coordinates
      }
    };
  }, [routeCoordinates]);

  // Calculate bounds for the route to fit all coordinates in view
  const bounds = useMemo(() => {
    if (!routeCoordinates || !Array.isArray(routeCoordinates) || routeCoordinates.length < 2) {
      // Default to point coordinates if no route
      return coordinates ? [
        [coordinates.longitude - 0.01, coordinates.latitude - 0.01],
        [coordinates.longitude + 0.01, coordinates.latitude + 0.01]
      ] : undefined;
    }
    
    // Find min/max coordinates to create a bounding box
    let minLng = Infinity;
    let maxLng = -Infinity;
    let minLat = Infinity;
    let maxLat = -Infinity;
    
    routeCoordinates.forEach(coord => {
      minLng = Math.min(minLng, coord.longitude);
      maxLng = Math.max(maxLng, coord.longitude);
      minLat = Math.min(minLat, coord.latitude);
      maxLat = Math.max(maxLat, coord.latitude);
    });
    
    // Add some padding to the bounds (10%)
    const lngPadding = (maxLng - minLng) * 0.1;
    const latPadding = (maxLat - minLat) * 0.1;
    
    return [
      [minLng - lngPadding, minLat - latPadding], // Southwest coordinates
      [maxLng + lngPadding, maxLat + latPadding]  // Northeast coordinates
    ];
  }, [routeCoordinates, coordinates]);

  return (
    <MapboxGL.MapView
      style={{ flex: 1 }}
      zoomEnabled
      scaleBarEnabled={false}
      styleURL='mapbox://styles/asiier/cm86e6z8s007t01safl5m10hl/draft'
    >
      {bounds ? (
        <MapboxGL.Camera 
          animationDuration={500}
          bounds={{
            ne: bounds[1],
            sw: bounds[0],
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 20,
            paddingBottom: 20
          }}
        />
      ) : (
        <MapboxGL.Camera 
          animationDuration={0}
          centerCoordinate={coordinates ? [coordinates.longitude, coordinates.latitude] : [0, 0]}
          zoomLevel={14} 
        />
      )}
      
      {coordinates && (
        <MapboxGL.PointAnnotation
          id="pointAnnotation"
          coordinate={[coordinates.longitude, coordinates.latitude]}
        >
          <MapPin stroke="#b00202" fill="#FF3B30" />
        </MapboxGL.PointAnnotation>
      )}
      
      {routeGeometry && (
        <MapboxGL.ShapeSource
          id="routeSource"
          shape={routeGeometry}
        >
          {/* Gradient Effect with Multiple Line Layers */}
          <MapboxGL.LineLayer
            id="routeLineBackground"
            style={{
              lineColor: 'rgba(220, 54, 54, 0.34)', 
              lineWidth: 8,
              lineOpacity: 0.5,
              lineCap: 'round',
              lineJoin: 'round'
            }}
          />
          <MapboxGL.LineLayer
            id="routeLineForeground"
            style={{
              lineColor: 'rgba(241, 6, 6, 0.8)', 
              lineWidth: 4,
              lineOpacity: 0.8,
              lineCap: 'round',
              lineJoin: 'round',
              
            }}
          />
        </MapboxGL.ShapeSource>
      )}
    </MapboxGL.MapView>
  )
}

export default DetailsMapRoute