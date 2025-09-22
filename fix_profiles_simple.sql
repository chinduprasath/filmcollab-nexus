-- Simple fix for profiles table - just add the basic missing columns
-- Run this first in your Supabase SQL Editor

-- Add basic columns that are missing
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS role TEXT;

-- Set default values for existing records
UPDATE public.profiles 
SET first_name = 'User',
    last_name = NULL,
    full_name = 'User',
    role = 'USER'
WHERE first_name IS NULL;

-- Check what we have now
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
LIMIT 5;
