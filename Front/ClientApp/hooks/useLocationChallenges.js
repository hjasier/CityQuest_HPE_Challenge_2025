import { useState, useEffect } from 'react';
import { useLocations } from './useLocations';
import { useChallenges } from './useChallenges';

export const useLocationChallenges = () => {
  const { locations, loading: locationsLoading, error: locationsError, refetch: refetchLocations } = useLocations();
  const { challenges, loading: challengesLoading, error: challengesError, refetch: refetchChallenges } = useChallenges();

  const [challengesByLocation, setChallengesByLocation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!locationsLoading && !challengesLoading && locations.length && challenges.length) {
      try {
        const locationChallengeMap = locations.map(location => {
          // 1. Retos asignados directamente a la ubicación
          const directChallenges = challenges.filter(
            challenge => challenge.location === location.id && challenge.RequiredCapability.length === 0
          );

          // 2. Retos con RequiredCapability que coinciden con las LocationCapabilities
          const capabilityChallenges = challenges.filter(challenge =>
            challenge.RequiredCapability.some(rc =>
              location.LocationCapabilities.some(lc => lc.capability_id === rc.capability_id)
            )
          );

          return {
            ...location,
            challenges: [...directChallenges, ...capabilityChallenges]
          };
        });
        //console.log('locationChallengeMap', JSON.stringify(locationChallengeMap, null, 2));
        setChallengesByLocation(locationChallengeMap);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    }
  }, [locations, challenges, locationsLoading, challengesLoading]);

  return {
    challengesByLocation,
    loading,
    error,
    refetchLocations,
    refetchChallenges
  };
};
