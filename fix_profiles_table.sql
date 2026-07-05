-- Fix profiles table by adding all missing columns
-- Run this in your Supabase SQL Editor

-- First, let's see what columns currently exist
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Add all missing columns
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS role TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS skills JSONB,
ADD COLUMN IF NOT EXISTS experience_level TEXT CHECK (experience_level IN ('Entry', 'Mid', 'Senior')),
ADD COLUMN IF NOT EXISTS industry TEXT CHECK (industry IN ('film', 'television', 'advertising', 'documentary', 'animation', 'photography', 'music', 'other')),
ADD COLUMN IF NOT EXISTS portfolio_url TEXT,
ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
ADD COLUMN IF NOT EXISTS github_url TEXT,
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS followers_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS projects_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS posts_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;

-- Update existing profiles to have proper names
-- For existing profiles without names, use a default
UPDATE public.profiles 
SET first_name = 'User',
    last_name = NULL,
    full_name = 'User',
    role = 'USER'
WHERE first_name IS NULL AND last_name IS NULL;

-- For profiles that might have some name data, try to populate full_name
UPDATE public.profiles 
SET full_name = CASE 
    WHEN first_name IS NOT NULL AND last_name IS NOT NULL THEN first_name || ' ' || last_name
    WHEN first_name IS NOT NULL THEN first_name
    WHEN last_name IS NOT NULL THEN last_name
    ELSE 'User'
END
WHERE full_name IS NULL;

-- Verify the changes
SELECT 
    id,
    user_id,
    first_name,
    last_name,
    full_name,
    role,
    created_at
FROM public.profiles 
ORDER BY created_at DESC
LIMIT 10;
