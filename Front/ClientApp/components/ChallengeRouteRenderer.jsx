import { View, Text } from 'react-native'
import React from 'react'
import { useWKBCoordinates } from '../hooks/useWKBCoordinates';
import { useMemo } from 'react';
import MapboxGL from '@rnmapbox/maps';

const ChallengeRouteRenderer = ({userLocation, challenge}) => {


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


  if (!routeGeometry) {
    return <></>; // No route geometry available
  }


  return (
    <MapboxGL.ShapeSource
        id="challengeRouteLineBackground"
        shape={routeGeometry}
    >
        {/* Gradient Effect with Multiple Line Layers */}
        <MapboxGL.LineLayer
        id="challengeRouteLineBackground"
        style={{
            lineColor: 'rgba(40, 188, 30, 0.32)', 
            lineWidth: 9,
            lineOpacity: 0.5,
            lineCap: 'round',
            lineJoin: 'round'
        }}
        />
        <MapboxGL.LineLayer
        id="challengeRouteLineForeground"
        style={{
            lineColor: 'rgb(0, 163, 19)', 
            lineWidth: 5,
            lineOpacity: 0.8,
            lineCap: 'round',
            lineJoin: 'round',
            
        }}
        />
    </MapboxGL.ShapeSource>
  )
}

export default ChallengeRouteRenderer