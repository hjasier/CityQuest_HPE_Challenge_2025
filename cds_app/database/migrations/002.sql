-- Creating UUID extension if not already available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the User table
CREATE TABLE "User" (
    id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    avatar_url TEXT,
    social_credit INT
);

-- Create the ChallengeType table
CREATE TABLE "ChallengeType" (
    id INT NOT NULL PRIMARY KEY,
    type VARCHAR(100) NOT NULL
);

-- Create the ChallengeTag table
CREATE TABLE "ChallengeTag" (
    id INT NOT NULL PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

-- Create the Location table first, since Challenge references it
CREATE TABLE "Location" (
    id INT NOT NULL PRIMARY KEY,
    point GEOGRAPHY(POINT, 4326),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url TEXT,
    sustainability_score INT,
    status TEXT,
    address TEXT,
    solicited_at TIMESTAMP,
    email TEXT,
    phone_number TEXT,
    opening_hours TEXT
);

-- Create the LocationType table
CREATE TABLE "LocationType" (
    id INT NOT NULL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url TEXT
);

-- Create the Capability table
CREATE TABLE "Capability" (
    id INT NOT NULL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Create the Location_Capability junction table
CREATE TABLE "Location_Capability" (
    locationid INT NOT NULL REFERENCES "Location"(id),
    capabilityid INT NOT NULL REFERENCES "Capability"(id),
    PRIMARY KEY (locationid, capabilityid)
);

-- Now we can create the Challenge table that references Location
CREATE TABLE "Challenge" (
    id INT NOT NULL PRIMARY KEY,
    type INT NOT NULL REFERENCES "ChallengeType"(id),
    completion_type TEXT,
    location INT REFERENCES "Location"(id),
    name TEXT,
    description TEXT,
    reward INT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    repeatable BOOLEAN NOT NULL DEFAULT false,
    cooldown_time INT,
    cover_url TEXT NOT NULL,
    priority INT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    expiration_date TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create the ChallengeTags junction table
CREATE TABLE "ChallengeTags" (
    challenge_id INT NOT NULL REFERENCES "Challenge"(id),
    tag_id INT NOT NULL REFERENCES "ChallengeTag"(id),
    PRIMARY KEY (challenge_id, tag_id)
);

-- Create the Required_capability table
CREATE TABLE "Required_capability" (
    challenge_id INT NOT NULL REFERENCES "Challenge"(id),
    capability_id INT NOT NULL REFERENCES "Capability"(id),
    PRIMARY KEY (challenge_id, capability_id)
);

-- Create the AcceptedChallenge table
CREATE TABLE "AcceptedChallenge" (
    id INT NOT NULL PRIMARY KEY,
    user_id INT NOT NULL,
    challenge_id INT NOT NULL REFERENCES "Challenge"(id),
    completed BOOLEAN DEFAULT false,
    campo TEXT,
    tipo TEXT,
    accepted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE,
    location_id INT REFERENCES "Location"(id),
    completion_flag INT,
    image_url_proof TEXT
);

-- Create the TransportMedium table
CREATE TABLE "TransportMedium" (
    id INT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    sustainability_score INT NOT NULL
);

-- Create the Route table
CREATE TABLE "Route" (
    id INT NOT NULL PRIMARY KEY,
    locationid INT NOT NULL REFERENCES "Location"(id),
    linestring GEOGRAPHY(LINESTRING),
    total_length FLOAT,
    time_limit INT
);

-- Fix user_id foreign key to match User table's UUID type
ALTER TABLE "AcceptedChallenge" DROP COLUMN user_id;
ALTER TABLE "AcceptedChallenge" ADD COLUMN user_id UUID NOT NULL REFERENCES "User"(id);

-- Create triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_challenge_modtime
    BEFORE UPDATE ON "Challenge"
    FOR EACH ROW
    EXECUTE PROCEDURE update_modified_column();

-- Enable row level security
ALTER TABLE "Challenge" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AcceptedChallenge" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (adjust as needed for your application)
CREATE POLICY "Challenges are viewable by everyone"
    ON "Challenge" FOR SELECT
    USING (true);

CREATE POLICY "Users can only view their own profile"
    ON "User" FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can view their own accepted challenges"
    ON "AcceptedChallenge" FOR SELECT
    USING (auth.uid() = user_id);

-- Add real-time functionality
CREATE PUBLICATION supabase_realtime FOR TABLE "Challenge", "AcceptedChallenge", "Location";