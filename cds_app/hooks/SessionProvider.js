import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../database/supabase';
import Auth from '../screens/Auth';

const SessionContext = createContext();

export const useSession = () => {
  return useContext(SessionContext);
};

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Escuchar cambios en la sesión
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);


  const getSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);
    return session;
  };

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {session && session.user ? children : <Auth />}
    </SessionContext.Provider>
  );
};
