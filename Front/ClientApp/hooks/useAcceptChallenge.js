import { useChallenges } from "./useChallenges";
import { useCurrentChallenge } from "./useCurrentChallenge";
import { useCurrentRoute } from "./useCurrentRoute";
import useUserLocation from "./useUserLocation";
import WKB from 'ol/format/WKB';
import * as Location from 'expo-location';

/**
 * Hook for accepting challenges and navigating to them
 */
export const useAcceptChallenge = () => {

  const { challenges } = useChallenges();
  const { setCurrentChallenge } = useCurrentChallenge();
  const { setCurrentRoute } = useCurrentRoute();
  

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


  /**
   * Accept a challenge and navigate to it
   * @param {Object} challenge - The complete challenge object
   */
  const acceptChallenge = async (challenge) => {
    setCurrentChallenge(challenge);
    const coordinates = parseWKB(challenge.Location?.point);
    const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest
    });
    setCurrentRoute({
      startCoordinates: [location.coords.longitude, location.coords.latitude], // User's current coordinates
      endCoordinates: [coordinates.longitude, coordinates.latitude], // Challenge coordinates
      profile: 'walking'
    });
  };
  
  /**
   * Accept a challenge by ID and navigate to it
   * @param {string} challengeId - The ID of the challenge to accept
   */
  const acceptChallengeById = (challengeId) => {
    const challenge = challenges.find(challenge => challenge.id === challengeId);
    if (challenge) {
      acceptChallenge(challenge);
    }
  };
  
  return {
    acceptChallenge,
    acceptChallengeById
  };
};

export default useAcceptChallenge;