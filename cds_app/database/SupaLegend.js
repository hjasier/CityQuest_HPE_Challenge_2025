import { createClient } from '@supabase/supabase-js';
import { observable } from '@legendapp/state';
import { syncedSupabase } from '@legendapp/state/sync-plugins/supabase';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { configureSynced } from '@legendapp/state/sync';
import { observablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY } from "@env";

// Initialize Supabase client
const supabase = createClient(
  EXPO_PUBLIC_SUPABASE_URL,
  EXPO_PUBLIC_SUPABASE_ANON_KEY
);

// Function to generate IDs locally
const generateId = () => uuidv4();

// Create a configured sync function
const customSynced = configureSynced(syncedSupabase, {
  persist: {
    plugin: observablePersistAsyncStorage({
      AsyncStorage,
    }),
  },
  generateId,
  supabase,
  changesSince: 'last-sync',
  fieldCreatedAt: 'created_at',
  fieldUpdatedAt: 'updated_at',
  fieldDeleted: 'deleted',
});

// Observable for challenges collection
export const Challenge$ = observable(
  customSynced({
    supabase,
    collection: 'Challenge', // Update collection name to match your database
    select: (from) =>
      from
        .select(
          'id, type, completion_type, location, name, description, reward, active, repeatable, cooldown_time, cover_url, priority, created_at, updated_at, expiration_date'
        ) // Update the fields to match the new structure
        .eq('deleted', false), // If you have a 'deleted' flag in the database, add filtering
    actions: ['read', 'create', 'update', 'delete'],
    realtime: true,
    persist: {
      name: 'Challenge',
      retrySync: true,
    },
    retry: {
      infinite: true,
    },
  })
);
