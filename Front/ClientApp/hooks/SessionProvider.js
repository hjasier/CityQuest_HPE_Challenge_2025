import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../database/supabase';
import Auth from '../screens/Auth';
import LoadingScreen from '../components/LoadingScreen'; // Import the new LoadingScreen component

const SessionContext = createContext();

export const useSession = () => {
  return useContext(SessionContext);
};

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Obtain initial session
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking session:', error);
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen for session changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const getSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);
    return session;
  };

  // Show loading screen while checking authentication
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {session && session.user ? children : <Auth />}
    </SessionContext.Provider>
  );
};