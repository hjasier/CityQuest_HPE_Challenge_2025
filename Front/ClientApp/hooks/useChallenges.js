import { useState, useEffect } from 'react';
import { supabase } from '../database/supabase';

export const useChallenges = () => {
  const [challenges, setChallenges] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      // Fetch challenges with all related information
      const { data, error } = await supabase
        .from('Challenge')
        .select(`
          *,
          ChallengeType (*),
          CompletionType (*),
          ChallengeTags (ChallengeTag (id,tag)),
          RequiredCapability (LocationCapability (name)),
          Location (*)
        `);

      if (error) throw error;
        
      setChallenges(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching challenges:', err);
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchChallenges();

    // Set up real-time subscription
    const channel = supabase
      .channel('custom-challenges-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'Challenge' },
        () => {
          fetchChallenges();
        }
      )
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Method to manually refetch challenges if needed
  const refetch = () => {
    fetchChallenges();
  };

  return {
    challenges,
    loading,
    error,
    refetch
  };
};