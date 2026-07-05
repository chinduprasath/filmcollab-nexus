-- Setup script for discover page data
-- Run this in your Supabase SQL Editor

-- First, let's check if the migration has been applied
-- If you see errors about missing columns, run the migration first

-- Update existing profiles with sample data
UPDATE public.profiles 
SET 
    role = 'Photographer',
    bio = 'Photographer and Visual Artist. Capturing moments that tell powerful stories.',
    location = 'Delhi, India',
    website = 'https://priyasharma.com',
    skills = ARRAY['Photography', 'Photo Editing', 'Adobe Lightroom', 'Adobe Photoshop'],
    experience_level = 'Senior',
    industry = 'photography',
    portfolio_url = 'https://priyasharma.portfolio.com',
    linkedin_url = 'https://linkedin.com/in/priyasharma',
    github_url = 'https://github.com/priyasharma',
    is_verified = true,
    followers_count = 67,
    projects_count = 12,
    posts_count = 45,
    likes_count = 67
WHERE id = (SELECT id FROM public.profiles LIMIT 1);

-- First, let's create some test users in auth.users (if they don't exist)
-- Note: This approach creates profiles without requiring actual auth users
-- We'll set user_id to NULL to bypass the foreign key constraint

-- Insert additional sample profiles with NULL user_id (for demo purposes)
INSERT INTO public.profiles (
    user_id,
    full_name,
    role,
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
    likes_count
) VALUES 
(
    NULL, -- No foreign key constraint for demo data
    'Amelia Chen',
    'Sound Designer',
    'Sound Designer and Audio Engineer with expertise in film and game audio.',
    'San Francisco, CA',
    'https://ameliachen.com',
    ARRAY['Sound Design', 'Audio Engineering', 'Pro Tools', 'Logic Pro'],
    'Senior',
    'film',
    'https://ameliachen.portfolio.com',
    'https://linkedin.com/in/ameliachen',
    'https://github.com/ameliachen',
    true,
    156,
    8,
    23,
    156
),
(
    NULL,
    'Marcus Thompson',
    'Film Editor',
    'Film Editor and Post-Production Specialist. Crafting compelling narratives through precise editing.',
    'London, UK',
    'https://marcusthompson.com',
    ARRAY['Video Editing', 'Post-Production', 'Adobe Premiere', 'DaVinci Resolve'],
    'Mid',
    'film',
    'https://marcusthompson.portfolio.com',
    'https://linkedin.com/in/marcusthompson',
    'https://github.com/marcusthompson',
    false,
    123,
    15,
    34,
    123
),
(
    NULL,
    'Raj Patel',
    'Film Director',
    'Film Director and Producer specializing in independent films and documentaries.',
    'Mumbai, India',
    'https://rajpatel.com',
    ARRAY['Directing', 'Producing', 'Screenwriting', 'Cinematography'],
    'Senior',
    'film',
    'https://rajpatel.portfolio.com',
    'https://linkedin.com/in/rajpatel',
    'https://github.com/rajpatel',
    true,
    45,
    6,
    18,
    45
),
(
    NULL,
    'Sarah Johnson',
    'Cinematographer',
    'Cinematographer with 8+ years of experience in film and commercial production. Passionate about visual storytelling.',
    'Los Angeles, CA',
    'https://sarahjohnson.com',
    ARRAY['Cinematography', 'Camera Operation', 'Lighting', 'Color Grading'],
    'Senior',
    'film',
    'https://sarahjohnson.portfolio.com',
    'https://linkedin.com/in/sarahjohnson',
    'https://github.com/sarahjohnson',
    true,
    89,
    20,
    67,
    89
),
(
    NULL,
    'Alex Rodriguez',
    'VFX Artist',
    'Creative Director and Visual Effects Artist. Bringing stories to life through cutting-edge VFX.',
    'New York, NY',
    'https://alexrodriguez.com',
    ARRAY['VFX', '3D Animation', 'Maya', 'After Effects'],
    'Senior',
    'film',
    'https://alexrodriguez.portfolio.com',
    'https://linkedin.com/in/alexrodriguez',
    'https://github.com/alexrodriguez',
    true,
    234,
    25,
    89,
    234
),
(
    NULL,
    'Emma Wilson',
    'Music Composer',
    'Film and TV Music Composer. Creating emotional soundscapes that enhance storytelling.',
    'Nashville, TN',
    'https://emmawilson.com',
    ARRAY['Music Composition', 'Orchestration', 'Logic Pro', 'Cubase'],
    'Mid',
    'music',
    'https://emmawilson.portfolio.com',
    'https://linkedin.com/in/emmawilson',
    'https://github.com/emmawilson',
    false,
    78,
    10,
    29,
    78
),
(
    NULL,
    'David Kim',
    'Animation Director',
    'Animation Director and Character Designer. Bringing characters to life through animation.',
    'Seoul, South Korea',
    'https://davidkim.com',
    ARRAY['Animation', 'Character Design', 'Maya', 'Blender'],
    'Senior',
    'animation',
    'https://davidkim.portfolio.com',
    'https://linkedin.com/in/davidkim',
    'https://github.com/davidkim',
    true,
    145,
    18,
    56,
    145
),
(
    NULL,
    'Lisa Martinez',
    'Documentary Filmmaker',
    'Documentary Filmmaker and Producer. Telling important stories that matter.',
    'Austin, TX',
    'https://lisamartinez.com',
    ARRAY['Documentary', 'Producing', 'Research', 'Interviewing'],
    'Mid',
    'documentary',
    'https://lisamartinez.portfolio.com',
    'https://linkedin.com/in/lisamartinez',
    'https://github.com/lisamartinez',
    false,
    92,
    7,
    31,
    92
);

-- Check how many profiles we have now
SELECT COUNT(*) as total_profiles FROM public.profiles;

-- Show sample of profiles
SELECT id, full_name, role, location, is_verified, followers_count 
FROM public.profiles 
ORDER BY created_at DESC 
LIMIT 10;
