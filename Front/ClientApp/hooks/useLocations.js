import { useState, useEffect } from 'react';
import { supabase } from '../database/supabase';

export const useLocations = () => {
  const [locations, setLocations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      // Fetch locations with all related information
      const { data, error } = await supabase
        .from('Location')
        .select(`
          *,
          LocationType (*),
          LocationCapabilities (LocationCapability (name)),
          Route(*)
        `);

      if (error) throw error;
       
      setLocations(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching locations:', err);
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchLocations();

    // Set up real-time subscription
    const channel = supabase
      .channel('custom-locations-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'Location' },
        () => {
          fetchLocations();
        }
      )
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Method to manually refetch locations if needed
  const refetch = () => {
    fetchLocations();
  };

  return {
    locations,
    loading,
    error,
    refetch
  };
};