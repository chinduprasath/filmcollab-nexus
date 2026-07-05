-- ==========================================
-- COMPLETE DATABASE MIGRATION & FIX FOR PROFILES
-- ==========================================
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql/new)
-- This script fixes constraints, updates RLS policies, fixes the trigger, and populates 14 discoverable creators.

-- ----------------------------------------------------
-- 1. DROP INCORRECT / SWAPPED CONSTRAINTS
-- ----------------------------------------------------
-- Drop the constraint restricting category to system roles ('user', 'admin')
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_category_check;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- ----------------------------------------------------
-- 2. MIGRATE EXISTING DATA TO PREVENT CONSTRAINT ERRORS
-- ----------------------------------------------------
-- For any existing rows, migrate role to lowercase ('user' or 'admin')
UPDATE public.profiles 
SET role = CASE 
    WHEN LOWER(role) = 'admin' THEN 'admin'
    ELSE 'user'
END
WHERE role IS NOT NULL;

-- If any existing profiles had 'user' or 'admin' as category, clear them or default to 'Creator'
-- since category should now store professional roles ('Writer', 'Director', 'Actor', etc.)
UPDATE public.profiles
SET category = 'Creator'
WHERE category IS NULL OR category = 'user' OR category = 'admin';

-- ----------------------------------------------------
-- 3. APPLY NEW CONSTRAINTS & DEFAULTS
-- ----------------------------------------------------
-- Ensure the role column defaults to 'user' in lowercase
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'user'::text;

-- Add check constraint for role to restrict to ('user', 'admin')
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role = ANY (ARRAY['user'::text, 'admin'::text]));

-- ----------------------------------------------------
-- 4. FIX TRIGGER & SIGNUP PROFILE CREATION FUNCTION
-- ----------------------------------------------------
-- Recreate the signup trigger function to use lowercase 'user' and default category
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (
    user_id, 
    full_name, 
    first_name, 
    last_name, 
    role, 
    category,
    email
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    'user', -- default system role
    COALESCE(NEW.raw_user_meta_data->>'category', 'Creator'), -- professional category
    NEW.email
  );
  
  RETURN NEW;
END;
$$;

-- Ensure the trigger is attached
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ----------------------------------------------------
-- 5. ENABLE RLS AND CONFIGURE PUBLIC SELECT POLICY
-- ----------------------------------------------------
-- Ensure RLS is active
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Recreate SELECT policy to allow public read (CRITICAL FOR DISCOVER PAGE WORK)
DROP POLICY IF EXISTS "Allow public read access for profiles" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
CREATE POLICY "Allow public read access for profiles" ON public.profiles
  FOR SELECT USING (true);

-- Recreate INSERT policy to allow signed-up users to create their profile
DROP POLICY IF EXISTS "Allow users to insert their own profiles" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
CREATE POLICY "Allow users to insert their own profiles" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Recreate UPDATE policy to allow users to edit their own profile
DROP POLICY IF EXISTS "Allow users to update their own profiles" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
CREATE POLICY "Allow users to update their own profiles" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Recreate DELETE policy to allow users to delete their own profile
DROP POLICY IF EXISTS "Allow users to delete their own profiles" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_policy" ON public.profiles;
CREATE POLICY "Allow users to delete their own profiles" ON public.profiles
  FOR DELETE USING (auth.uid() = user_id);

-- Grant privileges
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT ALL ON public.profiles TO service_role;

-- ----------------------------------------------------
-- 6. SEED THE 14 CREATORS WITH DETAILED INFORMATION
-- ----------------------------------------------------
-- Delete previous demo profiles with null user_id to prevent duplicate keys or pollution
DELETE FROM public.profiles WHERE user_id IS NULL;

-- Insert 14 beautiful discoverable creators
INSERT INTO public.profiles (
    user_id,
    full_name,
    role,
    category,
    bio,
    location,
    website,
    skills,
    experience_level,
    industry,
    portfolio_url,
    linkedin_url,
    github_url,
    is_verified,
    followers_count,
    projects_count,
    posts_count,
    likes_count,
    avatar_url
) VALUES 
(
    NULL,
    'Raj Patel',
    'user',
    'Director',
    'Award-winning Independent Film Director and Screenplay Writer. Bringing raw, human stories to screen with visual poignancy.',
    'Mumbai, India',
    'https://rajpatelfilms.com',
    ARRAY['Directing', 'Screenplay Writing', 'Cinematography', 'Independent Film'],
    'Senior',
    'film',
    'https://rajpatelfilms.com/portfolio',
    'https://linkedin.com/in/rajpatelfilms',
    NULL,
    true,
    142,
    8,
    29,
    142,
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
),
(
    NULL,
    'Sarah Johnson',
    'user',
    'Cinematographer / DOP',
    'Cinematographer with a passion for natural light, dynamic camera movement, and evocative color palettes.',
    'Los Angeles, CA',
    'https://sarahjohnsondop.com',
    ARRAY['Cinematography', 'Camera Operation', 'Lighting Design', 'Arri Alexa'],
    'Senior',
    'film',
    'https://sarahjohnsondop.com/reel',
    'https://linkedin.com/in/sarahjohnsondop',
    NULL,
    true,
    234,
    18,
    41,
    234,
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face'
),
(
    NULL,
    'Amelia Chen',
    'user',
    'Sound Engineer',
    'Foley Artist and Sound Designer specializing in immersive audio environments for feature films and documentaries.',
    'San Francisco, CA',
    'https://ameliachenaudio.com',
    ARRAY['Sound Design', 'Foley Recording', 'Pro Tools', 'Audio Post-Production'],
    'Senior',
    'film',
    'https://ameliachenaudio.com/portfolio',
    'https://linkedin.com/in/ameliachenaudio',
    'https://github.com/ameliachenaudio',
    true,
    98,
    11,
    18,
    98,
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
),
(
    NULL,
    'Marcus Thompson',
    'user',
    'Video Editor',
    'Film Editor with a focus on dramatic pacing, rhythmic storytelling, and high-quality color grading.',
    'London, UK',
    'https://marcusthompsoneditor.com',
    ARRAY['Video Editing', 'DaVinci Resolve', 'Premiere Pro', 'Color Grading'],
    'Mid',
    'television',
    'https://marcusthompsoneditor.com/reel',
    'https://linkedin.com/in/marcusthompsoneditor',
    NULL,
    false,
    87,
    14,
    22,
    87,
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
),
(
    NULL,
    'Elena Rostova',
    'user',
    'Lead Actor / Actress',
    'Classical theatre actress and film lead. Passionate about complex, multi-layered characters and physical storytelling.',
    'Paris, France',
    'https://elenarostova.com',
    ARRAY['Acting', 'Classical Theatre', 'Voice Over', 'Method Acting'],
    'Senior',
    'other',
    'https://elenarostova.com/showreel',
    'https://linkedin.com/in/elenarostova',
    NULL,
    true,
    312,
    15,
    54,
    312,
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
),
(
    NULL,
    'Alex Rodriguez',
    'user',
    'VFX Artist',
    'Visual Effects Supervisor and CGI Generalist. Turning imagination into photorealistic cinematic elements.',
    'New York, NY',
    'https://alexrodriguezvfx.com',
    ARRAY['VFX Supervision', '3D Modeling', 'Houdini', 'Nuke Compositing'],
    'Senior',
    'animation',
    'https://alexrodriguezvfx.com/vfx-reel',
    'https://linkedin.com/in/alexrodriguezvfx',
    'https://github.com/alexrodriguezvfx',
    true,
    189,
    22,
    37,
    189,
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face'
),
(
    NULL,
    'Priya Sharma',
    'user',
    'Script Writer',
    'Screenwriter and playwright. Specializing in cultural dramas, historical adaptations, and witty dialogue.',
    'Delhi, India',
    'https://priyasharmawrites.com',
    ARRAY['Screenwriting', 'Dialogue Writing', 'Creative Writing', 'Playwriting'],
    'Mid',
    'documentary',
    'https://priyasharmawrites.com/scripts',
    'https://linkedin.com/in/priyasharmawrites',
    NULL,
    true,
    115,
    9,
    14,
    115,
    'https://images.unsplash.com/photo-1534751516642-a131fed10495?w=150&h=150&fit=crop&crop=face'
),
(
    NULL,
    'John Doe',
    'user',
    'Producer',
    'Line Producer and Executive. Expert in budgeting, crew sourcing, and managing international filming schedules.',
    'Toronto, Canada',
    'https://johndoe-production.com',
    ARRAY['Line Producing', 'Budgeting', 'Film Logistics', 'Talent Relations'],
    'Senior',
    'television',
    'https://johndoe-production.com/projects',
    'https://linkedin.com/in/johndoeproducing',
    NULL,
    false,
    63,
    30,
    12,
    63,
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face'
),
(
    NULL,
    'David Kim',
    'user',
    'Music Director',
    'Orchestral and Electronic Music Composer for films and interactive media. Crafting unique sonic identities.',
    'Seoul, South Korea',
    'https://davidkimcomposer.com',
    ARRAY['Film Scoring', 'Orchestration', 'Synthesizers', 'Ableton Live'],
    'Senior',
    'music',
    'https://davidkimcomposer.com/tracks',
    'https://linkedin.com/in/davidkimcomposer',
    'https://github.com/davidkimcomposer',
    true,
    155,
    13,
    25,
    155,
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face'
),
(
    NULL,
    'Sophia Martinez',
    'user',
    'Art Director',
    'Production designer and art director with a love for vibrant color scripts and historical set accuracy.',
    'Mexico City, Mexico',
    'https://sophiamartinezart.com',
    ARRAY['Art Direction', 'Set Design', 'Concept Art', 'Color Scripting'],
    'Mid',
    'advertising',
    'https://sophiamartinezart.com/sets',
    'https://linkedin.com/in/sophiamartinezart',
    NULL,
    false,
    76,
    10,
    19,
    76,
    'https://images.unsplash.com/photo-1491349174775-aaafddd519d2?w=150&h=150&fit=crop&crop=face'
),
(
    NULL,
    'Yuki Sato',
    'user',
    'Motion Graphics Designer',
    'Title designer and kinetic typographer. Specializing in visual openings and stylised documentary overlays.',
    'Tokyo, Japan',
    'https://yukisatomotion.com',
    ARRAY['Motion Design', 'After Effects', 'Kinetic Typography', 'Title Sequences'],
    'Mid',
    'animation',
    'https://yukisatomotion.com/reel',
    'https://linkedin.com/in/yukisatomotion',
    'https://github.com/yukisatomotion',
    true,
    110,
    17,
    33,
    110,
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&h=150&fit=crop&crop=face'
),
(
    NULL,
    'Michael Brown',
    'user',
    'Documentaries',
    'Documentary filmmaker focusing on environmental conservation, local wisdom, and geopolitical borders.',
    'Sydney, Australia',
    'https://michaelbrowndocs.com',
    ARRAY['Directing', 'Documentary Production', 'Field Recording', 'Investigative Journalism'],
    'Senior',
    'documentary',
    'https://michaelbrowndocs.com/docs',
    'https://linkedin.com/in/michaelbrowndocs',
    NULL,
    true,
    145,
    7,
    15,
    145,
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&crop=face'
),
(
    NULL,
    'Zara Al-Farsi',
    'user',
    'Costume Designer',
    'Stylist and Costume Designer. Specializing in intricate historical wear and high-fashion advertisements.',
    'Dubai, UAE',
    'https://zaraalfarsidesign.com',
    ARRAY['Costume Design', 'Fashion Styling', 'Textile Selection', 'Historical Research'],
    'Senior',
    'advertising',
    'https://zaraalfarsidesign.com/portfolio',
    'https://linkedin.com/in/zaraalfarsi',
    NULL,
    true,
    210,
    16,
    28,
    210,
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face'
),
(
    NULL,
    'Leo Dubois',
    'user',
    'Video Editor',
    'Assistant film editor and assembly specialist. High workflow efficiency with multi-cam edits and media management.',
    'Brussels, Belgium',
    'https://leoduboiseditor.com',
    ARRAY['Avid Media Composer', 'Assistant Editing', 'Media Management', 'Syncing'],
    'Entry',
    'television',
    'https://leoduboiseditor.com/works',
    'https://linkedin.com/in/leoduboiseditor',
    NULL,
    false,
    42,
    5,
    9,
    42,
    'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&h=150&fit=crop&crop=face'
);

-- ----------------------------------------------------
-- 7. VERIFY RESULTS
-- ----------------------------------------------------
SELECT id, full_name, role, category, location, is_verified 
FROM public.profiles 
ORDER BY created_at DESC;
