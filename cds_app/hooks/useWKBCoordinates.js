import { useMemo } from 'react';
import WKB from 'ol/format/WKB';

/**
 * Custom hook to parse WKB (Well-Known Binary) coordinates
 * @param {string} wkbHex - Hexadecimal representation of WKB geometry
 * @returns {Object|null} An object with latitude and longitude, or null if parsing fails
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
        // Extract coordinates
        const [longitude, latitude] = feature.getGeometry().getCoordinates();
        return { latitude, longitude };
      }
    } catch (error) {
      console.error('Error parsing WKB coordinates:', error);
    }

    return null;
  }, [wkbHex]);
};

