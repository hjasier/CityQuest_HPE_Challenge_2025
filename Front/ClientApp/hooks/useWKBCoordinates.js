import { useMemo } from 'react';
import WKB from 'ol/format/WKB';

/**
 * Custom hook to parse WKB (Well-Known Binary) coordinates
 * @param {string} wkbHex - Hexadecimal representation of WKB geometry
 * @returns {Array|Object|null} Array of coordinates for LineString, Object with lat/lng for Point, or null if parsing fails
 */
export const useWKBCoordinates = (wkbHex) => {
  return useMemo(() => {
    // If no WKB hex is provided, return null
    if (!wkbHex) return null;

    // Helper function to convert HEX to Uint8Array
    const hexToUint8Array = (hex) => {
      return new Uint8Array(
        hex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
      );
    };

    try {
      // Create WKB format parser
      const wkb = new WKB();
      
      // Read feature from WKB
      const feature = wkb.readFeature(hexToUint8Array(wkbHex));
      
      if (feature) {
        const geometry = feature.getGeometry();
        const geometryType = geometry.getType();
        
        // Handle different geometry types
        if (geometryType === 'Point') {
          // For Point geometries, return latitude and longitude object
          const [longitude, latitude] = geometry.getCoordinates();
          return { latitude, longitude };
        } else if (geometryType === 'LineString') {
          // For LineString geometries, return array of coordinate pairs
          const coordinates = geometry.getCoordinates();
          return coordinates.map(([longitude, latitude]) => ({ latitude, longitude }));
        } else {
          console.warn(`Unsupported geometry type: ${geometryType}`);
        }
      }
    } catch (error) {
      console.error('Error parsing WKB coordinates:', error);
    }
    
    return null;
  }, [wkbHex]);
};