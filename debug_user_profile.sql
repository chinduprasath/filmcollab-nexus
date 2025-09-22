-- Debug User Profile Issues
-- Run this script in Supabase SQL Editor to debug profile issues

-- 1. Check current user
SELECT 'Current authenticated user:' as info;
SELECT auth.uid() as user_id, auth.role() as role;

-- 2. Check if profiles table exists and has data
SELECT 'Profiles table info:' as info;
SELECT COUNT(*) as total_profiles FROM public.profiles;

-- 3. Check current user's profile
SELECT 'Current user profile:' as info;
SELECT id, full_name, user_id, created_at 
FROM public.profiles 
WHERE user_id = auth.uid();

-- 4. Check all profiles (first 5)
SELECT 'Sample profiles:' as info;
SELECT id, full_name, user_id, created_at 
FROM public.profiles 
LIMIT 5;

-- 5. Check if there are any posts
SELECT 'Posts count:' as info;
SELECT COUNT(*) as total_posts FROM public.posts;

-- 6. Check if there are any post_likes
SELECT 'Post likes count:' as info;
SELECT COUNT(*) as total_likes FROM public.post_likes;

-- 7. Check if there are any post_comments
SELECT 'Post comments count:' as info;
SELECT COUNT(*) as total_comments FROM public.post_comments;

-- 8. Check if there are any post_saves
SELECT 'Post saves count:' as info;
SELECT COUNT(*) as total_saves FROM public.post_saves;

-- 9. Test creating a profile if it doesn't exist
DO $$
DECLARE
    current_user_id uuid;
    profile_exists boolean;
BEGIN
    current_user_id := auth.uid();
    
    IF current_user_id IS NOT NULL THEN
        -- Check if profile exists
        SELECT EXISTS(
            SELECT 1 FROM public.profiles WHERE user_id = current_user_id
        ) INTO profile_exists;
        
        IF NOT profile_exists THEN
            -- Create a profile
            INSERT INTO public.profiles (user_id, full_name, email)
            VALUES (
                current_user_id, 
                'User ' || substring(current_user_id::text, 1, 8),
                'user' || substring(current_user_id::text, 1, 8) || '@example.com'
            );
            
            RAISE NOTICE '✅ Profile created for user: %', current_user_id;
        ELSE
            RAISE NOTICE '✅ Profile already exists for user: %', current_user_id;
        END IF;
    ELSE
        RAISE NOTICE '❌ No authenticated user found';
    END IF;
END $$;

-- 10. Final check - show current user's profile
SELECT 'Final profile check:' as info;
SELECT id, full_name, user_id, created_at 
FROM public.profiles 
WHERE user_id = auth.uid();
