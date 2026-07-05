-- Add category column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN category text DEFAULT 'user'::text;

-- Add check constraint for category values
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_category_check 
CHECK (category = ANY (ARRAY['user'::text, 'admin'::text]));

-- Create index for category column
CREATE INDEX IF NOT EXISTS idx_profiles_category 
ON public.profiles USING btree (category) TABLESPACE pg_default;

-- Update existing profiles to have 'user' category (if any exist)
UPDATE public.profiles 
SET category = 'user' 
WHERE category IS NULL;

-- Add comment to the column
COMMENT ON COLUMN public.profiles.category IS 'User category: user for normal users, admin for admin users';

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    user_id,
    full_name,
    first_name,
    last_name,
    role,
    category
  )
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'USER'),
    CASE 
      WHEN NEW.raw_user_meta_data->>'role' = 'ADMIN' THEN 'admin'
      ELSE 'user'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
