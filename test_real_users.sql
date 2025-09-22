-- Test script to verify real users that should appear in discover page
-- Run this in your Supabase SQL Editor

-- Show only real users (with user_id) that should appear in discover page
SELECT 
    id,
    full_name,
    role,
    user_id,
    created_at,
    CASE 
        WHEN full_name ILIKE '%admin%' THEN 'ADMIN - Will be excluded'
        WHEN role ILIKE '%admin%' THEN 'ADMIN - Will be excluded'
        ELSE 'REGULAR USER - Will be shown'
    END as discover_status
FROM public.profiles 
WHERE user_id IS NOT NULL 
  AND full_name IS NOT NULL
ORDER BY created_at DESC;

-- Count how many real users should appear
SELECT 
    COUNT(*) as total_real_users,
    COUNT(CASE WHEN full_name ILIKE '%admin%' OR role ILIKE '%admin%' THEN 1 END) as admin_users,
    COUNT(CASE WHEN full_name NOT ILIKE '%admin%' AND (role IS NULL OR role NOT ILIKE '%admin%') THEN 1 END) as regular_users
FROM public.profiles 
WHERE user_id IS NOT NULL 
  AND full_name IS NOT NULL;
