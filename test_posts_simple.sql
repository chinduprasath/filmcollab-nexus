-- Simple test to check posts table functionality
-- Run this in Supabase SQL Editor

-- 1. Check if we can see the posts table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'posts' 
ORDER BY ordinal_position;

-- 2. Check if there are any existing posts
SELECT COUNT(*) as post_count FROM public.posts;

-- 3. Check if profiles table has data
SELECT COUNT(*) as profile_count FROM public.profiles;

-- 4. Check the current user (if authenticated)
SELECT 'Current auth info:' as info;
SELECT auth.uid() as current_user_id, auth.role() as current_role;

-- 5. Check if current user has a profile
SELECT 'Current user profile:' as info;
SELECT id, full_name, user_id 
FROM public.profiles 
WHERE user_id = auth.uid();

-- 6. Test a simple insert (only if authenticated and profile exists)
-- This will show the exact error if it fails
DO $$
DECLARE
    profile_id uuid;
BEGIN
    -- Get the current user's profile ID
    SELECT id INTO profile_id FROM public.profiles WHERE user_id = auth.uid();
    
    IF profile_id IS NOT NULL THEN
        -- Try to insert a test post
        INSERT INTO public.posts (
            content,
            author_id,
            is_published
        ) VALUES (
            'Test post from SQL script',
            profile_id,
            true
        );
        
        RAISE NOTICE 'Test post inserted successfully with profile_id: %', profile_id;
    ELSE
        RAISE NOTICE 'No profile found for current user: %', auth.uid();
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error inserting test post: %', SQLERRM;
END $$;
