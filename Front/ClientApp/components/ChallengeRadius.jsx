import React from 'react';
import MapboxGL from '@rnmapbox/maps';
import circle from '@turf/circle';
import WKB from 'ol/format/WKB';
import { DETECTION_RADIUS } from '../hooks/constants';

const ChallengeRadius = ({ currentChallenge }) => {
  // Convertir HEX a Uint8Array
  const hexToUint8Array = (hex) => {
    return new Uint8Array(
      hex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
    );
  };

  // Parsear WKB
  const parseWKB = (hex) => {
    const wkb = new WKB();
    const feature = wkb.readFeature(hexToUint8Array(hex));
    if (feature) {
      const [longitude, latitude] = feature.getGeometry().getCoordinates();
      return { latitude, longitude };
    }
    return null;
  };

  // Check if challenge and location exist
  if (!currentChallenge || !currentChallenge.Location?.point) {
    return null;
  }

  // Parse coordinates
  const parsedCoordinates = parseWKB(currentChallenge.Location.point);
  if (!parsedCoordinates) return null;
  
  // Convert to array format [longitude, latitude] for turf
  const coordinates = [parsedCoordinates.longitude, parsedCoordinates.latitude];
  
  // Radius in kilometers (100 meters = 0.1 kilometers)
  const meters = DETECTION_RADIUS;
  const radiusInKm = meters / 1000;
  
  // Configuration for creating the circle
  const options = {
    units: 'kilometers', 
    properties: { challenge: currentChallenge.id }
  };

  // Create circle GeoJSON
  const circleGeoJSON = circle(coordinates, radiusInKm, options);

  return (
    <MapboxGL.ShapeSource
      id="challengeRadiusSource"
      shape={circleGeoJSON}
    >
      {/* Fill layer with transparent fill */}
      <MapboxGL.FillLayer
        id="challengeRadiusFill"
        style={{
          fillColor: 'rgba(45, 200, 125, 0.2)', // Light green with transparency
          fillOutlineColor: 'rgba(45, 200, 125, 0.5)' // Slightly more opaque outline
        }}
      />
      {/* Optional: Outline layer */}
      <MapboxGL.LineLayer
        id="challengeRadiusOutline"
        style={{
          lineColor: 'rgba(45, 200, 125, 0.7)', // Green outline
          lineWidth: 2
        }}
      />
    </MapboxGL.ShapeSource>
  );
};

export default ChallengeRadius;