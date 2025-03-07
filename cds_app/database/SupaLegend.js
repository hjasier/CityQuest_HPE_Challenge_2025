import { createClient } from '@supabase/supabase-js';
import { observable } from '@legendapp/state';
import { syncedSupabase } from '@legendapp/state/sync-plugins/supabase';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { configureSynced } from '@legendapp/state/sync';
import { observablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initialize Supabase client
const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
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
export const challenges$ = observable(
  customSynced({
    supabase,
    collection: 'challenges',
    select: (from) =>
      from.select('id, name, description, category, difficulty, reward, image_url, start_date, end_date, deleted, created_at, updated_at'),
    actions: ['read', 'create', 'update', 'delete'],
    realtime: true,
    persist: {
      name: 'challenges',
      retrySync: true,
    },
    retry: {
      infinite: true,
    },
  })
);



// Observable for locations collection
export const locations$ = observable(
  customSynced({
    supabase,
    collection: 'locations',
    select: (from) =>
      from.select('id, challenge_id, name, latitude, longitude, address'),
    actions: ['read', 'create', 'update', 'delete'],
    realtime: true,
    persist: {
      name: 'locations',
      retrySync: true,
    },
    retry: {
      infinite: true,
    },
  })
  
);

// Observable for challenge details collection
export const challengeDetails$ = observable(
  customSynced({
    supabase,
    collection: 'challenge_details',
    select: (from) =>
      from.select('id, challenge_id, detail_type, details'),
    actions: ['read', 'create', 'update', 'delete'],
    realtime: true,
    persist: {
      name: 'challenge_details',
      retrySync: true,
    },
    retry: {
      infinite: true,
    },
  })
);

// Function to add a new challenge
export function addChallenge(name, description) {
  const id = generateId();
  challenges$[id].assign({
    id,
    name,
    description,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted: false,
  });
}

// Function to add a new location to a challenge
export function addLocation(challengeId, name, latitude, longitude, address) {
  const id = generateId();
  locations$[id].assign({
    id,
    challenge_id: challengeId,
    name,
    latitude,
    longitude,
    address,
  });
}

// Function to add new challenge details
export function addChallengeDetail(challengeId, detailType, details) {
  const id = generateId();
  challengeDetails$[id].assign({
    id,
    challenge_id: challengeId,
    detail_type: detailType,
    details: details,
  });
}

// Function to toggle challenge completion status (example for managing states)
export function toggleChallengeStatus(id) {
  challenges$[id].done.set((prev) => !prev);
}
