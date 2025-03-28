import { useCallback } from 'react';
import { useCurrentRoute } from '../hooks/useCurrentRoute';
import { useCurrentGeometryRoute } from '../hooks/useCurrentGeometryRoute';
import { useCurrentChallenge } from './useCurrentChallenge';
import { Vibration } from 'react-native';


/**
 * Hook for handling challenge completion
 * @param {Object} navigation - Navigation object from React Navigation
 * @returns {Object} - Object containing challenge completion methods
 */
export const useChallengeCompletion = (navigation) => {

  const {currentChallenge , setCurrentChallenge } = useCurrentChallenge();
  const { currentRoute, setCurrentRoute } = useCurrentRoute();
  const { currentGeometryRoute , setCurrentGeometryRoute } = useCurrentGeometryRoute();


  /**
   * Navigate to the appropriate challenge completion screen
   * @param {Object} challenge - The challenge to be completed
   */
  const navigateToChallengeCompletion = useCallback((challenge) => {
    if (!challenge) {
      console.warn('No challenge provided for completion');
      return;
    }

    switch (challenge.completion_type) {
      case 'QR':
        navigation.navigate("ChallengeScanQRScreen", { challenge });
        break;
      case 'WKB':
        navigation.navigate("Main");
        break;
      case 'PHOTO':
        navigation.navigate("ChallengePhotoScreen", { challenge });
        break;
      case 'GPS':
        navigation.navigate("ChallengeGPSScreen", { challenge });
        break;
      default:
        console.warn(`Unsupported completion type: ${challenge.completion_type}`);
    }
  }, [navigation]);


  /**
    * Navigate to the challenge completed screen
    * 
    * @param {Object} challenge - The challenge that was completed
  **/
 

  const navigateCompleted = useCallback((challenge) => {
    if (!challenge) {
      console.warn('No challenge provided for completion');
      return;
    }

    // ACTUALIZAR SUPABASE


    navigation.navigate("ChallengeCompletedScreen")

    // BORRAR CURRENT
    abandonChallenge();
  }
  , [navigation]);


    const abandonChallenge = () => {
        setCurrentChallenge(null);
        setCurrentRoute(null);
        setCurrentGeometryRoute(null);
        Vibration.vibrate();
      }



  /**
   * Direct completion handler for challenges that can be completed without navigation
   * @param {Object} challenge - The challenge to be completed
   * @param {Function} completionCallback - Optional callback after completion
   */
  const directChallengeCompletion = useCallback(async (challenge, completionCallback) => {
    if (!challenge) {
      console.warn('No challenge provided for completion');
      return;
    }

    try {
      // Add your API call or completion logic here
      // For example:
      // const result = await completeChallenge(challenge.id);
      
      // Optional callback for additional actions
      if (completionCallback) {
        completionCallback(challenge);
      }
    } catch (error) {
      console.error('Error completing challenge:', error);
      // Optionally show an error to the user
    }
  }, []);

  return {
    navigateToChallengeCompletion,
    directChallengeCompletion,
    navigateCompleted,
    abandonChallenge
  };
};



export default useChallengeCompletion;