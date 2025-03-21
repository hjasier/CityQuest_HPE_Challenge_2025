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


@dataclass
class Challenge:
    id: int
    name: str
    description: str
    reward: int
    active: bool
    cover_url: str
    created_at: str


class SupabaseDatabaseDriver:
    """Database Driver to interact with Supabase"""


    async def get_challenge_by_id(self, challenge_id: int) -> Optional[Challenge]:
        """Retrieves a challenge by its ID"""
        response = supabase.table("Challenge").select("*").eq("id", challenge_id).execute()
        if response.data:
            return Challenge(**response.data[0])
        return None

    async def get_all_challenges(self) -> List[Challenge]:
        """Fetches all active challenges"""
        response = supabase.table("Challenge").select("*").eq("active", True).execute()
        return [Challenge(**challenge) for challenge in response.data] if response.data else []





