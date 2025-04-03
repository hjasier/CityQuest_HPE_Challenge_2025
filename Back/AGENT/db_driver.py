import asyncio
from typing import Optional, List
from dataclasses import dataclass
from supabase import create_client, Client
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Supabase credentials (stored in .env file for security)
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY")

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)




class SupabaseDatabaseDriver:
    """Database Driver to interact with Supabase"""


    async def get_challenge_by_id(self, challenge_id: int):
        """Retrieves a challenge by its ID with related data"""
        response = supabase.table("Challenge").select("""
            *,
            ChallengeType (*),
            CompletionType (*),
            ChallengeTags (ChallengeTag (id,tag)),
            RequiredCapability (LocationCapability (name)),
            Location (*,Route(*))
        """).eq("id", challenge_id).execute()
        if response.error:
            return {"error": response.error.message}
        return response.data if response.data else None


    async def get_all_challenges(self):
        """Fetches all active challenges"""
        response = supabase.table("Challenge").select("id,name,description,reward,ChallengeType(type)").eq("active", True).execute()
        return response.data
    
    async def get_all_prizes(self):
        """Fetches all active prizes"""
        response = supabase.table("Prize").select("price,description").execute()
        return response.data
    
    





