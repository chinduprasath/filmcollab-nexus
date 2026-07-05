-- Debug script to see what users are in the database
-- Run this in your Supabase SQL Editor

-- 1. Show all profiles with their details
SELECT 
    id,
    full_name,
    role,
    user_id,
    created_at,
    CASE 
        WHEN user_id IS NULL THEN 'Sample Data'
        WHEN full_name ILIKE '%admin%' THEN 'Admin User'
        WHEN role ILIKE '%admin%' THEN 'Admin Role'
        ELSE 'Regular User'
    END as user_type
FROM public.profiles 
ORDER BY created_at DESC;

-- 2. Count by user type
SELECT 
    CASE 
        WHEN user_id IS NULL THEN 'Sample Data'
        WHEN full_name ILIKE '%admin%' THEN 'Admin User'
        WHEN role ILIKE '%admin%' THEN 'Admin Role'
        ELSE 'Regular User'
    END as user_type,
    COUNT(*) as count
FROM public.profiles 
GROUP BY 
    CASE 
        WHEN user_id IS NULL THEN 'Sample Data'
        WHEN full_name ILIKE '%admin%' THEN 'Admin User'
        WHEN role ILIKE '%admin%' THEN 'Admin Role'
        ELSE 'Regular User'
    END
ORDER BY count DESC;

-- 3. Show only users that should appear in discover page
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
  AND (role IS NULL OR role NOT ILIKE '%admin%')
ORDER BY created_at DESC;

-- 4. Test the exact query the frontend should be running
SELECT * FROM public.profiles 
WHERE full_name IS NOT NULL
  AND full_name NOT ILIKE '%admin%'
  AND (role IS NULL OR role NOT ILIKE '%admin%')
ORDER BY created_at DESC;
