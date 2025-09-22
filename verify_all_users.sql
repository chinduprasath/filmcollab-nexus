-- Verify all users that should appear in discover page
-- Run this in your Supabase SQL Editor

-- Show all profiles with their user_id status
SELECT 
    id,
    full_name,
    role,
    user_id,
    CASE 
        WHEN user_id IS NULL THEN 'Sample Data (NULL user_id)'
        WHEN user_id IS NOT NULL THEN 'Real User (has user_id)'
    END as user_type,
    created_at
FROM public.profiles 
ORDER BY created_at DESC;

-- Count by user type
SELECT 
    CASE 
        WHEN user_id IS NULL THEN 'Sample Data'
        WHEN user_id IS NOT NULL THEN 'Real Users'
    END as user_type,
    COUNT(*) as count
FROM public.profiles 
GROUP BY 
    CASE 
        WHEN user_id IS NULL THEN 'Sample Data'
        WHEN user_id IS NOT NULL THEN 'Real Users'
    END;

-- Show only real users (what should appear in discover page)
SELECT 
    id,
    full_name,
    role,
    user_id,
    created_at
FROM public.profiles 
WHERE user_id IS NOT NULL 
  AND full_name IS NOT NULL
  AND full_name NOT ILIKE '%admin%'
  AND (role IS NULL OR role NOT ILIKE '%admin%')
ORDER BY created_at DESC;
