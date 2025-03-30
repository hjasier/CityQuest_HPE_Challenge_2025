import { useEffect, useState } from 'react';
import * as turf from '@turf/helpers';
import distance from '@turf/distance';

/**
 * Custom hook to check proximity to a challenge
 * @param {[number, number]} userLocation - Current user location [longitude, latitude]
 * @param {Object} challengeLocation - Challenge location object with latitude and longitude
 * @param {number} radiusInMeters - Radius to check (default 100 meters)
 * @returns {boolean} - Whether the user is within the specified radius
 */
export function useProximityToChallenge(
  userLocation, 
  challengeLocation, 
  radiusInMeters = 75
) {
  const [isNearChallenge, setIsNearChallenge] = useState(false);

  useEffect(() => {
    // Only check if both locations are valid and have coordinates
    if (!userLocation || !challengeLocation || 
        challengeLocation.latitude === undefined || 
        challengeLocation.longitude === undefined) return;

    // Create point features for user and challenge
    const userPoint = turf.point([userLocation[0], userLocation[1]]);
    const challengePoint = turf.point([
      challengeLocation.longitude, 
      challengeLocation.latitude
    ]);

    // Calculate distance between points
    const distanceToChallenge = distance(userPoint, challengePoint, {
      units: 'meters'
    });

    // Update proximity state
    setIsNearChallenge(distanceToChallenge <= radiusInMeters);
  }, [userLocation, challengeLocation, radiusInMeters]);

  return isNearChallenge;
}

