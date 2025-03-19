import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import { EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY } from "@env";


const supabaseUrl = 'https://yvouepcwwstjvdcgvmon.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2b3VlcGN3d3N0anZkY2d2bW9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzMzk4NTUsImV4cCI6MjA1NjkxNTg1NX0.Skyc8_AIHMzjHC3yk8PbW31-5jRzyOzj2BzWZkyf7dI';



export const supabase = createClient(EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})