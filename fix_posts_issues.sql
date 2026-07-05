-- Fix Posts Table Issues
-- Run this script in Supabase SQL Editor

-- 1. First, let's check if the profiles table exists and has data
SELECT 'Profiles table check:' as info;
SELECT id, full_name, user_id FROM public.profiles LIMIT 5;

-- 2. Check current RLS policies on posts table
SELECT 'Current RLS policies on posts:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'posts';

-- 3. Check if RLS is enabled on posts table
SELECT 'RLS status on posts table:' as info;
SELECT schemaname, tablename, rowsecurity, forcerowsecurity
FROM pg_tables 
WHERE tablename = 'posts';

-- 4. Drop existing policies if they exist (to recreate them properly)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.posts;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.posts;
DROP POLICY IF EXISTS "Enable update for users who created the post" ON public.posts;
DROP POLICY IF EXISTS "Enable delete for users who created the post" ON public.posts;

-- 5. Recreate RLS policies with proper syntax
CREATE POLICY "posts_select_policy" ON public.posts 
FOR SELECT 
USING (true);

CREATE POLICY "posts_insert_policy" ON public.posts 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = author_id);

CREATE POLICY "posts_update_policy" ON public.posts 
FOR UPDATE 
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "posts_delete_policy" ON public.posts 
FOR DELETE 
USING (auth.uid() = author_id);

-- 6. Check the foreign key constraint
SELECT 'Foreign key constraint details:' as info;
SELECT 
    tc.table_name, 
    tc.constraint_name, 
    tc.constraint_type,
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
    AND tc.table_name = 'posts';

-- 7. Test insert with a simple post (replace with your actual user ID)
-- First, let's get the current user's profile ID
SELECT 'Current user profile ID:' as info;
SELECT id, full_name, user_id FROM public.profiles WHERE user_id = auth.uid();

-- 8. Test insert (this will only work if you're authenticated)
-- Uncomment and run this if you want to test:
/*
INSERT INTO public.posts (
    content,
    author_id,
    is_published
) VALUES (
    'Test post from SQL',
    auth.uid(),
    true
);
*/

-- 9. Check if there are any check constraints that might be causing issues
SELECT 'Check constraints on posts table:' as info;
SELECT 
    tc.table_name, 
    tc.constraint_name, 
    tc.constraint_type,
    cc.check_clause
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.check_constraints cc 
    ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name = 'posts' 
    AND tc.constraint_type = 'CHECK';
