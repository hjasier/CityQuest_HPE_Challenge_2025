import { useCallback } from 'react';
import { useCurrentRoute } from '../hooks/useCurrentRoute';
import { useCurrentGeometryRoute } from '../hooks/useCurrentGeometryRoute';
import { useCurrentChallenge } from './useCurrentChallenge';
import { Vibration } from 'react-native';
import { supabase } from '../database/supabase';


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

    switch (challenge.CompletionType.type) {
      case 'QR':
        navigation.navigate("ChallengeScanQRScreen", { challenge });
        break;
      case 'PHOTO':
        navigation.navigate("ChallengePhotoScreen", { challenge });
        break;
      default:
        console.warn(`Unsupported completion type: ${challenge.CompletionType.type}`);
    }
  }, [navigation]);

  const handleChallengeCompleted = useCallback((challenge) => {
    if (!challenge) {
      console.warn('No challenge provided for completion');
      return;
    }
    navigation.navigate("ChallengeCompletedScreen", { challenge });
    abandonChallenge();
    Vibration.vibrate(1000);


    // ACTUALIZAR SUPABASE
    handleCompleteChallengeSupabase(challenge)


  }
  , []);

  const handleCompleteChallengeSupabase = async (challenge) => {
    try {
      // Get the current user's session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Error getting user session:', sessionError.message);
        return;
      }
      
      if (!session || !session.user) {
        console.error('No active user session found');
        return;
      }
      
      const userId = session.user.id;
      
      // Find the latest accepted challenge for this user and challenge
      const { data: existingChallenges, error: fetchError } = await supabase
        .from('AcceptedChallenge')
        .select('*')
        .eq('user_id', userId)
        .eq('challenge_id', challenge.id)
        .order('accepted_at', { ascending: false })
        .limit(1);
      
      if (fetchError) {
        console.error('Error fetching challenge:', fetchError.message);
        return;
      }
  
      let result;
      
      if (existingChallenges && existingChallenges.length > 0) {
        // Update the existing record to mark it as completed
        const { data, error } = await supabase
          .from('AcceptedChallenge')
          .update({
            completed: true,
            completed_at: new Date().toISOString()
          })
          .eq('id', existingChallenges[0].id)
          .select();
        
        if (error) {
          console.error('Error completing challenge:', error.message);
          return;
        }
        
        console.log('Challenge completed successfully:', data);
        result = data;
      } 
      else {
        // Insert a new completed challenge record if none exists
        const { data, error } = await supabase
          .from('AcceptedChallenge')
          .insert({
            user_id: userId,
            challenge_id: challenge.id,
            completed: true,
            completed_at: new Date().toISOString(),
            location_id: challenge.Location?.id || null
          })
          .select();
        
        if (error) {
          console.error('Error adding completed challenge:', error.message);
          return;
        }
        
        console.log('Challenge completed successfully (new record):', data);
        result = data;
      }
      
      return result;
    } catch (error) {
      console.error('Unexpected error while completing challenge:', error);
    }
  };

  /**
    * Navigate to the challenge completed screen
    * 
    * @param {Object} challenge - The challenge that was completed
  **/
 



    const abandonChallenge = () => {
        setCurrentChallenge(null);
        setCurrentRoute(null);
        setCurrentGeometryRoute(null);
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
    handleChallengeCompleted,
    abandonChallenge
  };
};



export default useChallengeCompletion;