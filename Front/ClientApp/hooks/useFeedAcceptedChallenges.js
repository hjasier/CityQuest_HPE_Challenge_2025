import { useState, useEffect } from 'react';
import { supabase } from '../database/supabase';

export const useFeedAcceptedChallenges = () => {
  const [FeedAcceptedChallenges, setFeedAcceptedChallenges] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeedAcceptedChallenges = async () => {
    try {
      setLoading(true);
      // Fetch FeedAcceptedChallenges with all related information
      const { data, error } = await supabase
        .from('AcceptedChallenge')
        .select(`
          *,
          User(username,avatar_url),    
          Challenge(*,Location(id,name,point,image_url,address))
        `);

      if (error) throw error;
       
      setFeedAcceptedChallenges(data);
      setLoading(false);
      return data; // Return the data for promise chaining
    } catch (err) {
      console.error('Error fetching FeedAcceptedChallenges:', err);
      setError(err);
      setLoading(false);
      throw err; // Throw the error so it can be caught in the promise chain
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchFeedAcceptedChallenges();

    // Set up real-time subscription
    const channel = supabase
      .channel('custom-FeedAcceptedChallenges-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'feedAcceptedChallenges' },
        () => {
          fetchFeedAcceptedChallenges();
        }
      )
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Method to manually refetch FeedAcceptedChallenges - now returns a Promise
  const refetch = () => {
    return fetchFeedAcceptedChallenges();
  };

  return {
    FeedAcceptedChallenges,
    loading,
    error,
    refetch
  };
};