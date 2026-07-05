-- Debug script to test post creation
-- Run this in Supabase SQL Editor to test if the posts table is working correctly

-- First, let's check if we can insert a simple post
INSERT INTO public.posts (
    content,
    author_id,
    is_published
) VALUES (
    'Test post content',
    (SELECT id FROM public.profiles LIMIT 1), -- Use the first profile as author
    true
);

-- Check if the post was created
SELECT * FROM public.posts ORDER BY created_at DESC LIMIT 5;

-- Check the profiles table to make sure we have users
SELECT id, full_name FROM public.profiles LIMIT 5;

-- Check if there are any constraints that might be causing issues
SELECT 
    tc.table_name, 
    tc.constraint_name, 
    tc.constraint_type,
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'posts'
ORDER BY tc.constraint_type, tc.constraint_name;
