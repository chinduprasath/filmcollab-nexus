-- 1. Ensure users are allowed to insert their own profile 
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles 
  FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = id);

-- 2. Ensure users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles 
  FOR UPDATE TO authenticated 
  USING (auth.uid() = id);

-- 3. IMMEDIATELY FIX THE DATABASE INCONSISTENCY
-- This takes any user from the auth.users system who is missing a profile 
-- and automatically creates a row for them in the profiles table!
INSERT INTO public.profiles (id, email, full_name, role, username)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'full_name', 'User'), 
  'user',
  COALESCE(raw_user_meta_data->>'username', split_part(email, '@', 1))
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);

-- Reload schema
NOTIFY pgrst, 'reload schema';
