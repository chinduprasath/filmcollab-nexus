-- Script to manage admin users in the discover page
-- Run this in your Supabase SQL Editor

-- 1. Check all users and identify potential admin users
SELECT 
    id,
    full_name,
    role,
    email,
    user_id,
    created_at,
    CASE 
        WHEN full_name ILIKE '%admin%' THEN 'Admin by name'
        WHEN role ILIKE '%admin%' THEN 'Admin by role'
        WHEN email ILIKE '%admin%' THEN 'Admin by email'
        WHEN user_id IS NULL THEN 'Sample data'
        ELSE 'Regular user'
    END as user_type
FROM public.profiles 
ORDER BY created_at DESC;

-- 2. Count users by type
SELECT 
    CASE 
        WHEN full_name ILIKE '%admin%' THEN 'Admin by name'
        WHEN role ILIKE '%admin%' THEN 'Admin by role'
        WHEN email ILIKE '%admin%' THEN 'Admin by email'
        WHEN user_id IS NULL THEN 'Sample data'
        ELSE 'Regular user'
    END as user_type,
    COUNT(*) as count
FROM public.profiles 
GROUP BY 
    CASE 
        WHEN full_name ILIKE '%admin%' THEN 'Admin by name'
        WHEN role ILIKE '%admin%' THEN 'Admin by role'
        WHEN email ILIKE '%admin%' THEN 'Admin by email'
        WHEN user_id IS NULL THEN 'Sample data'
        ELSE 'Regular user'
    END
ORDER BY count DESC;

-- 3. Show only regular users (what should appear in discover page)
SELECT 
    id,
    full_name,
    role,
    location,
    is_verified,
    followers_count,
    created_at
FROM public.profiles 
WHERE user_id IS NOT NULL 
  AND full_name NOT ILIKE '%admin%'
  AND role NOT ILIKE '%admin%'
  AND email NOT ILIKE '%admin%'
ORDER BY created_at DESC;

-- 4. Update admin users to have a specific role (optional)
-- Uncomment and modify as needed:
/*
UPDATE public.profiles 
SET role = 'Administrator'
WHERE full_name ILIKE '%admin%' 
   OR role ILIKE '%admin%' 
   OR email ILIKE '%admin%';
*/

-- 5. Remove sample data (optional - only if you want to clean up)
-- Uncomment if you want to remove the demo data:
/*
DELETE FROM public.profiles 
WHERE user_id IS NULL;
*/
