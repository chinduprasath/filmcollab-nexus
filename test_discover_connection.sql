-- Test script to verify discover page database connection
-- Run this in your Supabase SQL Editor to debug the issue

-- 1. Check if profiles table exists and has data
SELECT 
    COUNT(*) as total_profiles,
    COUNT(CASE WHEN user_id IS NULL THEN 1 END) as demo_profiles,
    COUNT(CASE WHEN user_id IS NOT NULL THEN 1 END) as real_profiles
FROM public.profiles;

-- 2. Show all profiles with their data
SELECT 
    id,
    full_name,
    role,
    location,
    is_verified,
    followers_count,
    user_id,
    created_at
FROM public.profiles 
ORDER BY created_at DESC;

-- 3. Check if the new columns exist
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
AND column_name IN ('role', 'bio', 'location', 'skills', 'experience_level', 'industry', 'is_verified', 'followers_count', 'likes_count')
ORDER BY column_name;

-- 4. Test a simple query that the frontend should be able to run
SELECT * FROM public.profiles LIMIT 5;
