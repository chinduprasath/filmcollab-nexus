-- Test script to debug authentication issues
-- Check if profiles table exists and has data

-- Check if profiles table exists
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- Check if category column exists
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name = 'category';

-- Check current profiles in the table
SELECT id, user_id, full_name, role, category, created_at
FROM public.profiles
ORDER BY created_at DESC
LIMIT 10;

-- Check if there are any users in auth.users
SELECT id, email, created_at, raw_user_meta_data
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;
