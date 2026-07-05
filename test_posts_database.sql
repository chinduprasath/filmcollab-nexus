-- Test Posts Database Setup
-- Run this script in Supabase SQL Editor to test the posts functionality

-- 1. Check if all required tables exist
SELECT 'Checking tables:' as info;
SELECT 
    table_name,
    CASE 
        WHEN table_name IN ('posts', 'post_likes', 'post_comments', 'post_saves') 
        THEN '✅ Exists' 
        ELSE '❌ Missing' 
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('posts', 'post_likes', 'post_comments', 'post_saves', 'profiles')
ORDER BY table_name;

-- 2. Check if profiles table has data
SELECT 'Profiles count:' as info;
SELECT COUNT(*) as profile_count FROM public.profiles;

-- 3. Check current user
SELECT 'Current user:' as info;
SELECT auth.uid() as user_id, auth.role() as role;

-- 4. Check if current user has a profile
SELECT 'Current user profile:' as info;
SELECT id, full_name, user_id FROM public.profiles WHERE user_id = auth.uid();

-- 5. Check RLS policies
SELECT 'RLS Policies:' as info;
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename IN ('posts', 'post_likes', 'post_comments', 'post_saves')
ORDER BY tablename, policyname;

-- 6. Check foreign key constraints
SELECT 'Foreign Key Constraints:' as info;
SELECT 
    tc.table_name, 
    tc.constraint_name, 
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name IN ('posts', 'post_likes', 'post_comments', 'post_saves')
ORDER BY tc.table_name;

-- 7. Test simple post creation
DO $$
DECLARE
    profile_id uuid;
    post_id uuid;
BEGIN
    -- Get the current user's profile ID
    SELECT id INTO profile_id FROM public.profiles WHERE user_id = auth.uid();
    
    IF profile_id IS NOT NULL THEN
        -- Try to create a test post
        INSERT INTO public.posts (
            content,
            author_id,
            is_published
        ) VALUES (
            'Test post from database test script',
            profile_id,
            true
        ) RETURNING id INTO post_id;
        
        RAISE NOTICE '✅ Test post created successfully with ID: %', post_id;
        
        -- Try to like the post
        INSERT INTO public.post_likes (post_id, user_id) 
        VALUES (post_id, profile_id);
        
        RAISE NOTICE '✅ Test like created successfully';
        
        -- Try to save the post
        INSERT INTO public.post_saves (post_id, user_id) 
        VALUES (post_id, profile_id);
        
        RAISE NOTICE '✅ Test save created successfully';
        
        -- Try to comment on the post
        INSERT INTO public.post_comments (post_id, user_id, content) 
        VALUES (post_id, profile_id, 'Test comment from database test script');
        
        RAISE NOTICE '✅ Test comment created successfully';
        
        -- Clean up test data
        DELETE FROM public.post_comments WHERE post_id = post_id;
        DELETE FROM public.post_saves WHERE post_id = post_id;
        DELETE FROM public.post_likes WHERE post_id = post_id;
        DELETE FROM public.posts WHERE id = post_id;
        
        RAISE NOTICE '✅ Test data cleaned up successfully';
        
    ELSE
        RAISE NOTICE '❌ No profile found for current user: %', auth.uid();
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '❌ Error during test: %', SQLERRM;
END $$;

-- 8. Final status
SELECT 'Database test completed!' as status;
