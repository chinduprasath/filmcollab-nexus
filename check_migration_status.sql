-- Check if the category column exists in profiles table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name = 'category';

-- Check if the trigger function exists
SELECT routine_name, routine_type
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';

-- Check if the trigger exists
SELECT trigger_name, event_manipulation, action_timing
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Check current profiles
SELECT id, user_id, full_name, role, category, created_at
FROM public.profiles
ORDER BY created_at DESC
LIMIT 5;