-- Debug script to see what's in the profiles table
-- Run this in your Supabase SQL Editor

-- 1. Check table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Check if table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'profiles'
);

-- 3. Count records
SELECT COUNT(*) as total_profiles FROM public.profiles;

-- 4. Show sample data (if any)
SELECT * FROM public.profiles LIMIT 5;
